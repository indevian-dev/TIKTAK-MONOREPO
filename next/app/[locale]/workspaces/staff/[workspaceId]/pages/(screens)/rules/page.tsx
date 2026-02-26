import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import { StaffPageEditWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/pages/(widgets)/StaffPageEdit.widget';

export default withPageAuth(
  async function StaffRulesEditPage({ }) {
    return <StaffPageEditWidget pageType="RULES" title="Rules" />;
  },
  { path: '/staff/pages/rules', inlineHandlers: true }
);
