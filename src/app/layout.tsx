import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { DemoProvider } from "@/lib/demo-store";
import { THEME_SCRIPT } from "@/components/layout/theme-toggle";
import { OfflineIndicator } from "@/components/pwa/offline-indicator";
import { ServiceWorkerRegistrar } from "@/components/pwa/service-worker-registrar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LabLegends — Solve the science mystery",
    template: "%s · LabLegends",
  },
  description:
    "A gamified virtual science lab where students investigate mysteries, run experiments, justify hypotheses and earn rewards for scientific reasoning.",
  applicationName: "LabLegends",
  keywords: ["science education", "virtual lab", "hypothesis", "physics", "chemistry", "biology"],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LabLegends",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#171a2b" },
    { media: "(prefers-color-scheme: light)", color: "#f7f8fc" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full">
        <ServiceWorkerRegistrar />
        <OfflineIndicator />
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
