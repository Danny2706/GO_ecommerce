import { Link } from "react-router";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const footerLinks = {
  shop: [
    { label: "All Products", path: "/shop" },
    { label: "Traditional Clothing", path: "/shop?category=clothing" },
    { label: "Ethiopian Coffee", path: "/shop?category=coffee" },
    { label: "Spices & Food", path: "/shop?category=spices" },
    { label: "Handcrafts", path: "/shop?category=handcrafts" },
    { label: "Electronics", path: "/shop?category=electronics" },
  ],
  support: [
    { label: "Help Center", path: "/help" },
    { label: "Track Order", path: "/track" },
    { label: "Return Policy", path: "/returns" },
    { label: "Shipping Info", path: "/shipping" },
    { label: "FAQs", path: "/faq" },
  ],
  company: [
    { label: "About Selam", path: "/about" },
    { label: "Careers", path: "/careers" },
    { label: "Sell on Selam", path: "/sell" },
    { label: "Blog", path: "/blog" },
    { label: "Press", path: "/press" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-foreground text-background mt-16">
      {/* Pattern border */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center">
                <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
                  <path d="M16 4C9.37 4 4 9.37 4 16s5.37 12 12 12 12-5.37 12-12S22.63 4 16 4z" fill="white" opacity="0.15"/>
                  <path d="M16 6l2.5 7.5H27l-6.5 4.5 2.5 7.5L16 21l-7 4.5 2.5-7.5L5 13.5h8.5L16 6z" fill="white"/>
                </svg>
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-background tracking-tight leading-none block">Selam</span>
                <span className="text-[9px] font-mono text-background/50 tracking-widest uppercase leading-none">Market</span>
              </div>
            </div>
            <p className="text-sm text-background/65 leading-relaxed max-w-xs mb-6">
              Ethiopia's premier online marketplace — connecting the world to authentic Ethiopian crafts,
              coffee, clothing, and culture. <span className="font-serif italic">ሰላም</span> — peace, hello, welcome.
            </p>
            <div className="space-y-2.5 text-sm text-background/65">
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-primary shrink-0" />
                <span>+251 11 518 0000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-primary shrink-0" />
                <span>hello@selammarket.et</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                <span>Bole Road, Addis Ababa, Ethiopia</span>
              </div>
            </div>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Youtube, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-background/10 hover:bg-primary transition-colors text-background/70 hover:text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-background/40 mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="text-sm text-background/65 hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-background/40 mb-4">Support</h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="text-sm text-background/65 hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-background/40 mb-4">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="text-sm text-background/65 hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment methods */}
        <div className="border-t border-background/10 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40 font-mono">
            © 2024 Selam Market PLC. All rights reserved. Registered in Addis Ababa, Ethiopia.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-background/40 font-mono mr-1">We accept:</span>
            {["CBE Birr", "TeleBirr", "Amole", "Visa", "Mastercard"].map((m) => (
              <span key={m} className="text-[10px] font-mono px-2 py-1 bg-background/10 rounded text-background/60">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
