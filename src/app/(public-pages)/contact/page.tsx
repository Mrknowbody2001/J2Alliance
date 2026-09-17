import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import {
  SectionHeading,
  StorefrontFooter,
  StorefrontHeader,
} from "@/components/storefront/storefront-shell";
import { listCategoriesWithSubCategories } from "@/services/category.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact | J2Alliance",
  description: "Contact J2Alliance for premium store enquiries.",
};

const contactItems = [
  { label: "Phone", value: "[Replace with company phone]", Icon: Phone },
  { label: "Email", value: "[Replace with company email]", Icon: Mail },
  { label: "Address", value: "[Replace with company address]", Icon: MapPin },
  {
    label: "Business Hours",
    value: "[Replace with business hours]",
    Icon: Clock,
  },
];

export default async function ContactPage() {
  const categories = await listCategoriesWithSubCategories();
  const navCategories = categories;

  return (
    <main className="min-h-screen bg-white text-[#111]">
      <StorefrontHeader categories={navCategories} />

      <section className="bg-[#111] text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-[#d5aa42]">
            Contact
          </p>
          <h1 className="font-heading mt-3 max-w-4xl text-5xl font-semibold leading-[0.95] text-white sm:text-7xl">
            Let us help with your J2Alliance enquiry.
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
            Use the form or replacement contact details below for product,
            order, or business enquiries.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
        <div>
          <SectionHeading
            eyebrow="Information"
            title="Contact Details"
            copy="Placeholder values are intentionally bracketed so they can be replaced before production use."
          />
          <div className="mt-8 grid gap-4">
            {contactItems.map(({ label, value, Icon }) => (
              <div
                key={label}
                className="flex gap-4 rounded-md border border-[#e7e2d8] bg-[#faf8f2] p-5"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#111] text-[#f4c95d]">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9d7415]">
                    {label}
                  </p>
                  <p className="mt-2 text-sm text-[#555]">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form className="rounded-md border border-[#e7e2d8] bg-white p-6 shadow-[0_18px_42px_rgba(0,0,0,0.06)] sm:p-8">
          <h2 className="text-2xl font-bold text-[#111]">Send a Message</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Name" placeholder="Your name" />
            <Field label="Email" placeholder="you@example.com" type="email" />
          </div>
          <div className="mt-4">
            <Field label="Phone" placeholder="Optional phone number" />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-semibold text-[#333]">
              Message
              <textarea
                rows={6}
                placeholder="How can we help?"
                className="mt-2 w-full rounded-md border border-[#e2d8c7] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#d5aa42]"
              />
            </label>
          </div>
          <button
            type="button"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md bg-[#d5aa42] px-7 text-sm font-bold uppercase tracking-[0.16em] text-[#111] transition hover:bg-[#f4c95d]"
          >
            Submit Enquiry
          </button>
        </form>
      </section>

      <StorefrontFooter categories={navCategories} />
    </main>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block text-sm font-semibold text-[#333]">
      {label}
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-md border border-[#e2d8c7] bg-white px-4 text-sm outline-none transition focus:border-[#d5aa42]"
      />
    </label>
  );
}
