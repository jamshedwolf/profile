import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { navLinks } from "@/config/constants";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const location = useLocation();

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark", newIsDark);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 md:px-6">
      <nav className="container-custom mx-auto max-w-6xl bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between h-16 md:h-20 px-4 md:px-6">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold text-foreground hover:text-primary transition-colors group"
          >
            <span className="gradient-text group-hover:opacity-80 transition-opacity">&lt;AI-Dev</span>
            <span className="text-foreground">/&gt;</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "nav-link text-sm font-medium",
                  location.pathname === link.href && "active"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Theme Toggle, AI Generator & CTA */}
          <div className="hidden md:flex items-center gap-3">
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
           
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  location.pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
           
          </div>
        </div>
      </nav>
    </header>
  );
}
