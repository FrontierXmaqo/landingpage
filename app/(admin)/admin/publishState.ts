/** Shared result shape for every CMS section's Publish/Unpublish action, so
 * PublishButton can show accurate feedback instead of a silent form post.
 * "empty" means the action ran but there was nothing to promote/revert — a
 * distinct outcome from "success" so a no-op doesn't get reported as one. */
export type PublishState = { status: "idle" | "success" | "empty" | "error"; message?: string };
