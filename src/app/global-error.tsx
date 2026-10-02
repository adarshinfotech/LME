"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en-IN">
      <body style={{ margin: 0, background: "#FAF8F4", color: "#111111", fontFamily: "system-ui, sans-serif" }}>
        <main
          style={{
            minHeight: "100dvh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 1.25rem",
            maxWidth: "40rem",
            margin: "0 auto",
          }}
        >
          <h1 style={{ fontWeight: 400, fontSize: "2.5rem", letterSpacing: "-0.03em" }}>Something went wrong.</h1>
          <p style={{ color: "#6E675E", lineHeight: 1.6 }}>Please refresh the page or try again in a moment.</p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              height: "3.5rem",
              width: "fit-content",
              padding: "0 2rem",
              background: "#111111",
              color: "#FAF8F4",
              border: 0,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontSize: "0.75rem",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
