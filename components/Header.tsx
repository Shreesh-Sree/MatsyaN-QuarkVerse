'use client';

import { Languages, Moon, Sun, Settings, HelpCircle, LogIn, LogOut, User, Menu, LayoutDashboard, Map, MessageSquare, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from "next-themes";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { PWAInstallIcon } from '@/components/PWAInstallIcon';
import { EmergencySOSButton } from '@/components/EmergencySOSButton';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/utils';

export function Header() {
  const { setTheme, theme } = useTheme();
  const { setLocale, t } = useLanguage();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/fishing-log", label: t("fishing_center"), icon: BookOpen },
    { href: "/map", label: t("map"), icon: Map },
    { href: "/chat", label: t("chat"), icon: MessageSquare },
  ];

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 glass-effect shadow-soft border-b border-border/20">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group transition-transform duration-200" aria-label={t("home")}>
          <div className="p-2 rounded-xl bg-custom-primary/10 border border-custom-primary/30 shadow-lg">
            <Image src="/favicon.ico" alt="FisherMate Logo" width={28} height={28} />
          </div>
          <span className="text-xl font-bold text-custom-primary">
            FisherMate.AI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link 
              key={href} 
              href={href}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                pathname === href 
                  ? "bg-custom-primary/20 text-custom-primary border border-custom-primary/20 shadow-lg" 
                  : "text-muted-foreground hover:bg-custom-light/50 hover:text-foreground hover:shadow-md dark:hover:bg-custom-secondary/20"
              )}
            >
              <Icon className={cn("h-4 w-4 transition-transform duration-200", pathname === href && "text-custom-primary")} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Desktop Controls */}
        <div className="hidden lg:flex items-center space-x-3">
          <PWAInstallIcon />
          
          <Button
            variant="ghost"
            size="icon"
            className="glass-button transition-all duration-200"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label={t("themeToggle")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="glass-button transition-all duration-200" aria-label={t("languageToggle")}>
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-effect border-border/30 shadow-xl">
              <DropdownMenuItem onClick={() => setLocale('en')} className="hover:bg-custom-primary/10 transition-colors">
                🇺🇸 English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale('ta')} className="hover:bg-custom-primary/10 transition-colors">
                🇮🇳 தமிழ்
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale('hi')} className="hover:bg-custom-primary/10 transition-colors">
                🇮🇳 हिंदी
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale('bn')} className="hover:bg-custom-primary/10 transition-colors">
                🇧🇩 বাংলা
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale('te')} className="hover:bg-custom-primary/10 transition-colors">
                🇮🇳 తెలుగు
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale('ml')} className="hover:bg-custom-primary/10 transition-colors">
                🇮🇳 മലയാളം
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale('kn')} className="hover:bg-custom-primary/10 transition-colors">
                🇮🇳 ಕನ್ನಡ
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale('gu')} className="hover:bg-custom-primary/10 transition-colors">
                🇮🇳 ગુજરાતી
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale('pa')} className="hover:bg-custom-primary/10 transition-colors">
                🇮🇳 ਪੰਜਾਬੀ
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale('mr')} className="hover:bg-custom-primary/10 transition-colors">
                🇮🇳 मराठी
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale('or')} className="hover:bg-custom-primary/10 transition-colors">
                🇮🇳 ଓଡ଼ିଆ
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale('as')} className="hover:bg-custom-primary/10 transition-colors">
                🇮🇳 অসমীয়া
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale('ur')} className="hover:bg-custom-primary/10 transition-colors">
                🇵🇰 اردو
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full glass-button transition-all duration-200" aria-label={t("userMenu")}>
                  <div className="w-8 h-8 rounded-full bg-custom-primary flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-effect border-border/30 shadow-xl">
                <DropdownMenuItem disabled className="opacity-70">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="truncate max-w-[200px]">{user.email}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { /* Add profile navigation */ }} className="hover:bg-custom-primary/10 transition-colors">
                  <Settings className="h-4 w-4 mr-2" />
                  {t("settings")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { /* Add help navigation */ }} className="hover:bg-custom-primary/10 transition-colors">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  {t("help")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="hover:bg-custom-primary/10 text-custom-primary transition-colors">
                  <LogOut className="h-4 w-4 mr-2" />
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className="btn-primary">
                <LogIn className="h-5 w-5 mr-2" />
                {t("login")}
              </Button>
            </Link>
          )}
          
          {/* SOS Button - at the end */}
          <div className="ml-3 border-l border-border/30 pl-3">
            <EmergencySOSButton variant="compact" />
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="glass-button transition-all duration-200" aria-label={t("openMenu")}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs glass-effect border-l border-border/30">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-3 transition-transform duration-200" onClick={handleMobileNavClick}>
                    <div className="p-2 rounded-xl bg-custom-primary/10 border border-custom-primary/30">
                      <Image src="/favicon.ico" alt="FisherMate Logo" width={24} height={24} />
                    </div>
                    <span className="text-xl font-bold text-custom-primary">FisherMate.AI</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col space-y-3">
                {navItems.map(({ href, label, icon: Icon }) => (
                  <Link 
                    key={href} 
                    href={href}
                    onClick={handleMobileNavClick}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                      pathname === href 
                        ? "bg-custom-primary/20 text-custom-primary border border-custom-primary/20 shadow-lg" 
                        : "text-foreground hover:bg-custom-light/50 hover:shadow-md dark:hover:bg-custom-secondary/20"
                    )}
                  >
                    <Icon className={cn("h-5 w-5 transition-transform duration-200", pathname === href && "text-custom-primary")} />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-8 border-t border-border/30 pt-6">
                {user ? (
                    <div className="space-y-3">
                        <div className="px-4 py-3 glass-card-sm rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-custom-primary flex items-center justify-center">
                              <User className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm text-muted-foreground truncate">{user.email}</span>
                          </div>
                        </div>
                        <Link 
                          href="#" 
                          onClick={handleMobileNavClick} 
                          className="flex items-center gap-4 px-4 py-3 rounded-xl text-foreground hover:bg-custom-light/50 dark:hover:bg-custom-secondary/20 transition-all duration-200"
                        >
                          <Settings className="h-5 w-5" />
                          <span>{t('settings')}</span>
                        </Link>
                        <Link 
                          href="#" 
                          onClick={handleMobileNavClick} 
                          className="flex items-center gap-4 px-4 py-3 rounded-xl text-foreground hover:bg-custom-light/50 dark:hover:bg-custom-secondary/20 transition-all duration-200"
                        >
                          <HelpCircle className="h-5 w-5" />
                          <span>{t('help')}</span>
                        </Link>
                        <button 
                          onClick={() => { logout(); handleMobileNavClick(); }} 
                          className="flex items-center gap-4 px-4 py-3 rounded-xl text-custom-primary hover:bg-custom-primary/10 cursor-pointer w-full text-left transition-all duration-200"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>{t('logout')}</span>
                        </button>
                    </div>
                ) : (
                    <Link href="/login" onClick={handleMobileNavClick}>
                      <Button className="w-full btn-primary">
                        <LogIn className="h-5 w-5 mr-2" />
                        {t("login")}
                      </Button>
                    </Link>
                )}
              </div>
              <div className="mt-8 border-t border-border/30 pt-6">
                <div className="space-y-4">
                  <EmergencySOSButton />
                  <div className="flex justify-center">
                    <PWAInstallIcon />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
