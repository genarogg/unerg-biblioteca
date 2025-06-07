import "./globals.css";

import AuthProvider from '../context/AuthContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="es">
        <body>
          {children}
        </body>
      </html>
  </AuthProvider>
  );
}
