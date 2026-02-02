"use client";

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';

import {
  useState,
  useEffect
} from 'react';
import {
  useRouter,
  useSearchParams
} from 'next/navigation';
import { toast }
  from 'react-toastify';
import { apiFetchHelper }
  from '@/lib/helpers/apiCallForSpaHelper';
import { Link }
  from '@/i18n/routing';
import Image
  from 'next/image';
import { useGlobalAuthProfileContext }
  from '@/app/[locale]/(global)/(context)/GlobalAuthProfileContext';
import { loadClientSideCoLocatedTranslations }
  from '@/i18n/i18nClientSide';

/**
 * Reusable Verification Widget
 * 
 * The widget automatically determines the verification mode (email/phone) based on URL parameters 
 * or the provided mode prop. The contact field is editable so users can update their phone if needed.
 * 
 * URL Parameters Supported:
 * - email: Specific email to verify (sets mode to 'email')
 * - phone: Specific phone to verify (sets mode to 'phone') 
 * - needVerification: 'email'|'phone' - indicates which type of verification is needed
 * - operation: 'verification'|'password_reset'|'2fa'|'email_change'|'phone_change'
 * - redirect: Where to redirect after successful verification
 * 
 * @param {Object} props
 * @param {string} props.operation - Operation type: 'verification', 'password_reset', '2fa', 'email_change', 'phone_change'
 * @param {string} props.mode - Mode: 'email' or 'phone' (determined by logic, not user-switchable)
 * @param {string} props.contact - Email or phone number to verify (editable)
 * @param {string} props.redirectPath - Where to redirect after successful verification
 * @param {string} props.backPath - Where the back button should go
 * @param {function} props.onSuccess - Callback function when verification succeeds
 * @param {function} props.onBack - Callback function for back button
 * @param {boolean} props.showLogo - Whether to show the logo
 * @param {boolean} props.showBackLink - Whether to show the back link
 * @param {string} props.title - Custom title override
 * @param {Object} props.customTexts - Custom text overrides
 */
interface AuthPhoneVerificationWidgetProps {
  operation?: string;
  mode?: string;
  contact?: string;
  redirectPath?: string;
  backPath?: string;
  onSuccess?: () => void;
  onBack?: () => void;
  showLogo?: boolean;
  showBackLink?: boolean;
  title?: string;
  customTexts?: Record<string, unknown>;
}

