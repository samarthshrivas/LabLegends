import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LabLegends — Hypothesis-driven science missions",
    short_name: "LabLegends",
    description:
      "Observe, question, hypothesise, experiment, analyse and earn feedback through virtual science mysteries.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#0b1020",
    theme_color: "#0b1020",
    categories: ["education", "science"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Mission catalogue",
        short_name: "Missions",
        url: "/missions",
      },
      {
        name: "Your progress",
        short_name: "Progress",
        url: "/progress",
      },
      {
        name: "First-timer tutorial",
        short_name: "Tutorial",
        url: "/tutorial",
      },
    ],
  };
}
