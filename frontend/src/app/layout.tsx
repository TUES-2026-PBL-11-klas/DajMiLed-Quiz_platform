import type { Metadata } from "next";
import { Manrope, Be_Vietnam_Pro } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-be-vietnam-pro",
});

export const metadata: Metadata = {
  title: "DajMiLed Quiz Platform | The Modern Scholar",
  description: "A premium quiz environment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${beVietnamPro.variable}`}>
      <body className="antialiased min-h-screen font-body">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
