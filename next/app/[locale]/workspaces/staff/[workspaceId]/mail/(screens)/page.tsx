import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import { StaffPageTitleTile }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/(tiles)/StaffPageTitle.tile'
import { StaffMailTabsWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/mail/(widgets)/StaffMailTabs.widget'

export default withPageAuth(
  async function StaffMailPage({ }) {
    return (
      <div className="min-h-screen bg-app-bright-purple/10">
        <StaffPageTitleTile pageTitle="ZeptoMail Management" />
        <StaffMailTabsWidget />
      </div>
    )
  },
  { path: '/staff/mail', inlineHandlers: true }
);
