import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import { StaffPageEditWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/pages/(widgets)/StaffPageEdit.widget';

export default withPageAuth(
  async function StaffTermsEditPage({ }) {
    return <StaffPageEditWidget pageType="TERMS" title="Terms" />;
  },
  { path: '/staff/pages/terms', inlineHandlers: true }
);
