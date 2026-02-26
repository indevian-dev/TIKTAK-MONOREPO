import { withPageAuth } from '@/lib/middleware/Interceptor.View.middleware';
import { AuthProfileEditWidget } from './(widgets)/AuthProfileEdit.widget';

interface ProfilePageProps {
    params: Promise<{
        locale: string;
    }>;
}

/**
 * Profile Page - Server Component
 * Hosts the profile editing widget
 */
async function ProfilePage({ params }: ProfilePageProps) {
    await params;

    return <AuthProfileEditWidget />;
}

export default withPageAuth(ProfilePage, {
    path: '/workspaces/profile',
});
