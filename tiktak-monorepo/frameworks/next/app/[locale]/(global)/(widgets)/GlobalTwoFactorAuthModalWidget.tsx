"use client";

import {
    useEffect,
    useState,
    useCallback
} from 'react';
import { createPortal }
    from 'react-dom';
import { useGlobalTwoFactorAuthContext }
    from '@/app/[locale]/(global)/(context)/GlobalTwoFactorAuthContext';
import { useTranslations }
    from 'next-intl';
import {
    PiX,
    PiEnvelope,
    PiPhone,
    PiCheck,
    PiSpinner,
    PiShieldCheck,
    PiKey
} from 'react-icons/pi';

export function GlobalTwoFactorAuthModalWidget() {
    const {
        isModalOpen,
        isLoading,
        selectedMethod,
        isMethodForced,
        otpCode,
        setOtpCode,
        error,
        hideTwoFactorModal,
        sendOtp,
        verifyOtp
    } = useGlobalTwoFactorAuthContext();

    const t = useTranslations('TwoFactorAuth');
    // Use local method state but sync with context's selectedMethod when modal opens
    const [method, setMethod] = useState(selectedMethod);
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Countdown timer for resend
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    // Define handleSendOtp BEFORE the useEffect that uses it
    const handleSendOtp = useCallback(async (methodToSend: string) => {
        const result = await sendOtp(methodToSend);
        if (result.success) {
            setOtpSent(true);
            setCountdown(60); // 60 seconds countdown
        } else if (result.rateLimited) {
            // OTP already sent - show input fields with countdown from rate limit
            setOtpSent(true);
            setCountdown(result.nextAvailableIn || 60);
        }
    }, [sendOtp]);

    // Reset state when modal opens and sync with required method from API response
    useEffect(() => {
        if (isModalOpen) {
            setMethod(selectedMethod); // Use the method from context (set by API response)
            setOtpSent(false);
            setCountdown(0);
            
            // Auto-send OTP when method is forced (from API 428/429)
            if (isMethodForced) {
                handleSendOtp(selectedMethod);
            }
        }
    }, [isModalOpen, selectedMethod, isMethodForced, handleSendOtp]);

    const handleVerifyOtp = async () => {
        await verifyOtp();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && otpCode.length === 6) {
            handleVerifyOtp();
        }
    };

    if (!isModalOpen) return null;
    if (typeof window === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={hideTwoFactorModal}
            />

            <div className="relative bg-white rounded-primary shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-light">
                    <div className="flex items-center space-x-3">
                        <PiShieldCheck className="text-brandPrimary text-2xl" />
                        <div>
                            <h2 className="text-lg font-semibold text-dark">
                                {t('title', { defaultValue: 'Two-Factor Authentication' })}
                            </h2>
                            <p className="text-sm text-dark/60">
                                {isMethodForced 
                                    ? (method === 'email' 
                                        ? t('subtitle_email_required', { defaultValue: 'Email verification required to continue' })
                                        : t('subtitle_phone_required', { defaultValue: 'Phone verification required to continue' })
                                    )
                                    : t('subtitle', { defaultValue: 'Verify your identity to continue' })
                                }
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={hideTwoFactorModal}
                        className="p-1 text-dark/60 hover:text-brandPrimary transition-colors"
                    >
                        <PiX size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Method Selection - Hidden when method is forced by API */}
                    {!otpSent && !isMethodForced && (
                        <div className="space-y-4">
                            <p className="text-sm text-dark/80">
                                {t('choose_method', { defaultValue: 'Choose how you want to receive your verification code:' })}
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => setMethod('email')}
                                    className={`w-full flex items-center justify-between p-4 rounded-md border transition-all ${
                                        method === 'email'
                                            ? 'border-brand bg-brandPrimary/5 text-brandPrimary'
                                            : 'border-light hover:border-brand/30 hover:bg-brandPrimary/5'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <PiEnvelope className="text-xl" />
                                        <div className="text-left">
                                            <p className="font-medium">
                                                {t('email_option', { defaultValue: 'Email' })}
                                            </p>
                                            <p className="text-xs text-dark/60">
                                                {t('email_description', { defaultValue: 'Receive code via email' })}
                                            </p>
                                        </div>
                                    </div>
                                    {method === 'email' && <PiCheck className="text-brandPrimary" size={20} />}
                                </button>

                                <button
                                    onClick={() => setMethod('phone')}
                                    className={`w-full flex items-center justify-between p-4 rounded-md border transition-all ${
                                        method === 'phone'
                                            ? 'border-brand bg-brandPrimary/5 text-brandPrimary'
                                            : 'border-light hover:border-brand/30 hover:bg-brandPrimary/5'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <PiPhone className="text-xl" />
                                        <div className="text-left">
                                            <p className="font-medium">
                                                {t('phone_option', { defaultValue: 'SMS' })}
                                            </p>
                                            <p className="text-xs text-dark/60">
                                                {t('phone_description', { defaultValue: 'Receive code via SMS' })}
                                            </p>
                                        </div>
                                    </div>
                                    {method === 'phone' && <PiCheck className="text-brandPrimary" size={20} />}
                                </button>
                            </div>

                            <button
                                onClick={() => handleSendOtp(method)}
                                disabled={isLoading}
                                className="w-full bg-brandPrimary text-white py-3 px-4 rounded-md font-medium hover:bg-brandPrimary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {isLoading && <PiSpinner className="animate-spin" size={16} />}
                                <span>
                                    {t('send_code', { defaultValue: 'Send Verification Code' })}
                                </span>
                            </button>
                        </div>
                    )}

                    {/* OTP Input */}
                    {otpSent && (
                        <div className="space-y-4">
                            <div className="text-center">
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                                    method === 'email' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                }`}>
                                    {method === 'email' ? <PiEnvelope size={24} /> : <PiPhone size={24} />}
                                </div>
                                <p className="text-sm text-dark/80 mb-2">
                                    {method === 'email'
                                        ? t('email_sent', { defaultValue: 'Code sent to your email' })
                                        : t('sms_sent', { defaultValue: 'Code sent to your phone' })
                                    }
                                </p>
                                <p className="text-xs text-dark/60">
                                    {t('enter_code', { defaultValue: 'Enter the 6-digit code' })}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={otpCode}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                        setOtpCode(value);
                                    }}
                                    onKeyPress={handleKeyPress}
                                    placeholder="000000"
                                    className="w-full text-center text-2xl font-mono tracking-widest bg-brandPrimaryLightBg border border-light rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                                    maxLength={6}
                                />
                                <p className="text-xs text-center text-dark/60">
                                    {t('auto_verify', { defaultValue: 'Press Enter or click Verify when complete' })}
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            <div className="space-y-3">
                                <button
                                    onClick={handleVerifyOtp}
                                    disabled={isLoading || otpCode.length !== 6}
                                    className="w-full bg-brandPrimary text-white py-3 px-4 rounded-md font-medium hover:bg-brandPrimary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    {isLoading && <PiSpinner className="animate-spin" size={16} />}
                                    <PiKey size={16} />
                                    <span>
                                        {t('verify', { defaultValue: 'Verify Code' })}
                                    </span>
                                </button>

                                {/* Only show "Change Method" if method is not forced by API */}
                                {!isMethodForced && (
                                    <button
                                        onClick={() => {
                                            setOtpSent(false);
                                            setCountdown(0);
                                        }}
                                        className="w-full text-brandPrimary py-2 px-4 rounded-md font-medium hover:bg-brandPrimary/5 transition-colors"
                                    >
                                        {t('change_method', { defaultValue: 'Change Method' })}
                                    </button>
                                )}

                                <button
                                    onClick={() => handleSendOtp(method)}
                                    disabled={isLoading || countdown > 0}
                                    className="w-full text-dark/60 py-2 px-4 rounded-md font-medium hover:text-brandPrimary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {countdown > 0
                                        ? `${t('resend_in', { defaultValue: 'Resend in' })} ${countdown}s`
                                        : t('resend_code', { defaultValue: 'Resend Code' })
                                    }
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-light bg-brandPrimaryLightBg/50">
                    <p className="text-xs text-dark/60 text-center">
                        {t('security_note', { defaultValue: 'This verification helps keep your account secure' })}
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
}
