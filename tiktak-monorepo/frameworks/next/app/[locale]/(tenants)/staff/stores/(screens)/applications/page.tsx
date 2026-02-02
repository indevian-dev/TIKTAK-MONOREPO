import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import { StaffStoresApplicationsListWidget }
  from '@/app/[locale]/(tenants)/staff/stores/(widgets)/StaffStoresApplicationsListWidget';

export default withPageAuth(
  async function StaffStoresApplicationsListPage({  }) {
    return (
      <div>
        <h1 className="text-3xl font-black text-left my-4 px-4">
          Mağaza Təlimatları
        </h1>
        <StaffStoresApplicationsListWidget />
      </div>
    );
  },
  { pagePath: '/staff/stores/applications', inlineHandlers: true }
);
