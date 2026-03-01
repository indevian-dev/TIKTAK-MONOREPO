/**
 * Studio layout — removes the app's global layout for Sanity Studio.
 * Required so Studio gets its own clean HTML without the app's header/footer.
 */
export const metadata = {
    title: 'TikTak CMS Studio',
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body style={{ margin: 0 }}>{children}</body>
        </html>
    );
}
