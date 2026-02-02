import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import { StaffCardsListWidget }
  from '@/app/[locale]/(tenants)/staff/cards/(widgets)/StaffCardsListWidget';

export default withPageAuth(
  async function StaffCardsListPage({ }) {
    return (
      <div className="container mx-auto ">
        <h1 className="text-3xl font-black text-left my-4 px-4">
          Kartlar
        </h1>
        <StaffCardsListWidget />
      </div>
    );
  },
  { pagePath: '/staff/cards', inlineHandlers: true }
);
