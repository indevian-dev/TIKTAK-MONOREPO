import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import { StaffCategoriesListWidget }
  from '@/app/[locale]/(tenants)/staff/categories/(widgets)/StaffCategoriesListWidget';

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
  { pagePath: '/staff/categories', inlineHandlers: true }
);
