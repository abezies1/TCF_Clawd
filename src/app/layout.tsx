import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "Tucson Chocolate Factory — Order Online",
  description:
    "Order handcrafted chocolates from Tucson Chocolate Factory for in-store pickup.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TCF Order",
  },
};

export const viewport: Viewport = {
  themeColor: "#2c1810",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          href="/icons/apple-touch-icon.svg"
        />
      </head>
      <body>
        <CartProvider>
          <ServiceWorkerRegistration />
          <Header />
          <main className="main">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
