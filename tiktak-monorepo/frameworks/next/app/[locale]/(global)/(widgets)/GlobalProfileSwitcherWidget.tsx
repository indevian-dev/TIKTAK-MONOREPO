"use client";

import {
    useState
} from 'react';
import { useGlobalAuthProfileContext }
    from '@/app/[locale]/(global)/(context)/GlobalAuthProfileContext';
import {
    PiArrowsClockwise
} from 'react-icons/pi';
import { GlobalAccountSwitchModalWidget }
    from '@/app/[locale]/(global)/(widgets)/GlobalAccountSwitchModalWidget';

export function GlobalProfileSwitcherWidget() {
    const {
        profile,
        loading,
        getInitials
    } = useGlobalAuthProfileContext();

    const [showAccountModal, setShowAccountModal] = useState(false);

    if (loading || !profile) {
        return (
            <div className="bg-brandPrimaryLightBg rounded-md p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        );
    }

    const Avatar = () => {
        if (profile.avatar) {
            return (
                <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-brand/20"
                />
            );
        }

        return (
            <div className="w-12 h-12 rounded-full bg-brandPrimary text-white flex items-center justify-center font-bold text-lg border-2 border-brand/20">
                {getInitials(profile.name)}
            </div>
        );
    };

    return (
        <>
            <div className="bg-brandPrimaryLightBg rounded-md p-4 mb-4">
                {/* Profile Section */}
                <div className="flex items-center space-x-3 mb-3">
                    <Avatar />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-dark truncate text-sm">
                            {profile.name}
                        </h3>
                        <p className="text-xs text-dark/60 truncate">
                            {profile.accountType} • {profile.role}
                        </p>
                    </div>
                </div>

                {/* Account Switcher */}

                <div className="border-t border-dark/10 pt-3">
                    <button
                        onClick={() => setShowAccountModal(true)}
                        className="w-full flex items-center justify-center py-2 px-3 text-xs font-medium text-dark/60 hover:text-brandPrimary hover:bg-white rounded transition-all"
                    >
                        <PiArrowsClockwise className="mr-2" size={14} />
                        Switch Account
                    </button>
                </div>

            </div>

            {/* Account Switch Modal */}
            <GlobalAccountSwitchModalWidget
                isOpen={showAccountModal}
                onClose={() => setShowAccountModal(false)}
            />
        </>
    );
}
