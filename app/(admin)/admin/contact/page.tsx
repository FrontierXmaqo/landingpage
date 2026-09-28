import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { CONTACT_FIELDS } from "@/lib/content";
import { loadSection } from "../site-content/actions";
import SectionHeader from "../site-content/SectionHeader";
import ContactEditor from "./ContactEditor";

export default async function ContactAdminPage() {
  const profile = await getCurrentProfile();
  if (!profile || !["admin", "marketing"].includes(profile.role)) redirect("/admin");
  const contact = await loadSection("contact", CONTACT_FIELDS);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-base-ink">Contact Us</h1>
      <p className="mt-1 text-sm text-base-slate">One set of details, used on /contact, the homepage, the privacy policy and every page&rsquo;s footer.</p>
      <div className="mt-8">
        <SectionHeader
          section="contact"
          title="Contact details"
          hint="Shown the same in every language."
          lastPublished={contact.lastPublished}
          status={contact.status}
        />
        <div className="mt-4">
          <ContactEditor initial={contact.data} />
        </div>
      </div>
    </div>
  );
}
