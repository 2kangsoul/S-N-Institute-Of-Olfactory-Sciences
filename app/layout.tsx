import "@mantine/core/styles.css";
import "../src/index.css";

import type { Metadata } from "next";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import Providers from "./providers";
import { ToastContainer } from "react-toastify";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/src/lib/queryClient";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: {
    default: "SNN Fragrance — Butik Parfum Niche & Designer",
    template: "%s | SNN Fragrance",
  },
  description:
    "Butik parfum niche & designer terkurasi. Temukan wewangian dengan sillage, projection, dan longevity 'beast mode'.",
  keywords: [
    "parfum",
    "niche",
    "designer",
    "fragrance",
    "wewangian",
    "SNN Fragrance",
  ],
  openGraph: {
    siteName: "SNN Fragrance",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <Providers>
          <ToastContainer />
          {children}
        </Providers>
      </body>
    </html>
  );
}
