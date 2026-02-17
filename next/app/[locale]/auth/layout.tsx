'use client'

import {
    useState,
    useEffect,
    ReactNode
} from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {

    const [deviceInfo, setDeviceInfo] = useState<Record<string, string>>({});

    useEffect(() => {
        getDeviceInfo();
    }, []);

    useEffect(() => {
        localStorage.setItem('deviceInfo', JSON.stringify(deviceInfo));
    }, [deviceInfo]);

    const getDeviceInfo = () => {
        const userAgent = navigator.userAgent;
        const browser = getBrowser(userAgent);
        const os = getOS(userAgent);
        setDeviceInfo({
            userAgent: userAgent,
            browser: browser,
            os: os
        });
    }

    const getBrowser = (userAgent: string) => {
        const browsers = [
            { name: 'Chrome', regex: /Chrome/ },
            { name: 'Firefox', regex: /Firefox/ },
            { name: 'Safari', regex: /Safari/ },
            { name: 'Edge', regex: /Edge/ },
            { name: 'IE', regex: /Trident/ },
            { name: 'Opera', regex: /Opera/ }
        ];

        return browsers.find(browser => browser.regex.test(userAgent))?.name || 'Unknown';
    }

    const getOS = (userAgent: string) => {
        const oses = [
            { name: 'Windows', regex: /Windows/ },
            { name: 'Mac', regex: /Macintosh/ },
            { name: 'Linux', regex: /Linux/ },
            { name: 'Android', regex: /Android/ },
            { name: 'iOS', regex: /iPhone|iPad|iPod/ }
        ];

        return oses.find(os => os.regex.test(userAgent))?.name || 'Unknown';
    }

    return (
        <main className="w-full bg-brandPrimaryLightBg text-dark flex justify-center items-center min-h-screen">
            {children}
        </main>
    );
};

export default AuthLayout;
