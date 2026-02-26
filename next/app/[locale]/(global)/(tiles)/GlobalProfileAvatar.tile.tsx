'use client'

import { useGlobalAuthProfileContext }
    from '@/app/[locale]/(global)/(context)/GlobalAuthProfileContext';
import { PiSignInLight }
    from "react-icons/pi";
import Link from 'next/link';

interface GlobalProfileAvatarTileProps {
    variant?: 'dark' | 'light';
}

export function GlobalProfileAvatarTile({ variant = 'dark' }: GlobalProfileAvatarTileProps) {
    const { firstName, lastName, email, isAuthenticated, loading } = useGlobalAuthProfileContext();

    // Color classes based on variant
    const colorClasses = variant === 'light'
        ? {
            bg: 'bg-gray-900 hover:bg-gray-900/80',
            text: 'text-white',
            border: 'border-gray-200'
        }
        : {
            bg: 'bg-app-bright-purple hover:bg-app-bright-purple-dark',
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
    if (!isAuthenticated) {
        return (
            <Link
                href="/auth/login"
                className={`flex items-center justify-center w-8 h-8 rounded-full ${colorClasses.bg} transition-colors`}
            >
                <PiSignInLight className={`${colorClasses.text} text-xl`} />
            </Link>
        );
    }

    // Authenticated state - derive initials from flat context fields
    const name = [firstName, lastName].filter(Boolean).join(' ');
    const initials = name
        ? name.trim().split(' ').map((word: string) => word.charAt(0)).join('').toUpperCase().slice(0, 2)
        : email
            ? email.charAt(0).toUpperCase()
            : '?';

    return (
        <Link
            href="/auth/account"
            className={`flex items-center justify-center w-8 h-8 rounded-full ${colorClasses.bg} transition-colors overflow-hidden border-2 ${colorClasses.border}`}
        >
            <span className={`${colorClasses.text} text-sm font-semibold select-none`}>
                {initials}
            </span>
        </Link>
    );
}
