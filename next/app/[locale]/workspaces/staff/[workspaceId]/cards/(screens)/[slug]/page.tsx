import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import { StaffCardsListWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/cards/(widgets)/StaffCardsList.widget';

export default withPageAuth(
  async function StaffCardsPage({ }) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-black text-left my-4 px-4">
          Kartlar
        </h1>
        <StaffCardsListWidget />
      </div>
    );
  },
  { path: '/staff/cards/:slug', inlineHandlers: true }
);
