'use client'

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';

import {
  useEffect,
  useState
} from 'react';
import { useRouter }
  from 'next/navigation';

interface TokenRefreshHandlerProps {
  returnUrl?: string;
  inline?: boolean;
}

export default function TokenRefreshHandler({ 
  returnUrl = '/',
  inline = false 
}: TokenRefreshHandlerProps) {
  const router = useRouter();
  const [status, setStatus] = useState('refreshing');

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          setStatus('success');
          // Refresh the page to use new token
          setTimeout(() => {
            router.refresh();
          }, 500);
        } else {
          setStatus('failed');
          // Redirect to login after short delay
          setTimeout(() => {
            router.push(`/auth/login?redirect=${encodeURIComponent(returnUrl)}`);
          }, 1500);
        }
      } catch (error) {
        ConsoleLogger.error('Token refresh error:', error);
        setStatus('failed');
        setTimeout(() => {
          router.push(`/auth/login?redirect=${encodeURIComponent(returnUrl)}`);
        }, 1500);
      }
    };

    refreshToken();
  }, [router, returnUrl]);

  const wrapperClass = inline
    ? "flex items-center justify-center py-16"
    : "flex items-center justify-center min-h-screen bg-gray-50";

  return (
    <div className={wrapperClass}>
      <div className="text-center p-8">
        {status === 'refreshing' && (
          <>
            <div className="animate-spin w-8 h-8 border-4 border-brand border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Refreshing session...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg 
                className="w-5 h-5 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            <p className="text-gray-600">Session refreshed!</p>
          </>
        )}
        {status === 'failed' && (
          <>
            <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg 
                className="w-5 h-5 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </div>
            <p className="text-gray-600">Session expired. Redirecting to login...</p>
          </>
        )}
      </div>
    </div>
  );
}
