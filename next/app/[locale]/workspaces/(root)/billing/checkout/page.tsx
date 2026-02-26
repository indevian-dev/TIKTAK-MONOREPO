
import { withPageAuth } from "@/lib/middleware/Interceptor.View.middleware";
import { CheckoutPageClient } from "./CheckoutPageClient";

async function CheckoutPage() {
    return <CheckoutPageClient />;
}

export default withPageAuth(CheckoutPage, {
    path: "/workspaces/billing/checkout",
});
