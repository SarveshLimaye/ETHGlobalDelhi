"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);

      const sections = ["hero", "features", "architecture", "stats"];
      const sectionElements = sections.map(
        (id) =>
          document.getElementById(id) || document.querySelector(`[id="${id}"]`)
      );

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setCurrentSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getNavbarClasses = () => {
    const baseClasses =
      "border-b backdrop-blur-sm sticky top-0 z-50 transition-all duration-300";

    if (currentSection === "hero") {
      return `${baseClasses} navbar-hero border-border/30`;
    } else if (currentSection === "features") {
      return `${baseClasses} navbar-features border-primary/40`;
    } else if (scrolled) {
      return `${baseClasses} navbar-scrolled border-primary/30`;
    } else {
      return `${baseClasses} bg-background/80 border-border/50`;
    }
  };

  return (
    <header className={getNavbarClasses()}>
      <div className="container mx-auto px-4 py-5 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-base">
                R
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-foreground">
              Reflux Hook
            </span>
          </div>

          <button
            className="md:hidden p-3 hover:bg-muted/50 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          <nav
            className={`${
              isMenuOpen ? "flex" : "hidden"
            } md:flex absolute md:relative top-full md:top-auto left-0 md:left-auto right-0 md:right-auto bg-background md:bg-transparent border-b md:border-b-0 border-border/50 md:border-0 flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 space-x-0 md:space-x-10 p-6 md:p-0`}
          >
            <a
              href="#features"
              className="text-muted-foreground hover:text-primary transition-colors w-full md:w-auto py-2 md:py-0 text-base font-medium"
            >
              Features
            </a>
            <a
              href="#architecture"
              className="text-muted-foreground hover:text-primary transition-colors w-full md:w-auto py-2 md:py-0 text-base font-medium"
            >
              Architecture
            </a>
            <a
              href="#docs"
              className="text-muted-foreground hover:text-primary transition-colors w-full md:w-auto py-2 md:py-0 text-base font-medium"
            >
              Documentation
            </a>
            <a
              href="#github"
              className="text-muted-foreground hover:text-primary transition-colors w-full md:w-auto py-2 md:py-0 text-base font-medium"
            >
              GitHub
            </a>
          </nav>

          <div
            className={`${
              isMenuOpen ? "hidden" : "flex"
            } md:flex items-center space-x-3 sm:space-x-4`}
          >
            <Button
              variant="outline"
              size="sm"
              className="text-sm px-4 py-2 bg-transparent border-primary/30 hover:border-primary/50"
            >
              View Docs
            </Button>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-sm px-4 py-2"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
