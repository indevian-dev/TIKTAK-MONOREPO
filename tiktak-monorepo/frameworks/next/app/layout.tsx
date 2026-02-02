import './globals.css';
import Script from 'next/script';
import type { ReactNode } from 'react';

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <head>
        {/* Load the gtag.js script once */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-57XKK5JX06"
          strategy="lazyOnload"
        />

        {/* Initialize both Google Analytics and Google Ads */}
        <Script id="gtag-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Google Analytics 4
            gtag('config', 'G-57XKK5JX06', {
              send_page_view: false  // Defer page views until after load
            });

            // Send page view after page load
            window.addEventListener('load', function() {
              gtag('event', 'page_view');
            });
          `}
        </Script>
      </head>
      <body className='bg-white text-dark overflow-y-scroll min-h-screen'>
        {children}
      </body>
    </html>
  );
}
