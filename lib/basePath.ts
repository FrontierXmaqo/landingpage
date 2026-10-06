/**
 * "/homepage" in the copy of this site served at get.maqosolar.com/homepage,
 * "" everywhere else (NEXT_PUBLIC_BASE_PATH, read by next.config basePath).
 *
 * <Link>, router.push and redirect() add it themselves. Plain <a href>,
 * <img src>, unoptimized <Image> and fetch/sendBeacon URLs don't, so wrap
 * those root-relative paths in withBasePath().
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBasePath(path: string) {
  if (!BASE_PATH || !path.startsWith("/") || path.startsWith("//")) return path;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  return BASE_PATH + path;
}
