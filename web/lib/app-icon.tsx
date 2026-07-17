import { ImageResponse } from "next/og";

export function renderAppIcon(size: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e6003d 0%, #8a0026 100%)",
          borderRadius: size * 0.18,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: size * 0.55,
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "sans-serif",
          }}
        >
          iH
        </div>
      </div>
    ),
    { width: size, height: size }
  );
}
