import type { Metadata, Viewport } from "next";
import { Anton, Space_Grotesk, JetBrains_Mono, UnifrakturMaguntia, Bebas_Neue, Ruthie } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toast } from "@/components/Toast";
import { CafeCartDrawer } from "@/components/CafeCartDrawer";
import { BookingModal } from "@/components/BookingModal";
import { AuthModal } from "@/components/AuthModal";
import { CustomCursor, ScrollReveal } from "@/components/FX";

const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

const gothic = UnifrakturMaguntia({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-gothic",
  display: "swap",
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

const script = Ruthie({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Virtux Gaming Hub – Play. Eat. Chill. | Ranaghat's Premier Esports & Lounge",
  description: "Ranaghat's first premium gaming hub featuring PlayStation 5 4K 120Hz consoles, RTX liquid-cooled Gaming PCs, Logitech Motion Simulators, Private Dolby Cinema, and Gourmet Café.",
  icons: {
    icon: [{ url: "/icon-64.png", sizes: "64x64", type: "image/png" }],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${grotesk.variable} ${mono.variable} ${gothic.variable} ${bebas.variable} ${script.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Some browser extensions (e.g. Bitdefender) inject attributes like
            bis_skin_checked into every element before React hydrates, which
            triggers hydration-mismatch errors. Strip them as they appear. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var A=["bis_skin_checked","bis_register","bis_use","__processed"];function c(el){if(!el||!el.getAttributeNames)return;var n=el.getAttributeNames();for(var i=0;i<n.length;i++){for(var j=0;j<A.length;j++){if(n[i].indexOf(A[j])===0){el.removeAttribute(n[i]);break;}}}}function all(){var e=document.getElementsByTagName("*");for(var i=0;i<e.length;i++)c(e[i]);}try{new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var m=ms[i];if(m.type==="attributes")c(m.target);else for(var k=0;k<m.addedNodes.length;k++){var x=m.addedNodes[k];if(x.nodeType===1){c(x);var d=x.getElementsByTagName("*");for(var z=0;z<d.length;z++)c(d[z]);}}}}).observe(document.documentElement,{attributes:true,childList:true,subtree:true});all();document.addEventListener("DOMContentLoaded",all);}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className="grain bg-[#050505] text-slate-900 min-h-screen flex flex-col antialiased selection:bg-[#e10600] selection:text-white"
        suppressHydrationWarning
      >
        <StoreProvider>
          {/* Rising ember particles */}
          <ParticleBackground />

          <Navbar />

          <main className="flex-1 relative z-10 pt-16">
            {children}
          </main>

          <Footer />

          {/* Global interactive drawers & modals */}
          <CafeCartDrawer />
          <BookingModal />
          <AuthModal />
          <Toast />

          {/* Motion layer */}
          <ScrollReveal />
          <CustomCursor />
        </StoreProvider>
      </body>
    </html>
  );
}
