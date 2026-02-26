import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import { StaffRolesListWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/roles/(widgets)/StaffRolesList.widget';

export default withPageAuth(
  async function StaffRolesListPage({ }) {
    return (
      <div>
        <h1 className="text-3xl font-black text-left my-4 px-4">
          Rol Ləistəsi
        </h1>
        <StaffRolesListWidget />
      </div>
    );
  },
  { path: '/staff/roles', inlineHandlers: true }
);
