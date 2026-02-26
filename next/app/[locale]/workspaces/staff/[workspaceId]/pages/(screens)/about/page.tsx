import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import { StaffPageEditWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/pages/(widgets)/StaffPageEdit.widget';

export default withPageAuth(
  async function StaffAboutEditPage({ }) {
    return <StaffPageEditWidget pageType="ABOUT" title="About us" />;
  },
  { path: '/staff/pages/about', inlineHandlers: true }
);
