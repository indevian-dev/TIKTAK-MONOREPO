"use client";

import {
  useState,
  useEffect
} from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';
import Image
  from 'next/image';
import { Link } from '@/i18n/routing';
import { useGlobalAuthProfileContext } from '@/app/[locale]/(global)/(context)/GlobalAuthProfileContext';
import { ConsoleLogger } from '@/lib/logging/Console.logger';
import { GlobalLogoTile } from '@/app/[locale]/(global)/(tiles)/GlobalLogo.tile';
import { loadClientSideCoLocatedTranslations }
  from '@/i18n/i18nClientSide';
import { useTheme } from 'next-themes';

interface DeviceInfo {
  userAgent?: string;
  browser?: string;
  os?: string;
}

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email: string;
  password: string;
}

export function AuthLoginWidget() {
  const { t } = loadClientSideCoLocatedTranslations('AuthLoginWidget');
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [returnUrl, setReturnUrl] = useState<string>('/');
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { refreshProfile } = useGlobalAuthProfileContext();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const logoSrc = mounted && resolvedTheme === 'dark' ? '/logowhite.svg' : '/logoblack.svg';


  // get device info from local storage
  useEffect(() => {
    const deviceInfoStr = localStorage.getItem('deviceInfo');
    if (deviceInfoStr) {
      const deviceInfo = JSON.parse(deviceInfoStr) as DeviceInfo;
      setDeviceInfo(deviceInfo);
    }
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

      const response = await apiCall({
        method: 'POST',
        url: `/api/auth/oauth/initiate`,
        body: { deviceInfo, provider }
      });

      const url = response.data?.url;
      if (url) {
        window.location.href = url; // Navigate to the URL returned by the OAuth response
      } else {
        throw new Error('No URL returned from OAuth provider');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(t('login_error', { message: errorMessage }));
      ConsoleLogger.error('Login error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiCall({
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

      ConsoleLogger.log('Login successful!');
      toast.success(t('login_successful'));

      // Update auth profile context using refreshProfile
      await refreshProfile();
      ConsoleLogger.log('✅ Auth context updated via refreshProfile');

      // Wait for auth state to settle and toast to show
      await new Promise(resolve => setTimeout(resolve, 800));

      const redirectPath = (returnUrl && returnUrl !== '/') ? returnUrl : '/workspaces';
      router.replace(redirectPath);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(t('login_error', { message: errorMessage }));
      ConsoleLogger.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-app-bright-purple/5 via-white dark:via-gray-950 to-gray-50 dark:to-gray-900 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-app shadow-lg border border-black/10 dark:border-white/10 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center justify-between mb-10">
              <Link href="/" className="inline-flex items-center transition-opacity hover:opacity-80">
                <div className="relative h-8 w-28">
                  <Image
                    src={logoSrc}
                    alt="TikTak Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
              <Link href="/auth/register" className="text-xs font-semibold text-app-bright-purple hover:text-app-bright-purple/80 transition-colors">
                {t('need_account')}
              </Link>
            </div>

            <h1 className="text-2xl font-bold text-app-dark-purple dark:text-white">{t('sign_in')}</h1>
            <p className="text-sm text-app-dark-purple/70 dark:text-white/60 mt-1">{t('sign_in_description')}</p>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold text-app-dark-purple dark:text-white/60 uppercase tracking-wider mb-2" htmlFor="email">
                  {t('email')}
                </label>
                <input
                  className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md py-3 px-4 text-sm text-app-dark-purple dark:text-white placeholder:text-app-dark-purple/50 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-app-bright-purple/20 focus:border-app-bright-purple focus:bg-white dark:focus:bg-gray-800 transition-all"
                  id="email"
                  type="email"
                  name="email"
                  placeholder={t('email_placeholder')}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {formErrors.email && <p className="text-app-danger text-xs mt-1.5 ml-1">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-app-dark-purple dark:text-white/60 uppercase tracking-wider mb-2" htmlFor="password">
                  {t('password')}
                </label>
                <input
                  className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md py-3 px-4 text-sm text-app-dark-purple dark:text-white placeholder:text-app-dark-purple/50 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-app-bright-purple/20 focus:border-app-bright-purple focus:bg-white dark:focus:bg-gray-800 transition-all"
                  id="password"
                  type="password"
                  name="password"
                  placeholder={t('password_placeholder')}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {formErrors.password && <p className="text-app-danger text-xs mt-1.5 ml-1">{formErrors.password}</p>}
              </div>

              <div className="flex items-center justify-between pt-1">
                <Link href="/auth/reset" className="text-xs font-semibold text-app-bright-purple hover:text-app-bright-purple/80 transition-colors">
                  {t('forgot_password')}
                </Link>
                <span className="text-[11px] text-app-dark-purple/70 dark:text-white/50">{t('secured_with_device')}</span>
              </div>

              <button
                className="w-full rounded-xl bg-app-bright-purple hover:bg-app-bright-purple/90 text-white font-semibold py-3 text-sm transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? t('signing_in') : t('sign_in_button')}
              </button>

              <p className="text-center text-xs text-app-dark-purple/70 dark:text-white/60 pt-1">
                {t('need_account')}{' '}
                <Link href="/auth/register" className="text-app-bright-purple font-semibold hover:text-app-bright-purple/80 transition-colors">
                  {t('need_account')}
                </Link>
              </p>
            </form>

            {/* Social divider */}
            <div className="mt-8">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-app-dark-purple/70 dark:text-white/40">{t('social_login_soon')}</span>
                <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
              </div>
              <div className="grid grid-cols-3 gap-2.5 mt-5">
                <button
                  onClick={() => handleOAuthLogin('google')}
                  disabled
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 py-2.5 text-xs font-semibold text-app-dark-purple dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-40"
                >
                  <Image src={"/google.svg"} alt="Google" width={18} height={18} /> {t('google')}
                </button>
                <button
                  onClick={() => handleOAuthLogin('facebook')}
                  disabled
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 py-2.5 text-xs font-semibold text-app-dark-purple dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-40"
                >
                  <Image src={"/facebook.svg"} alt="Facebook" width={16} height={18} /> {t('facebook')}
                </button>
                <button
                  onClick={() => handleOAuthLogin('apple')}
                  disabled
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 py-2.5 text-xs font-semibold text-app-dark-purple dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-40"
                >
                  <Image src={"/apple.svg"} alt="Apple" width={18} height={18} /> {t('apple')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}