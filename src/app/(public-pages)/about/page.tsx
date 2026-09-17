import type { Metadata } from "next";
import { Award, Gem, Handshake, ShieldCheck } from "lucide-react";
import {
  SectionHeading,
  StorefrontFooter,
  StorefrontHeader,
} from "@/components/storefront/storefront-shell";
import { listCategoriesWithSubCategories } from "@/services/category.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us | JS Pvt Ltd",
  description: "Learn about JS Pvt Ltd and its premium lifestyle e-commerce experience.",
};

const values = [
  {
    title: "Curated Quality",
    copy: "Every collection is presented with attention to material, finish, usability, and long-term appeal.",
    Icon: Gem,
  },
  {
    title: "Authenticity First",
    copy: "Product information and images stay connected to the managed catalog so customers can browse with confidence.",
    Icon: ShieldCheck,
  },
  {
    title: "Thoughtful Service",
    copy: "The shopping experience is designed to feel clear, responsive, and easy to navigate from discovery to enquiry.",
    Icon: Handshake,
  },
  {
    title: "Premium Standards",
    copy: "The brand experience is quiet, modern, and professional across gems, hand crafts, home accessories, and watches.",
    Icon: Award,
  },
];

export default async function AboutPage() {
  const categories = await listCategoriesWithSubCategories();
  const navCategories = categories;

  return (
    <main className="min-h-screen bg-white text-[#111]">
      <StorefrontHeader categories={navCategories} />

      <section className="bg-[#111] text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-[#d5aa42]">
            About JS Pvt Ltd
          </p>
          <h1 className="font-heading mt-3 max-w-4xl text-5xl font-semibold leading-[0.95] text-white sm:text-7xl">
            A refined destination for premium lifestyle collections.
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
            JS Pvt Ltd brings together gems, hand crafts, home accessories, and Swiss watches in a clean e-commerce experience built for trust and easy discovery.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <SectionHeading
          eyebrow="Our Story"
          title="Built around considered shopping"
          copy="This copy is intentionally general and easy to replace with approved company details later. It avoids unsupported claims about dates, certifications, or locations."
        />
        <div className="space-y-6 text-sm leading-8 text-[#5d5d5d] sm:text-base">
          <p>
            JS Pvt Ltd is presented as a premium multi-category store where customers can explore distinctive pieces across personal, gift, and home-focused collections.
          </p>
          <p>
            The storefront emphasizes clarity: dynamic categories, live product data, original product photos, and a calm visual system that lets the catalog carry the experience.
          </p>
        </div>
      </section>

      <section className="bg-[#faf8f2] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <SectionHeading
            eyebrow="Our Values"
            title="Quality, authenticity, and care"
            align="center"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ title, copy, Icon }) => (
              <article key={title} className="rounded-md border border-[#e7e2d8] bg-white p-6 shadow-sm">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#111] text-[#f4c95d]">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-lg font-bold text-[#111]">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#666]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <div className="rounded-md bg-[#111] p-8 text-white sm:p-10">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-[#d5aa42]">
            Customer Commitment
          </p>
          <h2 className="font-heading mt-3 text-4xl font-semibold sm:text-5xl">
            A professional shopping experience from first look to final decision.
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/62 sm:text-base">
            The site is designed to support transparent product browsing, straightforward navigation, and clear contact paths for customer enquiries.
          </p>
        </div>
      </section>

      <StorefrontFooter categories={navCategories} />
    </main>
  );
}
