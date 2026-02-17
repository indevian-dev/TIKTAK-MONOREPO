import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import { StaffUsersListWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/users/(widgets)/StaffUsersListWidget';

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
  { pagePath: '/staff/users', inlineHandlers: true }
);
