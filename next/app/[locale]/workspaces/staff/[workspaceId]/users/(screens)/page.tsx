import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import { StaffUsersListWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/users/(widgets)/StaffUsersList.widget';

export default withPageAuth(
  async function StaffUsersListPage({ }) {
    return (
      <div>
        <h1 className="text-3xl font-black text-left my-4 px-4">
          İstifadəçilər
        </h1>
        <StaffUsersListWidget />
      </div>
    );
  },
  { path: '/staff/users', inlineHandlers: true }
);
