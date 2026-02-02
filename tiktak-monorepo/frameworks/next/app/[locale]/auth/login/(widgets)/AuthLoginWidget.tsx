"use client";

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';

import {
  useState,
  useEffect
} from 'react';
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
import { useGlobalAuthProfileContext }
  from '@/app/[locale]/(global)/(context)/GlobalAuthProfileContext';
import { loadClientSideCoLocatedTranslations }
  from '@/i18n/i18nClientSide';

export function AuthLoginWidget() {
  const { t } = loadClientSideCoLocatedTranslations('AuthLoginWidget');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [returnUrl, setReturnUrl] = useState('/');
  const [deviceInfo, setDeviceInfo] = useState({});
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { updateProfileFromLogin, refreshProfile } = useGlobalAuthProfileContext();

  // get device info from local storage
  useEffect(() => {
    const stored = localStorage.getItem('deviceInfo');
    if (stored) setDeviceInfo(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const url = new URLSearchParams(window.location.search).get("returnUrl");
    if (url) setReturnUrl(url);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOAuthLogin = async (provider: string) => {
    try {
      // Save return URL for after authentication
      if (returnUrl) {
        localStorage.setItem('returnUrl', returnUrl);
      }

      localStorage.setItem('auth_provider', provider);

      const response = await apiFetchHelper({
        method: 'POST',
        url: `/api/auth/oauth/initiate`,
        body: { deviceInfo, provider }
      });

      if (response.status !== 200) {
        throw new Error(response.data?.error || 'Login failed');
      }

      const url = await response.data.url;
      if (url) {
        window.location.href = url; // Navigate to the URL returned by the OAuth response
      } else {
        throw new Error('No URL returned from OAuth provider');
      }
    } catch (error) {
      toast.error(t('oauth_error'));
      ConsoleLogger.error('Login error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiFetchHelper({
        method: 'POST',
        url: '/api/auth/login',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          email: formData.email,
          password: formData.password,
          deviceInfo
        },
      });

      ConsoleLogger.log('response', response);

      if (response.status === 200) {
        ConsoleLogger.log('Login successful!');
        toast.success(t('login_successful'));

        // Update auth profile context with login response data
        if (response.data) {
          updateProfileFromLogin(response.data);
          // Trigger full profile refresh after a short delay to get complete data
          setTimeout(() => {
            refreshProfile();
          }, 500);
        }

        // Wait for auth state to settle and toast to show
        await new Promise(resolve => setTimeout(resolve, 1000));

        const redirectPath = returnUrl || '/';
        router.replace(redirectPath);

      } else if (response.status === 201) {
        // Form validation errors
        setFormErrors({
          email: response.data.formError.email,
          password: response.data.formError.password
        });
        toast.error(`${t('login_failed')}: ${t('invalid_credentials')}`);
      } else {
        // Other errors
        toast.error(`${t('login_failed')}: ` + (response.data?.error || t('unknown_error')));
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : t('unexpected_error');
      toast.error(`${t('error_prefix')}: ${msg}`);
      ConsoleLogger.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full max-w-7xl m-auto py-4 px-4 my-4 md:my-6 lg:my-8 flex justify-center items-center">
      <div className="w-full max-w-md grid grid-cols-1 justify-center items-center gap-2">
        <Link href="/" className="text-sm text-dark mb-4 grid grid-cols-1 justify-center items-center gap-2">
          <div className="col-span-1 flex justify-center items-center">
            <Image src={"/logo.svg"} alt="Back to home page" width="140" height="70" />
          </div>
          <div className="col-span-1 text-sm text-dark text-center">{t('back_to_home')}</div>
        </Link>
        <h1 className="text-2xl font-bold mb-4 text-dark text-center">{t('page_title')}</h1>
        <form className="bg-white rounded px-4 pt-6 pb-8 w-full">
          <div className="mb-6">
            <label className="block text-dark text-sm font-light mb-2" htmlFor="email">
              {t('email')}
            </label>
            <input
              className=" appearance-none bg-brandPrimaryLightBg rounded w-full py-2 px-3 text-dark mb-3 leading-tight focus:outline-none focus:-outline"
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
          <div className="mb-6">
            <label className="block text-dark text-sm font-light mb-2" htmlFor="password">
              {t('password')}
            </label>
            <input
              className=" appearance-none bg-brandPrimaryLightBg rounded w-full py-2 px-3 text-dark mb-3 leading-tight focus:outline-none focus:-outline"
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
          <div className="grid grid-cols-1 items-center justify-between gap-2">
            <button
              className="bg-brandPrimary hover:bg-brandSecondary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:-outline "
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {t('login_button')}
            </button>
            <button
              className="bg-brandSecondary hover:bg-brandSecondary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:-outline"
              type="button"
              onClick={() => router.push('/auth/register')}
            >
              {t('register_button')}
            </button>
          </div>
          <div className="text-center mt-4">
            <Link href="/auth/reset" className="text-brandPrimaryDarkText hover:text-brandSecondaryDarkText text-sm">
              {t('forgot_password')}
            </Link>
          </div>
        </form>
        <div className="flex flex-col">
          <button
            onClick={() => handleOAuthLogin('google')}
            className="bg-white text-black font-normal py-2 px-4 rounded w-full mb-2 flex items-center gap-2 justify-center text-md"
          >
            <Image src={"/google.svg"} alt="Google" width="30" height="30" />
            {t('sign_in_with_google')}
          </button>
          <button
            onClick={() => handleOAuthLogin('facebook')}
            className="bg-white text-black font-normal py-2 px-4 rounded w-full mb-2 flex items-center gap-2 justify-center text-md"
          >
            <Image src={"/facebook.svg"} alt="Facebook" width="25" height="30" />
            {t('sign_in_with_facebook')}
          </button>
          <button disabled={true}
            onClick={() => handleOAuthLogin('apple')}
            className="bg-white text-black font-normal py-2 px-4 rounded w-full mb-2 flex items-center gap-2 justify-center text-md opacity-50 cursor-not-allowed"
          >
            <Image src={"/apple.svg"} alt="Apple" width="30" height="30" />
            {t('sign_in_with_apple')}
          </button>
        </div>
      </div>
    </section>
  );
}