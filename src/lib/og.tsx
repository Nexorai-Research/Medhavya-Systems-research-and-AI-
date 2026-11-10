import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Brand card for social previews: text only, so no remote assets or fonts are needed. */
export function ogImage({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0B1730", color: "#FFFFFF" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, letterSpacing: 4, color: "#4FD1E8", textTransform: "uppercase" }}>
          <div style={{ width: 48, height: 4, background: "#D4A038" }} />
          {eyebrow}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.08 }}>{title}</div>
          {subtitle ? <div style={{ fontSize: 32, color: "#B8C4DA", lineHeight: 1.35 }}>{subtitle}</div> : null}
        </div>
        <div style={{ fontSize: 28, color: "#D4A038" }}>Medhavya Systems · AI · Research · Technology</div>
      </div>
    ),
    { ...ogSize },
  );
}
