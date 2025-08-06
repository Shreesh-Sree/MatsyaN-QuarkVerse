"use client";

import Link from 'next/link';
import { Anchor, Github, Twitter, Linkedin, Mail, Heart, MapPin, Scale, Shield, BarChart3, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  const navigationLinks = [
    { href: "/dashboard", label: t("dashboard"), icon: BarChart3 },
    { href: "/map", label: t("map"), icon: MapPin },
    { href: "/laws", label: t("laws"), icon: Scale },
    { href: "/safety", label: t("safety"), icon: Shield },
    { href: "/chat", label: t("chat"), icon: MessageCircle },
  ];

  const socialLinks = [
    { href: "#", icon: Github, label: "GitHub" },
    { href: "#", icon: Twitter, label: "Twitter" },
    { href: "#", icon: Linkedin, label: "LinkedIn" },
    { href: "#", icon: Mail, label: "Email" },
  ];

  return (
    <footer className="mt-auto border-t border-border/40 bg-custom-white/95 dark:bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-custom-white/60 dark:supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-custom-primary/20 border border-custom-primary/30 backdrop-blur-sm">
                <Anchor className="w-6 h-6 text-custom-primary" />
              </div>
              <span className="text-xl font-bold text-custom-primary">
                Aquora.AI
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your AI-powered fishing companion with weather updates, safety guidelines, and comprehensive fishing analytics.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-muted-foreground hover:text-custom-primary transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Navigation</h3>
            <div className="space-y-2">
              {navigationLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-custom-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Features</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>Weather Updates</div>
              <div>Safety Guidelines</div>
              <div>Fishing Journal</div>
              <div>Voice Controls</div>
              <div>Legal Information</div>
              <div>Trip Analytics</div>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Support</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link href="#" className="block hover:text-custom-primary transition-colors">
                Help Center
              </Link>
              <Link href="#" className="block hover:text-custom-primary transition-colors">
                Contact Us
              </Link>
              <Link href="#" className="block hover:text-custom-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="block hover:text-custom-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/40 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2025 Aquora.AI. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Made by Team QuarkVerse - AlgoQX.
          </div>
        </div>
      </div>
    </footer>
  );
}
