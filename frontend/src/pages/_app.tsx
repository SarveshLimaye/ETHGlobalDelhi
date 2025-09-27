import type { AppProps } from "next/app";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`font-sans ${GeistSans.variable} ${GeistMono.variable} dark`}
    >
      <Component {...pageProps} />
      <Analytics />
    </div>
  );
}
