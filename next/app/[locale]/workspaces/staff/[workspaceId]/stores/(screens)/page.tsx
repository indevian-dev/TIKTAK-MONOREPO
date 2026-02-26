import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import { StaffStoresListWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/stores/(widgets)/StaffStoresList.widget';

export default withPageAuth(
  async function StaffStoresListPage({ }) {
    return (
      <div>
        <h1 className="text-3xl font-black text-left my-4 px-4">
          Mağazalar
        </h1>
        <StaffStoresListWidget />
      </div>
    );
  },
  { path: '/staff/stores', inlineHandlers: true }
);
