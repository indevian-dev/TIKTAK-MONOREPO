import { withLayoutAuth } from '@/lib/auth/AccessValidatorForLayouts';
import { ProviderClientLayout } from '@/app/[locale]/workspaces/provider/[workspaceId]/ProviderClientLayout';

/**
 * Provider Layout
 * Permissions auto-detected from provider_pages.ts config
 */
export default withLayoutAuth(ProviderServerLayout, {
  layoutPath: '/provider'
});

function ProviderServerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProviderClientLayout>
      {children}
    </ProviderClientLayout>
  );
}
