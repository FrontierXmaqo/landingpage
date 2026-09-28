"use client";

import { useState } from "react";
import type { Post, TopicKey } from "@/app/[lang]/(main)/blog/posts";
import { CLEAN, TOPICS, type Blog } from "@/lib/siteContent";
import { saveSection } from "../site-content/actions";
import { ErrorNote, SaveStatus, inputClass, labelClass, useAutosave } from "../editorUi";

/** Same names as the public /blog page's English topic headings. */
const TOPIC_NAME: Record<TopicKey, string> = {
  schemes: "Government schemes",
  tariffs: "Tariffs and costs",
  industry: "Panels and safety",
  archive: "From the archive",
};
const small = "rounded-md border border-base-line px-2 py-1 text-xs font-semibold text-base-slate disabled:opacity-30 hover:border-base-slate";

export default function BlogEditor({ initial }: { initial: Blog }) {
  const { data, update, state, error } = useAutosave(initial, CLEAN.blog, (d) => saveSection("blog", d));
  const [topic, setTopic] = useState<TopicKey>("schemes");
  const [draft, setDraft] = useState<Post>({ title: "", summary: "", href: "" });
  const [addError, setAddError] = useState<string | null>(null);
  const posts = data[topic];

  const setPosts = (next: Post[]) => update({ ...data, [topic]: next });
  const setPost = (i: number, p: Partial<Post>) => setPosts(posts.map((x, j) => (j === i ? { ...x, ...p } : x)));
  const move = (i: number, d: -1 | 1) => {
    const next = [...posts];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setPosts(next);
  };

  return (
    <div className="admin-card p-5">
      <div role="tablist" aria-label="Topic" className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-base-line bg-base-panel p-1">
        {TOPICS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={t === topic}
            onClick={() => setTopic(t)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${t === topic ? "bg-base-bg text-base-ink" : "text-base-slate hover:text-base-ink"}`}
          >
            {TOPIC_NAME[t]} <span className="text-xs font-medium text-base-slate">{data[t].length}</span>
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            CLEAN.blog({ [topic]: [draft] });
          } catch (err) {
            setAddError(err instanceof Error ? err.message : "Check the article details.");
            return;
          }
          setAddError(null);
          setPosts([draft, ...posts]);
          setDraft({ title: "", summary: "", href: "" });
        }}
        className="mt-5 grid gap-3 sm:grid-cols-2"
      >
        <label className="block">
          <span className={labelClass}>Title</span>
          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Headline as it appears on maqosolar.com" className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block">
          <span className={labelClass}>Article link</span>
          <input type="url" value={draft.href} onChange={(e) => setDraft({ ...draft, href: e.target.value })} placeholder="https://maqosolar.com/…" className={`mt-1 ${inputClass}`} />
        </label>
        <label className="block sm:col-span-2">
          <span className={labelClass}>One-line summary</span>
          <input value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} placeholder="What changed, in one sentence" className={`mt-1 ${inputClass}`} />
        </label>
        <div>
          <button type="submit" className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white">
            Add to top of {TOPIC_NAME[topic]}
          </button>
        </div>
      </form>
      <ErrorNote message={addError} />
      <div className="mt-2">
        <SaveStatus state={state} error={error} />
      </div>

      {posts.length === 0 && <p className="mt-4 text-sm text-base-slate">No articles in this topic yet - it is hidden on the site until you add one.</p>}
      <div className="mt-4 space-y-3">
        {posts.map((p, i) => (
          <div key={`${topic}-${i}`} className="rounded-lg bg-base-bg p-4">
            <div className="flex items-center justify-between gap-3">
              <span className={`text-xs font-semibold uppercase tracking-wide ${i === 0 ? "text-brand-orange-ink" : "text-base-slate"}`}>
                {i === 0 ? "Featured in topic" : `Article ${i + 1}`}
              </span>
              <span className="flex items-center gap-1">
                <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className={small}>↑</button>
                <button type="button" aria-label="Move down" disabled={i === posts.length - 1} onClick={() => move(i, 1)} className={small}>↓</button>
                <button type="button" onClick={() => setPosts(posts.filter((_, j) => j !== i))} className="px-1 text-xs font-semibold text-base-slate hover:text-status-critical">
                  Remove
                </button>
              </span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input aria-label="Title" value={p.title} onChange={(e) => setPost(i, { title: e.target.value })} className={inputClass} />
              <input aria-label="Article link" value={p.href} onChange={(e) => setPost(i, { href: e.target.value })} className={inputClass} />
              <input aria-label="Summary" value={p.summary} onChange={(e) => setPost(i, { summary: e.target.value })} className={`${inputClass} sm:col-span-2`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
