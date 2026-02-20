import { Link, useNavigate } from "react-router-dom";
import { Github, Linkedin, Twitter, Mail, Heart, ArrowUp, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpworkIcon } from "@/components/icons/UpworkIcon";
import { useAuth } from "@/contexts/AuthContext";

const socialLinks = [
  { icon: Github, href: "https://github.com/jamshedwolf", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/jamshedali12", label: "LinkedIn" },
 
  
  { icon: Mail, href: "mailto:jamsheedwolf@gmail.com", label: "Email" },
];

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
 
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <footer className="border-t border-border bg-card relative">
      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 -translate-x-1/2 p-3 rounded-full gradient-bg text-primary-foreground shadow-lg hover:scale-110 transition-transform"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      <div className="container-custom py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="text-2xl font-bold inline-block">
              <span className="gradient-text">&lt;AI-Dev</span>
              <span className="text-foreground">/&gt;</span>
            </Link>
            <p className="text-muted-foreground max-w-md leading-relaxed">
            AI Developer focused on intelligent systems, research, and practical problem-solving.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="social"
                  size="icon"
                  asChild
                  className="hover:scale-110 transition-transform"
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          {/* <div>
            <h4 className="font-semibold mb-6 text-foreground">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-6 text-foreground">Get In Touch</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="mailto:kashifdayal4@gmail.com" className="hover:text-primary transition-colors">
                 jamsheedwolf@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+15551234567" className="hover:text-primary transition-colors">
                 +923125230339
                </a>
              </li>
              <li>Gilgit KIU khari near zulfikarabad Bridge, 15100</li>
            </ul>
            {/* Login/Logout button for website owner */}
           
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI-DevPortfolio. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            Made with <Heart className="h-3.5 w-3.5 text-destructive fill-destructive animate-pulse" /> using React & Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
}
