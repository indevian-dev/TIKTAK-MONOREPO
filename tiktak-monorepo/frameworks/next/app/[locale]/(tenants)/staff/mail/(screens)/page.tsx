import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import { StaffPageTitleTile }
  from '@/app/[locale]/(tenants)/staff/(tiles)/StaffPageTitleTile'
import { StaffMailTabsWidget }
  from '@/app/[locale]/(tenants)/staff/mail/(widgets)/StaffMailTabsWidget'

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
