import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import { StaffOpenSearchWidget }
  from '../(widgets)/StaffOpenSearchWidget';

export default withPageAuth(
  async function StaffOpenSearchPage({ }) {
    return <StaffOpenSearchWidget />;
  },
  { pagePath: '/staff/open-search', inlineHandlers: true }
);
