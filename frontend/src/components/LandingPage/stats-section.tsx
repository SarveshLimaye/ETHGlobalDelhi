const stats = [
  {
    value: "300%",
    label: "Capital Efficiency Increase",
    description: "Through dual yield sources and JIT optimization",
  },
  {
    value: "24/7",
    label: "Aave Yield Generation",
    description: "Continuous earning on idle liquidity",
  },
  {
    value: "<1ms",
    label: "JIT Response Time",
    description: "Lightning-fast liquidity provision",
  },
  {
    value: "99.9%",
    label: "Slippage Protection",
    description: "Built-in safeguards for all operations",
  },
];

export function StatsSection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="particles absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="particle animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
              width: `${3 + Math.random() * 4}px`,
              height: `${3 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-0 w-96 h-1 bg-gradient-to-l from-transparent via-accent/10 to-transparent animate-pulse-slow stagger-3" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance mb-6 animate-slide-up">
            Proven <span className="gradient-text">Performance</span>
          </h2>
          <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto animate-slide-up stagger-1">
            Reflux Hook delivers measurable improvements in capital efficiency
            through intelligent integration of Uniswap V4 and Aave lending
            protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center group animate-scale-in stagger-${
                (index % 4) + 1
              }`}
            >
              <div className="glass border border-border/50 rounded-2xl p-8 hover-lift glow-border group-hover:scale-105 transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform animate-pulse-glow relative z-10">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors relative z-10">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground relative z-10">
                  {stat.description}
                </div>

                <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden relative z-10">
                  <div
                    className="h-full bg-gradient-to-r from-primary via-accent to-chart-3 rounded-full animate-gradient"
                    style={{
                      width: "100%",
                      animationDelay: `${index * 0.3}s`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-20 right-10 w-12 h-12 bg-primary/10 rounded-full animate-float">
        <div className="w-full h-full border border-primary/20 rounded-full animate-pulse-ring" />
      </div>
      <div className="absolute bottom-20 left-10 w-8 h-8 border border-accent/30 rotate-45 animate-rotate-slow">
        <div className="w-full h-full bg-accent/5 animate-pulse-glow" />
      </div>
      <div className="absolute top-1/3 left-5 w-16 h-2 bg-gradient-to-r from-chart-3/20 to-transparent animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-5 w-2 h-16 bg-gradient-to-b from-primary/20 to-transparent animate-pulse-slow stagger-2" />
    </section>
  );
}
