
import { withPageAuth } from "@/lib/middleware/Interceptor.View.middleware";
import { SubscriptionManagementClient } from "./SubscriptionManagementClient";

async function SubscriptionManagementPage() {
    return <SubscriptionManagementClient />;
}

export default withPageAuth(SubscriptionManagementPage, {
    path: "/workspaces/billing",
});
