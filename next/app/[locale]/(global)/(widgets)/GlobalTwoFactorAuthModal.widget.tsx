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
import { BlockPrimitive } from '@/app/primitives/Block.primitive';

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

    const t = useTranslations('GlobalTwoFactorAuthModalWidget');
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
        <BlockPrimitive variant="modal">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={hideTwoFactorModal}
            />

            <div className="relative bg-white dark:bg-gray-900 rounded-app shadow-xl border border-black/10 dark:border-white/10 max-w-md w-full max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-app-bright-purple/10 dark:bg-app-bright-purple/20 text-app-bright-purple">
                            <PiShieldCheck className="text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-app-dark-purple dark:text-white">
                                {t('title', { defaultValue: 'Two-Factor Authentication' })}
                            </h2>
                            <p className="text-xs text-app-dark-purple/60 dark:text-white/60">
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
                    {!isMethodForced && (
                        <button
                            onClick={hideTwoFactorModal}
                            className="p-2 -mr-2 text-app-dark-purple/50 dark:text-white/50 hover:text-app-dark-purple dark:hover:text-white transition-colors rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
                        >
                            <PiX size={20} />
                        </button>
                    )}
                </div>

                <div className="p-6 space-y-6">
                    {/* Method Selection - Hidden when method is forced by API */}
                    {!otpSent && !isMethodForced && (
                        <div className="space-y-4 animate-in slide-in-from-right-4">
                            <p className="text-sm font-medium text-app-dark-purple/80 dark:text-white/80">
                                {t('choose_method', { defaultValue: 'Choose how you want to receive your verification code:' })}
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => setMethod('email')}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${method === 'email'
                                        ? 'border-app-bright-purple bg-app-bright-purple/5 text-app-bright-purple'
                                        : 'border-black/10 dark:border-white/10 hover:border-app-bright-purple/30 hover:bg-app-bright-purple/5 bg-white dark:bg-gray-800 group'
                                        }`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors ${method === 'email' ? 'bg-app-bright-purple/10 text-app-bright-purple' : 'bg-black/5 dark:bg-white/5 text-app-dark-purple/60 dark:text-white/60 group-hover:bg-app-bright-purple/10 group-hover:text-app-bright-purple'}`}>
                                            <PiEnvelope className="text-2xl" />
                                        </div>
                                        <div className="text-left">
                                            <p className={`font-semibold transition-colors ${method === 'email' ? 'text-app-bright-purple' : 'text-app-dark-purple dark:text-white group-hover:text-app-bright-purple'}`}>
                                                {t('email_option', { defaultValue: 'Email' })}
                                            </p>
                                            <p className="text-xs text-app-dark-purple/60 dark:text-white/60">
                                                {t('email_description', { defaultValue: 'Receive code via email' })}
                                            </p>
                                        </div>
                                    </div>
                                    {method === 'email' && <PiCheck className="text-app-bright-purple" size={24} />}
                                </button>

                                <button
                                    onClick={() => setMethod('phone')}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${method === 'phone'
                                        ? 'border-app-bright-purple bg-app-bright-purple/5 text-app-bright-purple'
                                        : 'border-black/10 dark:border-white/10 hover:border-app-bright-purple/30 hover:bg-app-bright-purple/5 bg-white dark:bg-gray-800 group'
                                        }`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors ${method === 'phone' ? 'bg-app-bright-purple/10 text-app-bright-purple' : 'bg-black/5 dark:bg-white/5 text-app-dark-purple/60 dark:text-white/60 group-hover:bg-app-bright-purple/10 group-hover:text-app-bright-purple'}`}>
                                            <PiPhone className="text-2xl" />
                                        </div>
                                        <div className="text-left">
                                            <p className={`font-semibold transition-colors ${method === 'phone' ? 'text-app-bright-purple' : 'text-app-dark-purple dark:text-white group-hover:text-app-bright-purple'}`}>
                                                {t('phone_option', { defaultValue: 'SMS' })}
                                            </p>
                                            <p className="text-xs text-app-dark-purple/60 dark:text-white/60">
                                                {t('phone_description', { defaultValue: 'Receive code via SMS' })}
                                            </p>
                                        </div>
                                    </div>
                                    {method === 'phone' && <PiCheck className="text-app-bright-purple" size={24} />}
                                </button>
                            </div>

                            <button
                                onClick={() => handleSendOtp(method)}
                                disabled={isLoading}
                                className="w-full bg-app-bright-purple text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-app-bright-purple/90 transition-all shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {isLoading && <PiSpinner className="animate-spin" size={18} />}
                                <span>
                                    {t('send_code', { defaultValue: 'Send Verification Code' })}
                                </span>
                            </button>
                        </div>
                    )}

                    {/* OTP Input */}
                    {otpSent && (
                        <div className="space-y-6 animate-in slide-in-from-right-4">
                            <div className="text-center">
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 bg-app-bright-purple/10 dark:bg-app-bright-purple/20 text-app-bright-purple`}>
                                    {method === 'email' ? <PiEnvelope size={32} /> : <PiPhone size={32} />}
                                </div>
                                <h3 className="font-semibold text-app-dark-purple dark:text-white mb-2">
                                    {method === 'email'
                                        ? t('email_sent', { defaultValue: 'Code sent to your email' })
                                        : t('sms_sent', { defaultValue: 'Code sent to your phone' })
                                    }
                                </h3>
                                <p className="text-sm text-app-dark-purple/60 dark:text-white/60">
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
                                    className="w-full text-center text-3xl font-mono tracking-[0.5em] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-app-bright-purple/20 focus:border-app-bright-purple transition-all text-app-dark-purple dark:text-white placeholder:text-app-dark-purple/30 dark:placeholder:text-white/20"
                                    maxLength={6}
                                    autoFocus
                                />
                                <p className="text-xs text-center text-app-dark-purple/60 dark:text-white/60 pt-2">
                                    {t('auto_verify', { defaultValue: 'Press Enter or click Verify when complete' })}
                                </p>
                            </div>

                            {error && (
                                <div className="bg-app-danger/10 border border-app-danger/20 rounded-xl p-4">
                                    <p className="text-sm text-app-danger text-center font-medium">{error}</p>
                                </div>
                            )}

                            <div className="space-y-3">
                                <button
                                    onClick={handleVerifyOtp}
                                    disabled={isLoading || otpCode.length !== 6}
                                    className="w-full bg-app-bright-purple text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-app-bright-purple/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm hover:shadow-md active:scale-[0.99]"
                                >
                                    {isLoading && <PiSpinner className="animate-spin" size={18} />}
                                    {!isLoading && <PiKey size={18} />}
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
                                        className="w-full text-app-bright-purple py-3.5 px-4 rounded-xl font-semibold hover:bg-app-bright-purple/5 transition-colors"
                                    >
                                        {t('change_method', { defaultValue: 'Change Method' })}
                                    </button>
                                )}

                                <button
                                    onClick={() => handleSendOtp(method)}
                                    disabled={isLoading || countdown > 0}
                                    className="w-full text-app-dark-purple dark:text-white py-3.5 px-4 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-gray-800 hover:bg-black/5 dark:hover:bg-white/5 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

                <div className="p-4 border-t border-black/5 dark:border-white/5 bg-app-bright-purple/5">
                    <p className="text-xs text-app-dark-purple/60 dark:text-white/60 text-center font-medium">
                        {t('security_note', { defaultValue: 'This verification helps keep your account secure' })}
                    </p>
                </div>
            </div>
        </BlockPrimitive>,
        document.body
    );
}
