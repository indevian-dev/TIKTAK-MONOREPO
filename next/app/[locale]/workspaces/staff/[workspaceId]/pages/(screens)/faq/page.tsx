import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import { StaffPageEditWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/pages/(widgets)/StaffPageEditWidget';

export default withPageAuth(
  async function StaffFaqEditPage({ }) {
    return <StaffPageEditWidget pageType="FAQ" title="Faq" />;
  },
  { pagePath: '/staff/pages/faq', inlineHandlers: true }
);
