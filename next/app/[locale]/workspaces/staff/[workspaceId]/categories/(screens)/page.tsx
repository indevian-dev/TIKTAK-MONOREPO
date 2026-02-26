import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import { StaffCategoriesListWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/categories/(widgets)/StaffCategoriesList.widget';

export default withPageAuth(
  async function StaffCategoriesListPage() {
    return (
      <div>
        <h1 className="text-3xl font-black text-left my-4 px-4">
          Kateqoriyalar
        </h1>
        <StaffCategoriesListWidget />
      </div>
    );
  },
  { path: '/staff/categories', inlineHandlers: true }
);
