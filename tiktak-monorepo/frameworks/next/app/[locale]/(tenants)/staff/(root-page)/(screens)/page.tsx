import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import { StaffPageTitleTile }
  from "@/app/[locale]/(tenants)/staff/(tiles)/StaffPageTitleTile";

export default withPageAuth(
  async function StaffRootPage() {
    return (
      <>
        <StaffPageTitleTile pageTitle="TikTak Staff" />
        <div className="w-full">
          <p>Welcome to the Provider</p>
        </div>
      </>
    );
  },
  { pagePath: '/staff', inlineHandlers: true }
);
