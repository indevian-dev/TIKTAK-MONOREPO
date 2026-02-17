import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import { StaffSingleRoleWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/roles/(widgets)/StaffSingleRoleWidget';

export default withPageAuth(
  async function StaffSingleRolePage({ params }) {
    const { id } = await params;
    return (
      <div>
        <h1 className="text-3xl font-black text-left my-4 px-4">
          Rol
        </h1>
        <StaffSingleRoleWidget id={id || ''} />
      </div>
    );
  },
  { pagePath: '/staff/roles/:id', inlineHandlers: true }
);
