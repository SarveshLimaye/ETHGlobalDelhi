import type { AppProps } from "next/app";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "../styles/globals.css";
import { Header } from "@/components/LandingPage/header";
import { Footer } from "@/components/LandingPage/footer";
import WagmiProvider from "@/utils/wagmiprovider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider>
      <div
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} dark min-h-screen bg-background`}
      >
        <div className="grid-pattern">
          <Header />
          <Component {...pageProps} />
          <Analytics />
          <Footer />
        </div>
      </div>
    </WagmiProvider>
  );
}
