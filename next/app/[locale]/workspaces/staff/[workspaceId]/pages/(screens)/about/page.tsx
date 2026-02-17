import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import { StaffPageEditWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/pages/(widgets)/StaffPageEditWidget';

export default withPageAuth(
  async function StaffAboutEditPage({ }) {
    return <StaffPageEditWidget pageType="ABOUT" title="About us" />;
  },
  { pagePath: '/staff/pages/about', inlineHandlers: true }
);
