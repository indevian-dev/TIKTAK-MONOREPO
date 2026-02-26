import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import { StaffStoresApplicationsListWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/stores/(widgets)/StaffStoresApplicationsList.widget';

export default withPageAuth(
  async function StaffStoresApplicationsListPage({ }) {
    return (
      <div>
        <h1 className="text-3xl font-black text-left my-4 px-4">
          Mağaza Təlimatları
        </h1>
        <StaffStoresApplicationsListWidget />
      </div>
    );
  },
  { path: '/staff/stores/applications', inlineHandlers: true }
);
