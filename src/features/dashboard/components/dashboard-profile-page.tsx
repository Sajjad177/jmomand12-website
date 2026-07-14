"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Camera, CreditCard, LockKeyhole, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardShell } from "./dashboard-shell";
import { useDashboardProfile, useUpdateDashboardProfile } from "../hooks/useDashboardData";
import { formatDateTime } from "../utils";
import { PaymentMethodDialog } from "@/features/payments/components/payment-method-dialog";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  street: z.string().optional(),
  location: z.string().optional(),
  postalCode: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function DashboardProfilePage() {
  const profile = useDashboardProfile();
  const updateProfile = useUpdateDashboardProfile();
  const { update: updateSession } = useSession();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const defaultValues = useMemo<ProfileFormValues>(
    () => ({
      firstName: profile.data?.firstName ?? "",
      lastName: profile.data?.lastName ?? "",
      email: profile.data?.email ?? "",
      phone: profile.data?.phone ?? "",
      street: profile.data?.street ?? "",
      location: profile.data?.location ?? "",
      postalCode: profile.data?.postalCode ?? "",
      dateOfBirth: profile.data?.dateOfBirth?.slice(0, 10) ?? "",
    }),
    [profile.data],
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!profile.data) return;
    form.reset(defaultValues);
  }, [defaultValues, form, profile.data]);

  const imagePreview = useMemo(() => {
    if (!imageFile) return profile.data?.image?.url ?? "";
    return URL.createObjectURL(imageFile);
  }, [imageFile, profile.data?.image?.url]);

  useEffect(() => {
    if (!imageFile || !imagePreview.startsWith("blob:")) return;

    return () => {
      URL.revokeObjectURL(imagePreview);
    };
  }, [imageFile, imagePreview]);

  const initials =
    `${profile.data?.firstName?.[0] ?? ""}${profile.data?.lastName?.[0] ?? ""}`.toUpperCase() ||
    "JD";

  async function onSubmit(values: ProfileFormValues) {
    try {
      const updatedProfile = await updateProfile.mutateAsync({ ...values, image: imageFile });
      setImageFile(null);
      await updateSession({
        user: {
          name: [updatedProfile.firstName, updatedProfile.lastName].filter(Boolean).join(" "),
          email: updatedProfile.email,
          image: updatedProfile.image?.url ?? "",
          role: updatedProfile.role,
        },
      });
      toast.success("Profile updated successfully.");
    } catch {
      toast.error("We couldn't save your profile changes.");
    }
  }

  if (profile.isLoading) {
    return (
      <DashboardShell
        title="Profile & settings"
        description="Keep your personal details, photo, and payment readiness up to date for invoices and pickup."
      >
        <Skeleton className="h-52 rounded-2xl" />
        <Skeleton className="h-[30rem] rounded-2xl" />
      </DashboardShell>
    );
  }

  if (profile.isError || !profile.data) {
    return (
      <DashboardShell
        title="Profile & settings"
        description="Keep your personal details, photo, and payment readiness up to date for invoices and pickup."
      >
        <div className="rounded-2xl border border-[#fecaca] bg-[#fff7f7] p-6 text-[#991b1b]">
          We couldn&apos;t load your profile right now.
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="Profile & settings"
      description="Keep your personal details, photo, and payment readiness up to date for invoices and pickup."
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-[#dce6f5] bg-white p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#111827]">Profile photo</h2>
              <p className="mt-1 text-sm text-[#6b7280]">
                Update the avatar shown in your customer account.
              </p>
            </div>
            <div className="text-sm text-[#6b7280]">
              Last updated {formatDateTime(profile.data.updatedAt)}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-center">
            <div className="relative w-fit">
              <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                {imagePreview ? (
                  <AvatarImage src={imagePreview} alt={profile.data.firstName} />
                ) : null}
                <AvatarFallback className="bg-[#003da5] text-2xl font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#fe6819] text-white shadow-lg">
                <Camera className="h-4 w-4" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#003da5] px-4 py-3 text-sm font-semibold text-white">
                <Upload className="h-4 w-4" />
                Upload photo
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/gif,image/webp"
                  className="sr-only"
                  onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                />
              </label>
              {imageFile ? (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-[#dce6f5]"
                  onClick={() => setImageFile(null)}
                >
                  Remove new photo
                </Button>
              ) : null}
            </div>
          </div>
          <div className="mt-3 space-y-1 text-xs text-[#94a3b8]">
            <p>JPG, PNG, GIF, or WebP. Uploads use the existing profile API.</p>
            {imageFile ? <p>Selected file: {imageFile.name}</p> : null}
          </div>
        </section>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <section className="rounded-2xl border border-[#dce6f5] bg-white p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-[#111827]">Personal information</h2>
                <p className="mt-1 text-sm text-[#6b7280]">
                  These details appear on invoices and help warehouse pickup verification.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {(
                  [
                    ["firstName", "First name"],
                    ["lastName", "Last name"],
                    ["email", "Email address"],
                    ["phone", "Phone number"],
                    ["street", "Street address"],
                    ["location", "City / state"],
                    ["postalCode", "Postal code"],
                    ["dateOfBirth", "Date of birth"],
                  ] as const
                ).map(([name, label]) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type={name === "dateOfBirth" ? "date" : name === "email" ? "email" : "text"}
                            className="h-12 rounded-xl border-[#dce6f5]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  className="h-11 rounded-xl bg-[#fe6819] px-5 hover:bg-[#e45c12]"
                  disabled={updateProfile.isPending}
                >
                  <Save className="h-4 w-4" />
                  {updateProfile.isPending ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </section>
          </form>
        </Form>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-[#dce6f5] bg-white p-6">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-[#003da5]" />
              <h2 className="text-2xl font-semibold text-[#111827]">Payment readiness</h2>
            </div>
            <p className="mt-2 text-sm text-[#6b7280]">
              Save a default card before bidding so auction wins can be charged automatically when the sale closes.
            </p>
            <div className="mt-5 rounded-2xl border border-[#dce6f5] bg-[#f8fbff] p-5">
              <p className="text-sm text-[#6b7280]">Default payment method</p>
              <p className="mt-2 text-xl font-semibold text-[#111827]">
                {profile.data.hasDefaultPaymentMethod ? "Saved and ready" : "No saved card yet"}
              </p>
              <p className="mt-2 text-sm text-[#6b7280]">
                {profile.data.defaultPaymentMethodId
                  ? `Stored payment ID: ${profile.data.defaultPaymentMethodId}`
                  : "Add a default payment method now to avoid interruption when you place your first live bid."}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  type="button"
                  className="rounded-xl bg-[#003da5] hover:bg-[#00358e]"
                  onClick={() => setPaymentDialogOpen(true)}
                >
                  <CreditCard className="h-4 w-4" />
                  {profile.data.hasDefaultPaymentMethod ? "Update payment method" : "Add payment method"}
                </Button>
                {profile.data.hasDefaultPaymentMethod ? (
                  <div className="inline-flex items-center gap-2 rounded-xl border border-[#d1fae5] bg-[#ecfdf5] px-4 py-2 text-sm font-medium text-[#047857]">
                    <LockKeyhole className="h-4 w-4" />
                    Bidding is enabled on auction lots
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#dce6f5] bg-white p-6">
            <div className="flex items-center gap-3">
              <LockKeyhole className="h-5 w-5 text-[#fe6819]" />
              <h2 className="text-2xl font-semibold text-[#111827]">Security</h2>
            </div>
            <p className="mt-2 text-sm text-[#6b7280]">
              Password-change fields are present in the designs, but the current backend does not expose an authenticated change-password endpoint yet.
            </p>
            <div className="mt-5 rounded-2xl border border-dashed border-[#dce6f5] p-5">
              <p className="font-semibold text-[#111827]">Current API support</p>
              <p className="mt-2 text-sm text-[#6b7280]">
                Users can recover access through the existing forgot-password + OTP flow. Once an in-session password update API exists, this panel can be wired to it directly.
              </p>
            </div>
          </div>
        </section>
      </div>

      <PaymentMethodDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        title="Manage your default payment method"
        description="Save the card you want to use for auction wins. We&apos;ll refresh your payment readiness as soon as Stripe confirms it."
        onSuccess={async () => {
          await profile.refetch();
        }}
      />
    </DashboardShell>
  );
}
