import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Github,
  BookOpen,
  MessageCircle,
  Sparkles,
  Zap,
} from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-muted/20 relative overflow-hidden">
      <div className="particles absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="particle animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 8}s`,
              width: `${1 + Math.random() * 4}px`,
              height: `${1 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      <div className="hero-glow absolute inset-0" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance mb-6 animate-slide-up">
            Ready to <span className="gradient-text">Revolutionize</span> Your
            DeFi Strategy?
          </h2>
          <p className="text-xl text-muted-foreground text-balance mb-12 leading-relaxed animate-slide-up stagger-1">
            Join the next generation of capital-efficient liquidity providers.
            Start building with Reflux Hook today and unlock the full potential
            of Uniswap V4 with Aave integration.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up stagger-2">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg hover-lift animate-pulse-glow glow-border group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Sparkles className="mr-2 h-5 w-5 animate-pulse relative z-10" />
              <span className="relative z-10">Explore Hook</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg glass hover-lift glow-border group bg-transparent relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Github className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform relative z-10" />
              <span className="relative z-10">View Source Code</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3 text-muted-foreground hover:text-primary transition-colors animate-scale-in stagger-3 group">
              <BookOpen className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Hook Documentation</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-muted-foreground hover:text-accent transition-colors animate-scale-in stagger-4 group">
              <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Developer Community</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-muted-foreground hover:text-chart-3 transition-colors animate-scale-in stagger-5 group">
              <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Open Source</span>
            </div>
          </div>

          <div className="mt-12 animate-scale-in stagger-6">
            <div className="inline-flex items-center gap-2 glass px-6 py-3 rounded-full glow-border relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 animate-gradient" />
              <Zap className="w-4 h-4 text-primary animate-pulse relative z-10" />
              <span className="text-sm font-medium relative z-10">
                Join developers building on Uniswap V4
              </span>
              <Zap className="w-4 h-4 text-primary animate-pulse relative z-10" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-10 left-10 w-24 h-24 border border-primary/20 rounded-full animate-float">
        <div className="w-full h-full border border-primary/10 rounded-full animate-pulse-ring" />
      </div>
      <div className="absolute top-20 right-20 w-16 h-16 border border-accent/20 rotate-45 animate-rotate-slow">
        <div className="w-full h-full bg-accent/5 animate-pulse-glow" />
      </div>
      <div className="absolute bottom-20 left-20 w-20 h-20 bg-primary/5 rounded-lg animate-float stagger-2">
        <div className="w-full h-full border border-primary/10 rounded-lg animate-pulse-ring" />
      </div>
      <div className="absolute bottom-10 right-10 w-12 h-12 border border-chart-3/20 rounded-full animate-pulse">
        <div className="w-full h-full bg-chart-3/5 rounded-full animate-pulse-glow" />
      </div>
      <div className="absolute top-1/2 left-5 w-32 h-1 bg-gradient-to-r from-primary/20 to-transparent animate-pulse-slow" />
      <div className="absolute top-1/2 right-5 w-1 h-32 bg-gradient-to-b from-accent/20 to-transparent animate-pulse-slow stagger-3" />
    </section>
  );
}
