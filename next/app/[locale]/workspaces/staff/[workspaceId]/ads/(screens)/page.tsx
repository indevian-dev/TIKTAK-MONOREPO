import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";

export default withPageAuth(
  async function AdsPage({ }) {
    return <div>Ads</div>;
  },
  { pagePath: '/staff/ads', inlineHandlers: true }
);
