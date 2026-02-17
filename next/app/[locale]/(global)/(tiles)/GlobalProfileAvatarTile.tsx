'use client'

import {
    useState,
    useRef
} from 'react';
import { useGlobalAuthProfileContext }
    from '@/app/[locale]/(global)/(context)/GlobalAuthProfileContext';
import { PiSignInLight }
    from "react-icons/pi";
import { GlobalProfileMenuModalWidget }
    from '@/app/[locale]/(global)/(widgets)/GlobalProfileMenuModalWidget';
import Link from 'next/link';

interface GlobalProfileAvatarTileProps {
    variant?: 'dark' | 'light';
}

export function GlobalProfileAvatarTile({ variant = 'dark' }: GlobalProfileAvatarTileProps) {
    const { profile, loading, mode } = useGlobalAuthProfileContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const avatarRef = useRef<HTMLButtonElement>(null);

    // Color classes based on variant
    const colorClasses = variant === 'light'
        ? {
            bg: 'bg-brandPrimaryDarkBg hover:bg-brandPrimaryDarkBg/80',
            text: 'text-white',
            border: 'border-gray-200'
        }
        : {
            bg: 'bg-brandPrimary hover:bg-brandPrimary-dark',
            text: 'text-white',
            border: 'border-white'
        };

    // Show loading state
    if (loading) {
        return (
            <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            </div>
        );
    }

    // Unauthenticated state - show login icon
    if (!profile) {
        return (
            <>
                <Link
                    href="/auth/login"
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${colorClasses.bg} transition-colors`}
                >
                    <PiSignInLight className={`${colorClasses.text} text-xl`} />
                </Link>
            </>
        );
    }

    // Authenticated state - show avatar or initials
    const getAvatarDisplay = () => {
        // For personal mode, check for base64 avatar first, then avatar URL
        if (mode === 'personal') {
            if (profile.avatar) {
                // Handle base64 avatar - check if it starts with data: prefix
                const avatarSrc = profile.avatar.startsWith('data:')
                    ? profile.avatar
                    : `data:image/jpeg;base64,${profile.avatar}`;
                return (
                    <img
                        src={avatarSrc}
                        alt="Avatar"
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                            // Hide image on error and show initials instead
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                    />
                );
            }
            if (profile.avatarUrl) {
                return (
                    <img
                        src={profile.avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                            // Hide image on error and show initials instead
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                    />
                );
            }
        }

        // For store mode, check for store logo
        if (mode === 'store' && profile.avatar && profile.storeId) {
            const s3Prefix = Bun.env.NEXT_PUBLIC_S3_PREFIX || '';
            const storeLogoUrl = `${s3Prefix}/stores/${profile.storeId}/${profile.avatar}`;
            return (
                <img
                    src={storeLogoUrl}
                    alt="Store Logo"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                        // Hide image on error and show initials instead
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
            );
        }

        // Fallback to initials
        const initials = profile.name
            ? profile.name.trim().split(' ').map((word: string) => word.charAt(0)).join('').toUpperCase().slice(0, 2)
            : profile.email
                ? profile.email.charAt(0).toUpperCase()
                : '?';

        return (
            <span className={`${colorClasses.text} text-sm font-semibold select-none`}>
                {initials}
            </span>
        );
    };

    return (
        <>
            <Link
                href="/auth/account"
                key={profile?.id || 'no-profile'} // Force re-render on profile change
                className={`flex items-center justify-center w-8 h-8 rounded-full ${colorClasses.bg} transition-colors overflow-hidden border-2 ${colorClasses.border}`}>
                {getAvatarDisplay()}
            </Link>

        </>
    );
}
