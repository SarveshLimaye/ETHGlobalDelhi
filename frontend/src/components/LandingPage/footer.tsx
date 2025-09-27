export function Footer() {
  return (
    <footer className="border-t border-border/50 py-16 bg-card/20 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-base">
                  R
                </span>
              </div>
              <span className="text-2xl font-bold text-foreground">
                Reflux Hook
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md text-base leading-relaxed">
              Capital-efficient liquidity provision for Uniswap V4 through Aave
              integration and Just-In-Time mechanisms.
            </p>
            <div className="text-sm text-foreground/80 font-medium">
              © 2025 Reflux Hook. Built for the DeFi community.
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-6 text-lg">
              Resources
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors text-base"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors text-base"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors text-base"
                >
                  Examples
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors text-base"
                >
                  Tutorials
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-6 text-lg">
              Community
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors text-base"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors text-base"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors text-base"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors text-base"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
