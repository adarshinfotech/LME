import { ImageResponse } from "next/og";
import { LMI_MARK } from "@/components/brand/paths";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#111111" }}>
      <svg viewBox={LMI_MARK.viewBox} width={124} height={43} fill="#F4EBDD">
        <path fillRule="evenodd" d={LMI_MARK.d} />
      </svg>
    </div>,
    size,
  );
}
