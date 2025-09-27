import { Header } from "@/components/LandingPage/header";
import { HeroSection } from "@/components/LandingPage/hero-section";
import { FeaturesSection } from "@/components/LandingPage/features-section";
import { ArchitectureSection } from "@/components/LandingPage/architecture-section";
import { StatsSection } from "@/components/LandingPage/stats-section";
import { CTASection } from "@/components/LandingPage/cta-section";
import { Footer } from "@/components/LandingPage/footer";
import Head from "next/head";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Reflux Hook - Capital-Efficient Liquidity for Uniswap V4</title>
        <meta
          name="description"
          content="A Uniswap V4 hook that integrates yield generating strategies for capital-efficient liquidity provision through Just-In-Time mechanisms."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-background">
        <div className="grid-pattern">
          <Header />
          <HeroSection />
          <FeaturesSection />
          <ArchitectureSection />
          <StatsSection />
          <CTASection />
          <Footer />
        </div>
      </div>
    </>
  );
}
