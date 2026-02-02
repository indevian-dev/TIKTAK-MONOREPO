// pages/register.tsx
"use client";

import {
    useState,
    useEffect
} from 'react';
import { useRouter }
    from 'next/navigation';
import { toast }
    from 'react-toastify';
import { parseCookies }
    from 'nookies';
import { apiFetchHelper }
    from '@/lib/helpers/apiCallForSpaHelper';
import { Link }
    from '@/i18n/routing';
import Image
    from 'next/image';
import { AuthVerificationWidget }
    from '@/app/[locale]/auth/verify/(widgets)/AuthEmailVerificationWidget';
import { formatPhoneNumber }
    from '@/lib/utils/phoneUtility';
import { useGlobalAuthProfileContext }
    from '@/app/[locale]/(global)/(context)/GlobalAuthProfileContext';
import { useLocale } from 'next-intl';
import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
import { loadClientSideCoLocatedTranslations }
    from '@/i18n/i18nClientSide';

interface FormData {
    name: string;
    email: string;
    password: string;
    phone: string;
    confirmPassword: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    password?: string[];
    confirmPassword?: string;
    phone?: string;
}

export default function AuthRegisterWidget() {
    const { t } = loadClientSideCoLocatedTranslations('AuthRegisterWidget');
    const router = useRouter();
    const defaultLocale = 'az';
    const locale = useLocale() || defaultLocale;
    const { updateProfileFromLogin, refreshProfile } = useGlobalAuthProfileContext();

    // Registration flow states
    const [step, setStep] = useState('register'); // 'register' | 'verify'

    useEffect(() => {
        const cookies = parseCookies();
        const token = cookies.token;

        if (token) {
            if (locale !== defaultLocale) {
                router.push(`/${locale}/provider`);
            } else {
                router.push('/provider');
            }
            toast.success(t('already_logged_in'));
        }
    }, [router]);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        phone: '',
        confirmPassword: '',
    });

    const [loading, setLoading] = useState(false);

    // Validation errors state
    const [errors, setErrors] = useState<FormErrors>({
        name: '',
        email: '',
        password: [],
        confirmPassword: '',
        phone: ''
    });

    const handleOAuthLogin = async (provider: string) => {
        try {
            const deviceInfo = {}; // Get device info from your context or utility
            const response = await apiFetchHelper({
                method: 'POST',
                url: `/api/auth/oauth/initiate`,
                body: { deviceInfo, provider }
            });

            if (response.status !== 200) {
                throw new Error(response.data?.message || 'Login failed');
            }

            const url = await response.data.url;
            if (url) {
                window.location.href = url;
            } else {
                throw new Error('No URL returned from OAuth provider');
            }
        } catch (error) {
            toast.error(t('oauth_error'));
            ConsoleLogger.error('Login error:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;


        if (name === 'phone') {
            // Apply phone number formatting
            const { formattedPhone } = formatPhoneNumber({ phone: value });
            setFormData({ ...formData, [name]: formattedPhone });
        } else {
            setFormData({ ...formData, [name]: value });
        }

        // Clear errors when user starts typing
        const key = name as keyof FormErrors;
        if (errors[key]) {
            setErrors({ ...errors, [name]: name === 'password' ? [] : '' });
        }

        // Real-time confirm password validation
        if (name === 'confirmPassword') {
            const confirmError = value !== formData.password ? t('passwords_do_not_match') : '';
            setErrors({ ...errors, confirmPassword: confirmError });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Clear previous errors
        setErrors({
            name: '',
            email: '',
            password: [],
            confirmPassword: '',
            phone: ''
        });

        // Client-side validation
        let hasErrors = false;
        const newErrors = { ...errors };

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t('passwords_do_not_match');
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            // Clean phone number for API submission
            const { formattedPhone } = formatPhoneNumber({ phone: formData.phone });
            const submissionData = {
                ...formData,
                phone: formattedPhone
            };

            const response = await apiFetchHelper({
                url: '/api/auth/register',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            const result = await response.data;

            if (result.status !== 201) {
                // Handle server-side validation errors
                if (result.field && result.error) {
                    const newErrors = { ...errors };
                    const key = result.field as keyof FormErrors;
                    if (result.field === 'password' && result.validationErrors) {
                        newErrors.password = result.validationErrors;
                    } else if (result.field === 'confirmPassword') {
                        newErrors.confirmPassword = result.error;
                    } else if (key && key in newErrors) {
                        (newErrors as any)[key] = result.error;
                    }
                    setErrors(newErrors);
                } else {
                    toast.error(result.message || 'Registration failed');
                }
                setLoading(false);
                return;
            }

            if (result.requiresVerification) {
                // Update auth profile context with registration response data (user is now authenticated)
                if (result.user && result.account) {
                    updateProfileFromLogin(result);
                    // Trigger profile refresh after a delay to get complete data
                    setTimeout(() => {
                        refreshProfile();
                    }, 500);
                }

                // User is now authenticated automatically after registration
                // Move to verification step and prefill email via query param for the VerifyEmail component
                setStep('verify');
                try {
                    const currentPath = window.location.pathname;
                    const search = new URLSearchParams(window.location.search);
                    search.set('email', result.email);
                    // Set redirect to provider since user is now authenticated
                    search.set('redirect', locale !== defaultLocale ? `/${locale}/provider` : '/provider');
                    // do not retain any previous otp from older flow
                    search.delete('otp');
                    // replace URL without full reload
                    router.replace(`${currentPath}?${search.toString()}`);
                } catch { }
                toast.success(t('verify_email_message'));
            } else {
                // Registration without verification required
                // Update auth profile context with registration response data
                if (result.user && result.account) {
                    updateProfileFromLogin(result);
                }

                // Redirect to provider
                toast.success(result.message);
                if (locale !== defaultLocale) {
                    router.push(`/${locale}/provider`);
                } else {
                    router.push('/provider');
                }
            }
        } catch (error) {
            ConsoleLogger.error(error);
            const err = error as { message?: string };
            toast.error('Registration failed: ' + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    // Registration Form
    if (step === 'register') {
        return (
            <div className="w-full flex justify-center items-center">
                <div className="w-full max-w-md">
                    <form onSubmit={handleSubmit} className="bg-white rounded px-4 pt-6 pb-8 mb-2 mt-24">
                        <Link href="/" className="text-sm text-dark mb-4 grid grid-cols-1 justify-center items-center gap-2">
                            <div className="col-span-1 flex justify-center items-center">
                                <Image src={"/logo.svg"} alt="Back to home page" width="140" height="70" />
                            </div>
                            <div className="col-span-1 text-sm text-dark text-center">{t('back_to_home')}</div>
                        </Link>
                        <h1 className="text-2xl font-bold mb-4 text-dark text-center">{t('page_title')}</h1>

                        {/* Name field */}
                        <div className="mb-4">
                            <label className="block text-dark text-sm font-light mb-2" htmlFor="name">
                                {t('name')}
                            </label>
                            <input
                                className={`appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:-outline ${errors.name ? 'border-red-500' : ''}`}
                                id="name"
                                name="name"
                                type="text"
                                placeholder={t('name_placeholder')}
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Email field */}
                        <div className="mb-4">
                            <label className="block text-dark text-sm font-light mb-2" htmlFor="email">
                                {t('email')}
                            </label>
                            <input
                                className={`appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:-outline ${errors.email ? 'border-red-500' : ''}`}
                                id="email"
                                name="email"
                                type="email"
                                placeholder={t('email_placeholder')}
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Phone field */}
                        <div className="mb-4">
                            <label className="block text-dark text-sm font-light mb-2" htmlFor="phone">
                                {t('phone')}
                            </label>
                            <input
                                className={`appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:-outline ${errors.phone ? 'border-red-500' : ''}`}
                                id="phone"
                                name="phone"
                                type="text"
                                placeholder={t('phone_placeholder')}
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-xs italic mt-1">{errors.phone}</p>
                            )}
                        </div>

                        {/* Password field with comprehensive validation */}
                        <div className="mb-4">
                            <label className="block text-dark text-sm font-light mb-2" htmlFor="password">
                                {t('password')}
                            </label>
                            <input
                                className={`appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:-outline ${errors.password && errors.password.length > 0 ? 'border-red-500' : ''}`}
                                id="password"
                                name="password"
                                type="password"
                                placeholder={t('password_placeholder')}
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            {errors.password && errors.password.length > 0 && (
                                <div className="mt-1">
                                    {errors.password.map((error, index) => (
                                        <p key={index} className="text-red-500 text-xs italic">{error}</p>
                                    ))}
                                </div>
                            )}
                            {/* Password requirements hint */}
                            <div className="mt-1 text-xs text-gray-600">
                                <p>{t('password_requirements')}</p>
                                <ul className="list-disc list-inside ml-2">
                                    <li className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-600'}>
                                        {t('min_8_chars')}
                                    </li>
                                    <li className={/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-600'}>
                                        {t('at_least_one_number')}
                                    </li>
                                    <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-600'}>
                                        {t('at_least_one_uppercase')}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Confirm Password field */}
                        <div className="mb-4">
                            <label className="block text-dark text-sm font-light mb-2" htmlFor="passwordRepeat">
                                {t('repeat_password')}
                            </label>
                            <input
                                className={`appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:-outline ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder={t('password_placeholder')}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs italic mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Submit button */}
                        <div className="grid grid-cols-1 items-center justify-between gap-2">
                            <button
                                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:-outline disabled:opacity-50"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? t('sending') : t('register_button')}
                            </button>
                            <span className="text-center">{t('already_have_account')} </span>
                            <Link className="text-center text-sm hover:text-dark bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:-outline" href="/auth/login">{t('login')}</Link>
                        </div>
                    </form>
                    <div className="flex flex-col">
                        <button
                            onClick={() => handleOAuthLogin('google')}
                            className="bg-white text-black font-semibold py-2 px-4 rounded w-full mb-2 flex items-center gap-2 justify-center text-md"
                        >
                            <Image src={"/google.svg"} alt="Google" width="30" height="30" />
                            {t('sign_in_with_google')}
                        </button>
                        <button
                            onClick={() => handleOAuthLogin('facebook')}
                            className="bg-white text-black font-semibold py-2 px-4 rounded w-full mb-2 flex items-center gap-2 justify-center text-md"
                        >
                            <Image src={"/facebook.svg"} alt="Facebook" width="25" height="30" />
                            {t('sign_in_with_facebook')}
                        </button>
                        <button
                            onClick={() => handleOAuthLogin('apple')}
                            className="bg-white text-black font-semibold py-2 px-4 rounded w-full mb-2 flex items-center gap-2 justify-center text-md"
                        >
                            <Image src={"/apple.svg"} alt="Apple" width="30" height="30" />
                            {t('sign_in_with_apple')}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Verification Step: reuse centralized component
    return <AuthVerificationWidget />;
}