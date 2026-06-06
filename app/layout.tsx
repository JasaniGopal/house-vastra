import type { Metadata } from "next";
import { Bodoni_Moda, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rent Vastra | Premium Designer Ethnic Wear Rental",
  description: "Rent premium ethnic wear, lehengas, sherwanis, and sarees from local boutique designers. Curation meets convenience with centralized logistics and return hygiene protocols.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodoniModa.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fcf9f8] text-[#1c1b1b] font-sans">
        <Header />
        <main className="flex-1 flex flex-col pt-[72px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
