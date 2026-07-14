import { CheckoutSuccessPage } from "@/features/orders/components/checkout-success-page";
import { Suspense } from "react";

export default function OrdersSuccessRoute() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutSuccessPage />
    </Suspense>
  );
}
