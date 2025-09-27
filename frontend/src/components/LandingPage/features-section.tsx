import { Card, CardContent } from "@/components/ui/card";
import {
  Zap,
  DollarSign,
  Shield,
  TrendingUp,
  Layers,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Aave Integration",
    description:
      "Stores idle liquidity in Aave to earn lending yield while maintaining readiness for JIT operations.",
  },
  {
    icon: Zap,
    title: "JIT Liquidity",
    description:
      "Automatically provides liquidity just before swaps and removes it afterward for maximum capital efficiency.",
  },
  {
    icon: DollarSign,
    title: "Borrowing Capability",
    description:
      "Allows users to borrow against their deposited liquidity positions for additional capital leverage.",
  },
  {
    icon: TrendingUp,
    title: "Capital Efficiency",
    description:
      "Maximizes capital utilization through dual yield sources from trading fees and lending rewards.",
  },
  {
    icon: Shield,
    title: "Slippage Protection",
    description:
      "Built-in slippage checks to protect JIT operations and ensure optimal execution.",
  },
  {
    icon: Clock,
    title: "Liquidity Range Management",
    description:
      "Organizes liquidity in specific tick ranges with intelligent window selection algorithms.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden"
    >
      <div className="particles absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-balance mb-4 sm:mb-6 animate-slide-up">
            Revolutionary <span className="gradient-text">DeFi Features</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-balance max-w-3xl mx-auto animate-slide-up stagger-1">
            Reflux Hook combines Uniswap V4's advanced hook system with Aave's
            lending protocol to create unprecedented capital efficiency for
            liquidity providers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`glass border-border/50 hover-lift group animate-scale-in stagger-${
                (index % 6) + 1
              } hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500`}
            >
              <CardContent className="p-6 sm:p-8">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/20 transition-all duration-300 animate-pulse-glow relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <feature.icon className="h-5 sm:h-6 w-5 sm:w-6 text-primary animate-float relative z-10" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="absolute top-1/4 left-5 w-32 h-1 bg-gradient-to-r from-primary/20 to-transparent animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-5 w-1 h-32 bg-gradient-to-b from-accent/20 to-transparent animate-pulse-slow stagger-2" />
    </section>
  );
}
