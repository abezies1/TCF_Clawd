import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Tucson Chocolate Factory — Order Online",
  description:
    "Order handcrafted chocolates from Tucson Chocolate Factory for in-store pickup.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main className="main">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
