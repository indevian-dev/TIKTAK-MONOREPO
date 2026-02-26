import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import { StaffSingleRoleWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/roles/(widgets)/StaffSingleRole.widget';

export default withPageAuth(
  async function StaffSingleRolePage({ params }: { params: { id: string } }) {
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
  { path: '/staff/roles/:id', inlineHandlers: true }
);
