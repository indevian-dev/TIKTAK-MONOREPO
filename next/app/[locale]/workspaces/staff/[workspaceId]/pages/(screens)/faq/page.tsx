import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import { StaffPageEditWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/pages/(widgets)/StaffPageEdit.widget';

export default withPageAuth(
  async function StaffFaqEditPage({ }) {
    return <StaffPageEditWidget pageType="FAQ" title="Faq" />;
  },
  { path: '/staff/pages/faq', inlineHandlers: true }
);
