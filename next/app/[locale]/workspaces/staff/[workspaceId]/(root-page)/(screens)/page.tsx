import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import { StaffPageTitleTile }
  from "@/app/[locale]/workspaces/staff/[workspaceId]/(tiles)/StaffPageTitle.tile";

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
  { path: '/staff', inlineHandlers: true }
);
