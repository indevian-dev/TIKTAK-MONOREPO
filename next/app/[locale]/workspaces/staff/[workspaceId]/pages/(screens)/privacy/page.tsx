import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import { StaffPageEditWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/pages/(widgets)/StaffPageEdit.widget';

export default withPageAuth(
  async function StaffPrivacyEditPage({ }) {
    return <StaffPageEditWidget pageType="PRIVACY" title="Privacy" />;
  },
  { path: '/staff/pages/privacy', inlineHandlers: true }
);
