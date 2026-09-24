import type { Metadata, Viewport } from "next";
import "./globals.css";
import { STUDENT, TEACHER, authorFullName } from "@/data/authors";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollTools, Toasts } from "@/components/Toasts";
import { AppProvider } from "@/providers/AppProvider";
import { THEME_BOOT_SCRIPT } from "@/lib/prefs";

export const metadata: Metadata = {
  title: {
    default: "Бабалар үні — Қазақтың ұлттық музыкалық аспаптары",
    template: "%s — Бабалар үні",
  },
  description:
    "«Бабалар үні – цифрлық әлемде»: қазақтың ұлттық музыкалық аспаптарының интерактивті онлайн-энциклопедиясы. 1–6 сынып оқушыларына арналған 14 аспап, 6 аңыз, тарих, ойындар және сөздік.",
  keywords: [
    "қазақ ұлттық аспаптары",
    "домбыра",
    "қобыз",
    "жетіген",
    "сыбызғы",
    "музыка сабағы",
    "1-6 сынып",
    "онлайн энциклопедия",
  ],
  applicationName: "Бабалар үні",
  authors: [
    { name: authorFullName(TEACHER) },
    { name: authorFullName(STUDENT) },
  ],
  creator: authorFullName(STUDENT),
  openGraph: {
    title: "Бабалар үні — Қазақтың ұлттық музыкалық аспаптары",
    description:
      "Интерактивті онлайн-энциклопедия: аспаптар, аңыздар, тарих, ойындар және түсініктер сөздігі.",
    locale: "kk_KZ",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#b4552d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kk" data-scroll-behavior="smooth">
      <head>
        {/* Түс режимі мен қаріп өлшемін бет пайда болмай тұрып орнатамыз */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-bg text-ink antialiased">
        <AppProvider>
          <a
            href="#main"
            className="no-print sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-xl focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
          >
            Негізгі мазмұнға өту
          </a>

          <Header />

          <main id="main">{children}</main>

          <Footer />
          <ScrollTools />
          <Toasts />
        </AppProvider>
      </body>
    </html>
  );
}
