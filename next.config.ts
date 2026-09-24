import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Суреттер жергілікті `public/img` қалтасынан алынады.
  images: {
    // SVG файлдарды көрсетуге рұқсат (қажет болса — қауіпсіз режимде).
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Демо-алаңдарда (мысалы, онлайн превью қызметтерінде) әзірлеу режимі
  // қатесіз жұмыс істеуі үшін қосымша домендерге рұқсат беріледі.
  allowedDevOrigins: ["*.e2b.app", "*.e2b.dev", "localhost", "127.0.0.1"],
};

export default nextConfig;
