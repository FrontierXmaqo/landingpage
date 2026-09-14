import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 7,
          // ImageResponse renders outside the document, so tokens cannot be referenced
          // here. These are brand.orange-deep and brand.green from the palette.
          background: "linear-gradient(135deg, #F97000 0%, #31AC47 100%)",
          color: "#fff",
          fontSize: 20,
          fontWeight: 800,
          fontFamily: "sans-serif",
        }}
      >
        M
      </div>
    ),
    size
  );
}
