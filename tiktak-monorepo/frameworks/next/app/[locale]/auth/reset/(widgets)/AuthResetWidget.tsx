"use client";

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';

import { useState }
  from 'react';
import { useRouter }
  from 'next/navigation';
import { toast }
  from 'react-toastify';
import { apiFetchHelper }
  from '@/lib/helpers/apiCallForSpaHelper';
import Image
  from 'next/image';
import { Link }
  from '@/i18n/routing';
import { loadClientSideCoLocatedTranslations }
  from '@/i18n/i18nClientSide';

interface FormData {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  otp?: string;
  password?: string;
  confirmPassword?: string;
}

export default function AuthResetWidget() {
  const { t } = loadClientSideCoLocatedTranslations('AuthResetWidget');
  const router = useRouter();
  const [step, setStep] = useState(1); // Step 1: Email only, Step 2: OTP, password, confirmPassword
  const [formData, setFormData] = useState<FormData>({
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const validateStep1 = (): FormErrors => {
    const errors: FormErrors = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('valid_email_required');
    }
    return errors;
  };

  const validateStep2 = (): FormErrors => {
    const errors: FormErrors = {};
    if (!formData.otp || formData.otp.length !== 6) {
      errors.otp = t('valid_code_required');
    }
    if (!formData.password || formData.password.length < 8) {
      errors.password = t('password_min_length');
    }
    if (!/\d/.test(formData.password)) {
      errors.password = t('password_must_contain_number');
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('passwords_do_not_match');
    }
    return errors;
  };

  const handleRequestOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateStep1();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiFetchHelper({
        method: 'POST',
        url: '/api/auth/reset/request',
        body: { email: formData.email }
      });

      if (response.status === 200) {
        toast.success(t('reset_code_sent'));
        setStep(2);
      } else {
        toast.error(response.data?.error || t('failed_to_send_code'));
      }
    } catch (error) {
      toast.error(t('error_occurred'));
      ConsoleLogger.error('Reset request error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateStep2();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiFetchHelper({
        method: 'POST',
        url: '/api/auth/reset/set',
        body: {
          email: formData.email,
          otp: formData.otp,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }
      });

      if (response.status === 200) {
        toast.success(t('password_reset_success'));
        setTimeout(() => {
          router.push('/auth/login');
        }, 1500);
      } else {
        toast.error(response.data?.error || t('failed_to_reset'));
      }
    } catch (error) {
      toast.error(t('error_occurred'));
      ConsoleLogger.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full max-w-7xl m-auto py-4 px-4 my-4 md:my-6 lg:my-8 flex justify-center items-center">
      <div className="w-full max-w-md grid grid-cols-1 justify-center items-center gap-2">
        <Link href="/" className="text-sm text-dark mb-4 grid grid-cols-1 justify-center items-center gap-2">
          <div className="col-span-1 flex justify-center items-center">
            <Image src="/logo.svg" alt="Back to home page" width="140" height="70" />
          </div>
          <div className="col-span-1 text-sm text-dark text-center">{t('back_to_home')}</div>
        </Link>

        <h1 className="text-2xl font-bold mb-4 text-dark text-center">
          {step === 1 ? t('reset_password') : t('enter_reset_code')}
        </h1>

        {step === 1 ? (
          // Step 1: Email input only
          <form onSubmit={handleRequestOtp} className="bg-white rounded px-4 pt-6 pb-8 w-full">
            <div className="mb-6">
              <label className="block text-dark text-sm font-light mb-2" htmlFor="email">
                {t('email')}
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-dark mb-3 leading-tight focus:outline-none focus:-outline"
                id="email"
                type="email"
                name="email"
                placeholder={t('email_placeholder')}
                value={formData.email}
                onChange={handleChange}
                required
              />
              {formErrors.email && <p className="text-red-500 text-sm italic font-bold">{formErrors.email}</p>}
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:-outline w-full"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? t('sending') : t('send_reset_code')}
              </button>
            </div>

            <div className="text-center mt-4">
              <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-800 text-sm">
                {t('back_to_login')}
              </Link>
            </div>
          </form>
        ) : (
          // Step 2: OTP, password and confirm password inputs
          <form onSubmit={handleResetPassword} className="bg-white rounded px-4 pt-6 pb-8 w-full">
            <div className="mb-6">
              <label className="block text-dark text-sm font-light mb-2" htmlFor="otp">
                {t('reset_code')}
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-dark mb-3 leading-tight focus:outline-none focus:-outline"
                id="otp"
                type="text"
                name="otp"
                placeholder={t('reset_code_placeholder')}
                value={formData.otp}
                onChange={handleChange}
                maxLength={6}
                required
              />
              {formErrors.otp && <p className="text-red-500 text-sm italic font-bold">{formErrors.otp}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-dark text-sm font-light mb-2" htmlFor="password">
                {t('new_password')}
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-dark mb-3 leading-tight focus:outline-none focus:-outline"
                id="password"
                type="password"
                name="password"
                placeholder={t('password_placeholder')}
                value={formData.password}
                onChange={handleChange}
                required
              />
              {formErrors.password && <p className="text-red-500 text-sm italic font-bold">{formErrors.password}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-dark text-sm font-light mb-2" htmlFor="confirmPassword">
                {t('confirm_new_password')}
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-dark mb-3 leading-tight focus:outline-none focus:-outline"
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder={t('password_placeholder')}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {formErrors.confirmPassword && <p className="text-red-500 text-sm italic font-bold">{formErrors.confirmPassword}</p>}
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:-outline w-full"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? t('resetting') : t('reset_password_button')}
              </button>
            </div>

            <div className="text-center mt-4">
              <button
                className="text-indigo-600 hover:text-indigo-800 text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  setStep(1);
                }}
              >
                {t('try_different_email')}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
