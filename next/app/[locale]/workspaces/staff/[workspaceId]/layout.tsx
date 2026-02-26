

import { withLayoutAuth } from '@/lib/middleware/_Middleware.index';
import { StaffClientLayout } from '@/app/[locale]/workspaces/staff/[workspaceId]/Staff.layout';

/**
 * Staff Layout
 * Auth is handled by individual pages using withPageAuth
 */


function StaffServerLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <StaffClientLayout>
      {children}
    </StaffClientLayout>
  );
}

export default withLayoutAuth(StaffServerLayout, {
  path: '/workspaces/staff/:workspaceId',
});