import NextImage, { type ImageProps } from "next/image";
import { withBasePath } from "@/lib/basePath";

/**
 * next/image, plus the basePath on root-relative srcs ("/projects/x.webp").
 * Next adds it to links but not to image srcs, so the /homepage copy of the
 * site would otherwise ask for every local image without its prefix.
 */
export default function Image({ src, ...props }: ImageProps) {
  return <NextImage src={typeof src === "string" ? withBasePath(src) : src} {...props} />;
}
