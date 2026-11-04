import type { Metadata } from "next";
import { Orbitron, Rajdhani, Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toast } from "@/components/Toast";
import { CafeCartDrawer } from "@/components/CafeCartDrawer";
import { BookingModal } from "@/components/BookingModal";
import { AuthModal } from "@/components/AuthModal";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Virtux Gaming Hub – Play. Eat. Chill. | Ranaghat's Premier Esports & Lounge",
  description: "Ranaghat's first premium gaming hub featuring PlayStation 5 4K 120Hz consoles, RTX liquid-cooled Gaming PCs, Logitech Motion Simulators, Private Dolby Cinema, and Gourmet Café.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="bg-white text-slate-900 min-h-screen flex flex-col antialiased selection:bg-[#f92f35] selection:text-white" suppressHydrationWarning>
        <StoreProvider>
          {/* Subtle Ember Particles */}
          <ParticleBackground />

          {/* Persistent Sekiro-inspired Header */}
          <Navbar />

          {/* Main Content Pages */}
          <main className="flex-1 relative z-10 pt-16">
            {children}
          </main>

          {/* Persistent Footer */}
          <Footer />

          {/* Global Interactive Drawers & Modals */}
          <CafeCartDrawer />
          <BookingModal />
          <AuthModal />
          <Toast />
        </StoreProvider>
      </body>
    </html>
  );
}