export function AuthPhoneVerificationWidget({
  operation = 'verification',
  mode: initialMode = 'phone',
  contact: initialContact = '',
  redirectPath = '/provider',
  backPath = '/auth/register',
  onSuccess,
  onBack,
  showLogo = true,
  showBackLink = true,
  title,
  customTexts = {}
}: AuthPhoneVerificationWidgetProps) {
  const { t } = loadClientSideCoLocatedTranslations('AuthPhoneVerificationWidget');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshProfile } = useGlobalAuthProfileContext();

  // Valid operation types that the API accepts
  const allowedOperations = ['verification', 'password_reset', '2fa', 'email_change', 'phone_change'];

  // Get parameters from URL if not provided as props
  const phoneFromQuery = searchParams.get('phone') || '';
  const operationFromUrl = searchParams.get('operation');
  const modeFromUrl = searchParams.get('mode');

  // Ensure operation is always valid - fallback chain: URL -> prop -> default
  let operationFromQuery = operationFromUrl || operation || 'verification';
  if (!allowedOperations.includes(operationFromQuery)) {
    ConsoleLogger.warn(`Invalid operation "${operationFromQuery}", falling back to "verification"`);
    operationFromQuery = 'verification';
  }

  // Determine initial mode - priority: specific contact params -> needVerification -> prop default
  const initialModeResolved = phoneFromQuery ? 'phone' :
    modeFromUrl === 'phone' ? 'phone' :
      initialMode;

  // Debug: Log mode determination if needVerification parameter is used
  if (modeFromUrl) {
    ConsoleLogger.log('VerificationWidget using mode parameter:', {
      mode: modeFromUrl,
      resolvedMode: initialModeResolved,
      operation: operationFromQuery
    });
  }

  const redirectFromQuery = searchParams.get('redirect') || redirectPath;

  // Initialize state
  const [mode, setMode] = useState(initialModeResolved);
  const [contact, setContact] = useState(phoneFromQuery || initialContact || '');
  const [otp, setOtp] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasCodeBeenSent, setHasCodeBeenSent] = useState(false);


  // Default texts for different operations
  const defaultTexts: Record<string, Record<string, string>> = {
    verification: {
      title: 'Verify your {mode}',
      sendButton: 'Send Code',
      resendButton: 'Resend Code',
      verifyButton: 'Verify {mode}',
      backText: '← Back to Registration',
      successMessage: '{mode} verified successfully',
      sendingMessage: 'Sending...',
      verifyingMessage: 'Verifying...'
    },
    password_reset: {
      title: 'Reset your password',
      sendButton: 'Send Reset Code',
      resendButton: 'Resend Reset Code',
      verifyButton: 'Verify Reset Code',
      backText: '← Back to Login',
      successMessage: 'Reset code verified successfully',
      sendingMessage: 'Sending...',
      verifyingMessage: 'Verifying...'
    },
    '2fa': {
      title: 'Two-Factor Authentication',
      sendButton: 'Send 2FA Code',
      resendButton: 'Resend 2FA Code',
      verifyButton: 'Verify 2FA Code',
      backText: '← Back',
      successMessage: '2FA verification successful',
      sendingMessage: 'Sending...',
      verifyingMessage: 'Verifying...'
    },
    email_change: {
      title: 'Verify new email',
      sendButton: 'Send Verification Code',
      resendButton: 'Resend Verification Code',
      verifyButton: 'Verify Email',
      backText: '← Back to Settings',
      successMessage: 'Email change verified successfully',
      sendingMessage: 'Sending...',
      verifyingMessage: 'Verifying...'
    },
    phone_change: {
      title: 'Verify new phone',
      sendButton: 'Send Verification Code',
      resendButton: 'Resend Verification Code',
      verifyButton: 'Verify Phone',
      backText: '← Back to Settings',
      successMessage: 'Phone change verified successfully',
      sendingMessage: 'Sending...',
      verifyingMessage: 'Verifying...'
    }
  };

  // Get texts for current operation with fallback to verification
  const texts = { ...defaultTexts[operationFromQuery] || defaultTexts.verification, ...customTexts } as Record<string, string>;

  // Sync with URL params
  useEffect(() => {
    if (phoneFromQuery) {
      setMode('phone');
      setContact(phoneFromQuery);
      return;
    }
    // Handle needVerification parameter
    if (modeFromUrl === 'phone') {
      setMode('phone');
      return;
    }
    if (modeFromUrl === 'email') {
      setMode('email');
      return;
    }
  }, [phoneFromQuery, modeFromUrl]);

  // Auto-fill contact from user profile if available
  useEffect(() => {
    if (!user || contact) return;

    if (mode === 'phone' && user.phone) setContact(user.phone);
  }, [user, mode, contact]);

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value: string) {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
  }

  async function handleSendCode() {
    try {
      const value = contact || (mode === 'email' ? user?.email : user?.phone) || '';

      if (!value || !isValidPhone(value)) {
        toast.error(t('enter_valid_phone'));
        return;
      }

      setIsSending(true);

      const body = {
        operation: operationFromQuery,
        phone: value.trim()
      };

      const response = await apiFetchHelper({
        url: '/api/auth/verify/phone/generate',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.data;

      if (result.error) {
        toast.error(result.message || 'Error sending code');
        return;
      }

      if (result.alreadyVerified) {
        toast.info(result.message || t('phone_already_verified'));
      } else {
        toast.success(result.message || t('code_sent'));
        if (result.devCode) toast.info(`Dev code: ${result.devCode}`);
      }

      // Mark that code has been sent successfully
      setHasCodeBeenSent(true);
    } catch (err) {
      const error = err as { message?: string };
      toast.error(error?.message || t('failed_to_send'));
    } finally {
      setIsSending(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (!otp || otp.length < 4) {
        toast.error(t('enter_verification_code'));
        return;
      }

      const value = contact || (mode === 'email' ? user?.email : user?.phone) || '';

      if (mode === 'email') {
        if (!value || !isValidEmail(value)) {
          toast.error(t('enter_valid_email'));
          return;
        }
      } else {
        if (!value || !isValidPhone(value)) {
          toast.error(t('enter_valid_phone'));
          return;
        }
      }

      setIsVerifying(true);

      const body = {
        operation: operationFromQuery,
        otp,
        ...(mode === 'email' ? { email: value.trim() } : { phone: value.trim() })
      };


      const response = await apiFetchHelper({
        url: '/api/auth/verify/phone/validate',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.data;

      if (result.error) {
        // Handle specific OTP expired errors
        if (result.error === 'Invalid or expired OTP' || result.error === 'Invalid or expired code') {
          toast.error(t('code_expired'));
          setOtp(''); // Clear the expired OTP
          return;
        }

        toast.error(result.message || 'Verification error');
        return;
      }

      toast.success(result.message || (texts.successMessage || '{mode} verified successfully').replace('{mode}', mode === 'email' ? t('email') : t('phone')));

      // Refresh profile context to get updated verification statuses
      refreshProfile();

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Default redirect behavior
        router.push(redirectFromQuery);
      }
    } catch (err) {
      const error = err as { message?: string };
      toast.error(error?.message || t('verification_failed'));
    } finally {
      setIsVerifying(false);
    }
  }


  function handleOtpChange(e: React.ChangeEvent<HTMLInputElement>) {
    const numeric = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(numeric);
  }

  function handleBackClick() {
    if (onBack) {
      onBack();
    } else {
      router.push(backPath);
    }
  }

  function handleContactChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setContact(newValue);
    // Reset verification state when contact changes
    if (hasCodeBeenSent) {
      setHasCodeBeenSent(false);
      setOtp('');
    }
  }

  const displayTitle = title || (texts.title || 'Verify your {mode}').replace('{mode}', mode);

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full max-w-md">
        <form onSubmit={handleVerify} className="bg-white rounded px-4 pt-6 pb-8 mb-2 mt-24">
          {showLogo && (
            <Link href="/" className="text-sm text-dark mb-4 grid grid-cols-1 justify-center items-center gap-2">
              <div className="col-span-1 flex justify-center items-center">
                <Image src={"/logo.svg"} alt="Back to home page" width="140" height="70" />
              </div>
              <div className="col-span-1 text-sm text-dark text-center">{t('back_to_home')}</div>
            </Link>
          )}

          <h1 className="text-2xl font-bold mb-4 text-dark text-center">{displayTitle}</h1>


          <div className="mb-4">
            <label className="block text-dark text-sm font-light mb-2" htmlFor="contact">
              {mode === 'email' ? t('email') : t('phone')}
            </label>
            <input
              id="contact"
              name="contact"
              type={mode === 'email' ? 'email' : 'tel'}
              inputMode={mode === 'email' ? 'email' : 'tel'}
              className="appearance-none border rounded w-full py-3 px-3 text-dark leading-tight focus:outline-none focus:border-indigo-500"
              placeholder={
                mode === 'email'
                  ? (user?.email || t('email_placeholder'))
                  : (user?.phone || t('phone_placeholder'))
              }
              value={contact}
              onChange={handleContactChange}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('edit_phone_hint')}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-dark text-sm font-light mb-2" htmlFor="otp">
              {t('verification_code')}
            </label>
            <input
              className="appearance-none border rounded w-full py-3 px-3 text-dark leading-tight focus:outline-none focus:-outline text-center text-lg font-mono"
              id="otp"
              name="otp"
              type="text"
              placeholder="000000"
              value={otp}
              onChange={handleOtpChange}
              maxLength={6}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:-outline disabled:opacity-50"
              type="submit"
              disabled={isVerifying}
            >
              {isVerifying ? (texts.verifyingMessage || 'Verifying...') : (texts.verifyButton || 'Verify {mode}').replace('{mode}', mode === 'email' ? 'Email' : 'Phone')}
            </button>

            <button
              type="button"
              onClick={handleSendCode}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:-outline disabled:opacity-50"
              disabled={isSending}
            >
              {isSending ? (texts.sendingMessage || 'Sending...') : (hasCodeBeenSent ? (texts.resendButton || 'Resend Code') : (texts.sendButton || 'Send Code'))}
            </button>

            {showBackLink && (
              <button
                type="button"
                onClick={handleBackClick}
                className="text-indigo-500 hover:text-indigo-700 text-sm py-2"
              >
                {texts.backText || '← Back'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
