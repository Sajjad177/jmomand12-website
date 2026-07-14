import { DashboardOrderDetailPage } from "@/features/dashboard/components/dashboard-order-detail-page";

export default async function DashboardInvoiceDetailRoute({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;

  return <DashboardOrderDetailPage invoiceId={invoiceId} />;
}
