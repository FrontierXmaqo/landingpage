import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { POSTS } from "@/app/[lang]/(main)/blog/posts";
import { loadSection } from "../site-content/actions";
import SectionHeader from "../site-content/SectionHeader";
import BlogEditor from "./BlogEditor";

export default async function BlogAdminPage() {
  const profile = await getCurrentProfile();
  if (!profile || !["admin", "marketing"].includes(profile.role)) redirect("/admin");
  const blog = await loadSection("blog", POSTS);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-base-ink">Blog</h1>
      <p className="mt-1 text-sm text-base-slate">
        Articles listed on /blog in every language. Each one links out to the full article on maqosolar.com.
      </p>
      <div className="mt-8">
        <SectionHeader
          section="blog"
          title="Articles by topic"
          hint="The first article in each topic gets the large featured panel, so keep the newest on top."
          lastPublished={blog.lastPublished}
          status={blog.status}
        />
        <div className="mt-4">
          <BlogEditor initial={blog.data} />
        </div>
      </div>
    </div>
  );
}
