import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HarmfulAI — самые ужасные советы в интернете",
  description: "Шуточный ИИ, который даёт абсурдно-вредные советы. Не делайте то, что советует HarmfulAI!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-aurora min-h-screen">{children}</body>
    </html>
  );
}
