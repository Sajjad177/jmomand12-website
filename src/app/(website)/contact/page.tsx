"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { submitContact } from "@/features/contact/api";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const contact = useMutation({
    mutationFn: submitContact,
    onSuccess: (result) => {
      toast.success(result.message || "Your message has been sent.");
      setForm(initialForm);
    },
    onError: (error: Error) => toast.error(error.message || "We couldn't send your message."),
  });

  return (
    <main className="min-h-screen bg-[#f7f9fc] py-12">
      <div className="container mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-2xl bg-[#08255a] p-8 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">Support</p>
          <h1 className="mt-3 text-3xl font-bold">Contact our team</h1>
          <p className="mt-4 text-sm leading-7 text-[#aebcdc]">
            Questions about a product, auction, payment, or pickup? Send us the details and our team will help.
          </p>
          <div className="mt-10 space-y-5 text-sm text-[#dce6f5]">
            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-orange-400" />(808) 555-0111</div>
            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-orange-400" />support@discountdeals.com</div>
            <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-orange-400" />Warehouse pickup support</div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#dce6f5] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#111827]">Send a message</h2>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              contact.mutate(form);
            }}
            className="mt-6 space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {(["firstName", "lastName"] as const).map((key) => (
                <label key={key} className="space-y-2 text-sm font-semibold text-[#1f2937]">
                  <span>{key === "firstName" ? "First Name" : "Last Name"}</span>
                  <input
                    required
                    value={form[key]}
                    onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                    className="h-12 w-full rounded-xl border border-[#dce6f5] px-4 text-sm font-normal outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </label>
              ))}
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-[#1f2937]">
                <span>Email</span>
                <input type="email" required value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="h-12 w-full rounded-xl border border-[#dce6f5] px-4 text-sm font-normal outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
              </label>
              <label className="space-y-2 text-sm font-semibold text-[#1f2937]">
                <span>Phone</span>
                <input required value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="h-12 w-full rounded-xl border border-[#dce6f5] px-4 text-sm font-normal outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
              </label>
            </div>
            <label className="block space-y-2 text-sm font-semibold text-[#1f2937]">
              <span>Message</span>
              <textarea required rows={6} value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} className="w-full rounded-xl border border-[#dce6f5] px-4 py-3 text-sm font-normal outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
            </label>
            <button disabled={contact.isPending} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ff6900] px-7 text-sm font-bold text-white transition hover:bg-[#e45c12] disabled:opacity-50">
              {contact.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {contact.isPending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
