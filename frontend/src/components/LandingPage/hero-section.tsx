"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Github, BookOpen, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

export function HeroSection() {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 overflow-hidden morph-gradient">
      <div className="grid-pattern absolute inset-0" />

      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>
      <div className="floating-orb"></div>

      <div className="wave-effect"></div>
      <div className="wave-effect"></div>
      <div className="wave-effect"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <Badge
            variant="secondary"
            className="mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 magnetic-border reveal-on-scroll"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-pulse-subtle" />
            Uniswap V4 Hook Innovation
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-balance mb-4 sm:mb-6 md:mb-8 reveal-on-scroll stagger-1 leading-tight">
            <span className="text-foreground">Capital-Efficient</span>{" "}
            <span className="gradient-text">Liquidity</span>{" "}
            <span className="text-foreground">for Uniswap V4</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground text-balance mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-4xl mx-auto reveal-on-scroll stagger-2">
            Reflux Hook integrates Aave lending protocol with Uniswap V4 to
            maximize capital utilization through Just-In-Time liquidity
            provision and dual yield sources.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12 md:mb-16 reveal-on-scroll stagger-3">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 md:px-10 py-3 sm:py-4 enhanced-hover relative z-10 w-full sm:w-auto text-sm sm:text-base"
            >
              Explore Hook
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 enhanced-hover bg-card/50 backdrop-blur-sm w-full sm:w-auto text-sm sm:text-base"
            >
              <Github className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              View on GitHub
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 enhanced-hover w-full sm:w-auto text-sm sm:text-base"
            >
              <BookOpen className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Documentation
            </Button>
          </div>

          <div className="reveal-on-scroll stagger-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
              <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 enhanced-hover group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-primary rounded-full animate-pulse-subtle" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-3">
                  JIT Liquidity
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Dynamic position management for optimal capital efficiency
                </p>
              </div>

              <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 enhanced-hover group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-chart-2/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-chart-2/30 transition-colors">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-chart-2 rounded-full animate-pulse-subtle stagger-1" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-3">
                  Dual Yield
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Earn from both trading fees and lending protocol rewards
                </p>
              </div>

              <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 enhanced-hover group sm:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-chart-3/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-chart-3/30 transition-colors">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-chart-3 rounded-full animate-pulse-subtle stagger-2" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-3">
                  Auto-Rebalance
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Intelligent position adjustments based on market conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
