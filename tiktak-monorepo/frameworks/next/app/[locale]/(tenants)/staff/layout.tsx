

import { withLayoutAuth } from '@/lib/auth/AccessValidatorForLayouts';
import { StaffClientLayout } from '@/app/[locale]/(tenants)/staff/StaffClientLayout';
import type { AuthData } from '@/types';

/**
 * Staff Layout
 * Auth is handled by individual pages using withPageAuth
 */
export default withLayoutAuth(StaffServerLayout, {
  layoutPath: '/staff',
});

function StaffServerLayout({
  children,
  authData
}: {
  children: React.ReactNode;
  authData?: AuthData | null;
}) {
  return (
    <StaffClientLayout authData={authData}>
      {children}
    </StaffClientLayout>
  );
}

