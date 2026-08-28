import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import appCss from "../styles.css?url";

function shareHost(): string {
  if (typeof window !== "undefined" && window.location.host) {
    return window.location.host;
  }
  const raw =
    (typeof process !== "undefined" &&
      (process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL)) ||
    "";
  return String(raw).replace(/^https?:\/\//, "") || "localhost:8080";
}

export const Route = createRootRoute({
  head: () => {
    const host = shareHost();
    const ogImage = `https://${host}/og.jpg`;
    const xBanner = `https://${host}/x-banner.jpg`;
    const title = "xAI IPC — Intelligent Power Core";
    const description =
      "xAI Intelligent Power Core control dashboard — real-time sensing, NILM, hybrid breakers, VPP / OpenADR.";

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:image", content: ogImage },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImage },
        { property: "x:game:image", content: xBanner },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap",
        },
      ],
    };
  },
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-fg">
        <AuthProvider>
          <TooltipProvider>
            <Outlet />
          </TooltipProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
