// lib/arcjet.ts
import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";

export const arcjetUtils = () => {
  return arcjet({
    key: process.env.ARCJET_KEY!, // 🔑 Site key dari Arcjet dashboard
    rules: [
      // Shield = proteksi dari serangan umum (SQLi, XSS, dll.)
      shield({ mode: "LIVE" }),

      // Bot detection
      detectBot({
        mode: "LIVE", // kalau mau uji coba, ganti ke "DRY_RUN"
        allow: [
          "CATEGORY:SEARCH_ENGINE", "CATEGORY:MONITOR", "CATEGORY:PREVIEW", "POSTMAN"          // "CATEGORY:MONITOR",
          // "CATEGORY:PREVIEW",
        ],

      }),

      // Rate limiting
      tokenBucket({
        mode: "LIVE",
        refillRate: 1, // isi ulang 1 token tiap interval
        interval: 10, // tiap 10 detik
        capacity: 4, // max 3 request
        characteristics: ["ip.src"], // limit berdasarkan IP

      }),
    ],
  });
};


