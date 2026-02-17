import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import { StaffPageEditWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/pages/(widgets)/StaffPageEditWidget';

export default withPageAuth(
  async function StaffPrivacyEditPage({ }) {
    return <StaffPageEditWidget pageType="PRIVACY" title="Privacy" />;
  },
  { pagePath: '/staff/pages/privacy', inlineHandlers: true }
);
