import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Magnus Growth Platform",
  description: "CRM + Agente IA + Campañas + Agenda — Magnus SpA",
  robots: "noindex, nofollow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
