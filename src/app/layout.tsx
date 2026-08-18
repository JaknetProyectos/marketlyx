import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ClientBody } from "./[locale]/ClientBody";

// Configuración de las fuentes de Google
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});


export const metadata: Metadata = {
  title: "Marketlyx | Marketing Digital Integral",
  description:
    "En Marketlyx, creemos que cada pixel tiene un propósito. Desde branding hasta marketing digital, nuestros expertos están listos para llevar tu proyecto al próximo nivel.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`dark ${plusJakartaSans.variable} ${inter.variable}`}
    >
      <head>
        {/* Aquí puedes añadir etiquetas adicionales si las necesitas */}
      </head>
      <body
        suppressHydrationWarning
        className="antialiased font-body"
      >
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}