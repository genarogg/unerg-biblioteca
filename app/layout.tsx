import type { Metadata } from "next";
import "./globals.css";
import "../sass/style.scss";
import AuthProvider from '@context/AuthContext';

export const metadata: Metadata = {
  title: "Biblioteca | UNERG",
  description: "Sistema de biblioteca de la UNERG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="es">
        <head>
          {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js"></script> */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800"
            rel="stylesheet"
          />

          <link rel="shortcut icon" href="/logo.webp" type="image/x-icon" />
        </head>
        <body>
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
