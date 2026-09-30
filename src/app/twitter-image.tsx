import { ImageResponse } from "next/og";
import { LETS_MAKE_IT_WORDMARK, LMI_MARK } from "@/components/brand/paths";
import { site } from "@/lib/site";

export const alt = "LMI — Start Your Own Software Business. Your Brand. Our Technology.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#F4EBDD",
        padding: 72,
        color: "#111111",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <svg viewBox={LMI_MARK.viewBox} width={138} height={48} fill="#111111">
          <path fillRule="evenodd" d={LMI_MARK.d} />
        </svg>
        <div style={{ fontSize: 18, letterSpacing: 5, color: "#6E675E", textTransform: "uppercase" }}>Technology Partner Program</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 84, lineHeight: 1, letterSpacing: -3, fontWeight: 400 }}>Start your own</div>
        <div style={{ fontSize: 84, lineHeight: 1.05, letterSpacing: -3, fontWeight: 400 }}>software business.</div>
        <div style={{ marginTop: 28, fontSize: 32, color: "#6E675E" }}>{site.tagline}</div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <svg viewBox={LETS_MAKE_IT_WORDMARK.viewBox} width={420} height={54} fill="#111111">
          <path fillRule="evenodd" d={LETS_MAKE_IT_WORDMARK.d} />
        </svg>
        <div style={{ fontSize: 18, letterSpacing: 4, color: "#6E675E", textTransform: "uppercase" }}>{`Powered by ${site.poweredBy}`}</div>
      </div>
    </div>,
    size,
  );
}
