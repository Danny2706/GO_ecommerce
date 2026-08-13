import React from "react";
import { Link } from "react-router";
import { ShieldCheck, Heart, Truck, Sparkles, MapPin, Users, Globe, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative bg-secondary/50 py-16 md:py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
            <Sparkles size={14} /> Empowering Local Artisans & Commerce
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold font-serif text-foreground tracking-tight max-w-3xl mx-auto leading-tight">
            About Selam Market
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Connecting authentic Ethiopian craftspeople, coffee growers, and local businesses directly with shoppers nationwide and around the globe.
          </p>
        </div>
      </div>

      {/* Pillars / Values Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Why Choose Selam Market</h2>
          <p className="text-sm text-muted-foreground mt-2">Built with passion for quality, authenticity, and seamless integration</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-foreground">100% Authentic Products</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every item — from hand-embroidered Habesha Kemis to single-origin Yirgacheffe coffee beans — is directly sourced from verified Ethiopian artisans.
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Truck size={24} />
            </div>
            <h3 className="text-lg font-bold text-foreground">Fast Reliable Logistics</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Integrated real-time order processing, inventory adjustments, and tracking to deliver orders safely right to your doorstep.
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
              <Heart size={24} />
            </div>
            <h3 className="text-lg font-bold text-foreground">Supporting Communities</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By buying on Selam Market, you directly support local smallholder farmers, traditional weavers, and home-grown tech entrepreneurs across Ethiopia.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary text-primary-foreground py-12 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold font-serif">Ready to Explore Our Marketplace?</h2>
          <p className="text-primary-foreground/80 text-sm max-w-xl mx-auto">
            Discover hundreds of unique Ethiopian handcrafts, spices, coffee, clothing, and electronics today.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-card text-foreground font-semibold text-sm rounded-xl hover:bg-secondary transition-colors shadow-lg"
            >
              Browse Shop Catalog <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
