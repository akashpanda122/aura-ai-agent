import type { Metadata } from "next";
//import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/functions/cn";
import { inter, satoshi } from "@/constants/fonts";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
//import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Aura",
  description: "Your Personalised Therapist that truly cares",
  icons: {
    icon: "../../public/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased font-default overflow-x-hidden !scrollbar-hide",
          inter.variable,
          satoshi.variable,
        )}
      >
        
        <Navbar />
        <Toaster
          richColors
          theme="dark"
          position="top-right"
        />
          {children}

        <Footer />
        
      </body>
    </html>
  );
}
