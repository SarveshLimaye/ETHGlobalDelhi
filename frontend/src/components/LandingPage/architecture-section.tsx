import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Database, Repeat, Zap, Sparkles } from "lucide-react";

export function ArchitectureSection() {
  return (
    <section
      id="architecture"
      className="py-24 lg:py-32 bg-muted/20 relative overflow-hidden"
    >
      <div className="particles absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="particle animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${5 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance mb-6 animate-slide-up">
            System <span className="gradient-text">Architecture</span>
          </h2>
          <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto animate-slide-up stagger-1">
            Understanding how Reflux Hook seamlessly integrates Uniswap V4 with
            advanced yield strategies for optimal capital efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <Card className="glass border-border hover-lift animate-scale-in stagger-1 glow-border">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Repeat className="h-8 w-8 text-primary animate-float" />
              </div>
              <CardTitle className="text-xl">Uniswap V4 Pool Manager</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Handles swap execution and liquidity management with advanced
                hook integration.
              </p>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center animate-scale-in stagger-2">
            <ArrowRight className="h-8 w-8 text-primary hidden lg:block animate-pulse" />
            <div className="lg:hidden w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent my-4" />
          </div>

          <Card className="glass border-border hover-lift animate-scale-in stagger-3 glow-border">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Zap className="h-8 w-8 text-accent animate-float stagger-1" />
              </div>
              <CardTitle className="text-xl">Reflux Hook (JIT Logic)</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Orchestrates Just-In-Time liquidity provision and manages yield
                strategy interactions.
              </p>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center lg:col-start-2 animate-scale-in stagger-4">
            <ArrowRight className="h-8 w-8 text-primary hidden lg:block rotate-90 animate-pulse" />
            <div className="lg:hidden w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent my-4" />
          </div>

          <Card className="glass border-border lg:col-start-2 hover-lift animate-scale-in stagger-5 glow-border">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-chart-3/10 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <Database className="h-8 w-8 text-chart-3 animate-float stagger-2" />
              </div>
              <CardTitle className="text-xl">Yield Protocols</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Stores idle liquidity across various yield protocols and
                provides borrowing capabilities.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="glass border border-border/50 rounded-2xl p-8 animate-scale-in stagger-6 glow-border">
          <h3 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            JIT Operation Flow
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="animate-slide-up stagger-1">
              <h4 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                Before Swap
              </h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start animate-slide-up stagger-1">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0 animate-pulse" />
                  Hook detects incoming swap transaction
                </li>
                <li className="flex items-start animate-slide-up stagger-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0 animate-pulse" />
                  Calculates required liquidity windows
                </li>
                <li className="flex items-start animate-slide-up stagger-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0 animate-pulse" />
                  Temporarily adds JIT liquidity to pool
                </li>
                <li className="flex items-start animate-slide-up stagger-4">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0 animate-pulse" />
                  Stores active liquidity reference
                </li>
              </ul>
            </div>
            <div className="animate-slide-up stagger-2">
              <h4 className="text-lg font-semibold mb-4 text-accent flex items-center gap-2">
                <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                After Swap
              </h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start animate-slide-up stagger-1">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0 animate-pulse" />
                  Verifies slippage protection conditions
                </li>
                <li className="flex items-start animate-slide-up stagger-2">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0 animate-pulse" />
                  Removes JIT liquidity from pool
                </li>
                <li className="flex items-start animate-slide-up stagger-3">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0 animate-pulse" />
                  Settles token imbalances through yield protocols
                </li>
                <li className="flex items-start animate-slide-up stagger-4">
                  <span className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0 animate-pulse" />
                  Returns excess tokens to yield protocols for earning
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-10 left-5 w-16 h-16 border border-primary/20 rounded-lg animate-rotate-slow" />
      <div className="absolute bottom-10 right-5 w-20 h-20 border border-accent/20 rounded-full animate-float" />
    </section>
  );
}
