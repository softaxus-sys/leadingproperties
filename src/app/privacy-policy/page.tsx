import type { Metadata } from "next";
import { site } from "@/lib/content";

export const metadata: Metadata = { title: "Privacy Policy" };

const sections: Array<[string, string]> = [
  ["1. Information We Collect", "We may collect the following personal information from you: full name, email address, phone number, physical address, payment information, IP address, and cookies/usage data."],
  ["2. How We Collect Your Information", "We collect personal information directly from you through contact forms and property inquiry forms. We also collect non-personal information automatically through cookies and tracking technologies."],
  ["3. Purpose of Data Collection", "We use your information for responding to property inquiries, processing transactions, providing customer support, sending relevant updates and marketing communications, and improving our services and website functionality."],
  ["4. Data Sharing", "We do not sell, rent, or share your personal information with third parties, except as required by law or to comply with legal obligations."],
  ["5. Cookies and Tracking Tools", "Our website uses cookies and tracking technologies to improve website performance and user experience, analyze traffic and usage patterns, and provide relevant marketing and advertising content. By using our website, you consent to our use of cookies."],
  ["6. Data Retention", "We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law."],
  ["7. Data Deletion Requests", "Currently, we do not offer the option for users to request deletion of their personal information."],
  ["8. Data Security", "We implement reasonable technical and organizational measures to safeguard your information against unauthorized access, use, alteration, or disclosure."],
  ["9. Your Rights", "Depending on applicable UAE laws, you may have rights to access, correct, or object to the processing of your data. Please contact us for more details."],
  ["10. Contact Information", `Phone: ${site.contact.phoneDisplay}. Email: ${site.contact.email}.`],
  ["11. Changes to This Privacy Policy", "We reserve the right to update or modify this Privacy Policy at any time. Any changes will be posted on our website with an updated effective date."],
];

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-3xl py-14">
      <h1 className="text-4xl font-extrabold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink-muted">Effective date: 8 September 2025</p>
      <p className="mt-6 leading-relaxed text-ink-soft">
        {site.name} (“we,” “our,” or “us”) is committed to protecting the privacy and security of your personal
        information. This Privacy Policy explains how we collect, use, store, and protect your data in compliance with
        applicable laws in the United Arab Emirates. By using our services, you agree to the terms outlined in this
        policy.
      </p>
      {sections.map(([title, text]) => (
        <section key={title} className="mt-8">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="mt-2 leading-relaxed text-ink-soft">{text}</p>
        </section>
      ))}
    </div>
  );
}
