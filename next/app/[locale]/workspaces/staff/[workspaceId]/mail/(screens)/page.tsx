import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import { StaffPageTitleTile }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/(tiles)/StaffPageTitleTile'
import { StaffMailTabsWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/mail/(widgets)/StaffMailTabsWidget'

export default withPageAuth(
  async function StaffMailPage({ }) {
    return (
      <div className="min-h-screen bg-brandPrimaryLightBg">
        <StaffPageTitleTile pageTitle="ZeptoMail Management" />
        <StaffMailTabsWidget />
      </div>
    )
  },
  { pagePath: '/staff/mail', inlineHandlers: true }
);
