import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";

export default withPageAuth(
  async function AdsPage({ }) {
    return <div>Ads</div>;
  },
  { path: '/staff/ads', inlineHandlers: true }
);
