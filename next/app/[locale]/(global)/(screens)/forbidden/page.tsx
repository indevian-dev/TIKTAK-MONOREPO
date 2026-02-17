import { useTranslations }
    from 'next-intl';
import Link
    from 'next/link';

export default function PublicForbiddenPage() {
    const t = useTranslations('Auth.Forbidden');

    return (
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white p-10 py-24">
            <div className="max-w-md w-full space-y-6 text-center">
                <div className="space-y-3">
                    <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {t('title')}
                    </h1>
                    <p className="text-gray-600">
                        {t('description')}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        {t('homepage')}
                    </Link>
                    <Link
                        href="/auth/login"
                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        {t('login')}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export function generateStaticParams() {
    return [{ locale: 'en' }, { locale: 'az' }, { locale: 'ru' }];
}

