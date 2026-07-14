import { format, formatDistanceToNowStrict, isAfter, parseISO } from "date-fns";
import type { DashboardOrder, Invoice, PickupAppointment, PickupSlot, UserProfile } from "./types";

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatShortDate(value?: string) {
  if (!value) return "Not available";
  return format(parseISO(value), "MMM d, yyyy");
}

export function formatDateTime(value?: string) {
  if (!value) return "Not available";
  return format(parseISO(value), "MMM d, yyyy 'at' h:mm a");
}

export function formatSlotWindow(slot?: PickupSlot) {
  if (!slot) return "Pickup slot not scheduled";
  return `${format(parseISO(slot.startsAt), "MMM d, h:mm a")} - ${format(
    parseISO(slot.endsAt),
    "h:mm a",
  )}`;
}

export function getTimeUntil(value?: string) {
  if (!value) return "No deadline";

  try {
    const date = parseISO(value);
    if (!isAfter(date, new Date())) {
      return "Ended";
    }

    return formatDistanceToNowStrict(date, { addSuffix: true });
  } catch {
    return "No deadline";
  }
}

export function getProfileCompletion(profile?: UserProfile) {
  if (!profile) return 0;

  const fields = [
    profile.firstName,
    profile.lastName,
    profile.email,
    profile.phone,
    profile.street,
    profile.location,
    profile.postalCode,
    profile.dateOfBirth,
    profile.image?.url,
  ];
  const completed = fields.filter(Boolean).length;
  return Math.round((completed / fields.length) * 100);
}

export function mapOrders(
  invoices: Invoice[] | undefined,
  appointments: PickupAppointment[] | undefined,
): DashboardOrder[] {
  if (!invoices?.length) return [];

  const appointmentByInvoiceId = new Map<string, PickupAppointment>();

  appointments?.forEach((appointment) => {
    appointment.invoices.forEach((invoice) => {
      const invoiceId = typeof invoice === "string" ? invoice : invoice._id;
      appointmentByInvoiceId.set(invoiceId, appointment);
    });
  });

  return invoices.map((invoice) => {
    const appointment = appointmentByInvoiceId.get(invoice._id);

    let pickupStatusLabel = "Awaiting payment";
    if (invoice.status === "paid") pickupStatusLabel = "Ready for pickup";
    if (appointment?.status === "scheduled") pickupStatusLabel = "Pickup scheduled";
    if (appointment?.status === "completed") pickupStatusLabel = "Picked up";
    if (appointment?.status === "cancelled") pickupStatusLabel = "Pickup cancelled";

    return {
      invoice,
      appointment,
      pickupStatusLabel,
      pickupActionable: invoice.status === "paid" && !appointment,
    };
  });
}
