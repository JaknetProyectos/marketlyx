"use client";

import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

import {
  Home,
  Building2,
  Layers3,
  Workflow,
  ShoppingCart,
  Languages,
  Menu,
  X,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useLocaleContext } from "@/context/LangContext";

export function Header() {
  const t = useTranslations("header");

  const pathname = usePathname();
  const { itemCount } = useCart();
  const { locale, switchLanguage } = useLocaleContext();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/nosotros", label: t("nav.about"), icon: Building2 },
    { href: "/soluciones", label: t("nav.solutions"), icon: Layers3 },
    { href: "/nuestros-procesos", label: t("nav.processes"), icon: Workflow },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      <div className="relative flex items-center justify-between gap-2 p-2.5">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <motion.div
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex h-14 items-center gap-3 rounded-2xl bg-slate-50 px-3 sm:px-4 transition-colors hover:bg-slate-100"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl">
              <img
                src="/logo.png"
                alt={t("logoAlt")}
                className="h-10 w-10 object-contain"
              />
            </div>

            <div className="hidden sm:block">
              <img
                src="/title.png"
                alt={t("titleAlt")}
                className="h-8 w-auto"
              />
            </div>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex min-w-0 flex-1 items-center justify-center gap-1.5 px-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="min-w-0 flex-1 max-w-[140px]"
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="relative flex h-14 flex-row gap-4 items-center justify-center overflow-hidden rounded-2xl px-2 text-center transition-colors hover:bg-slate-50"
                >
                  {isActive && (
                    <motion.div
                      layoutId="dock-active-pill"
                      className="absolute inset-0 rounded-2xl bg-blue-600"
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 28,
                      }}
                    />
                  )}

                  <Icon
                    className={`relative z-10 h-5 w-5 transition-colors duration-300 ${
                      isActive ? "text-white" : "text-slate-500"
                    }`}
                  />

                  <span
                    className={`relative z-10 mt-1 truncate text-[10px] font-bold sm:text-[11px] transition-colors duration-300 ${
                      isActive ? "text-white" : "text-slate-600"
                    }`}
                  >
                    {link.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls (Lang, Cart, Mobile Menu Toggle) */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => switchLanguage(locale === "es" ? "en" : "es")}
            className="group relative shrink-0"
            aria-label={t("changeLanguage")}
            title={t("changeLanguage")}
          >
            <div className="relative flex h-14 items-center gap-2 overflow-hidden rounded-2xl bg-blue-50 px-3 transition-colors duration-300 hover:bg-blue-100">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                <Languages className="h-4 w-4 text-blue-600" />
              </div>

              <motion.div
                key={locale}
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.18 }}
                className="relative flex min-w-[38px] items-center justify-center"
              >
                <span className="text-xs font-bold tracking-wide text-blue-700">
                  {locale.toUpperCase()}
                </span>
              </motion.div>
            </div>
          </motion.button>

          {/* Cart */}
          <Link
            href="/carrito"
            className="shrink-0"
            aria-label={t("cart")}
            title={t("cart")}
          >
            <motion.div
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="relative flex h-14 items-center justify-center gap-3 rounded-2xl bg-red-500 px-3 transition-colors hover:bg-red-600 sm:px-4"
            >
              <div className="relative flex items-center justify-center text-white">
                <ShoppingCart className="h-5 w-5" />

                {itemCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-3 -top-3 flex h-6 min-w-[24px] items-center justify-center rounded-full border-2 border-white bg-blue-600 px-1 text-[11px] font-bold text-white shadow-sm"
                  >
                    {itemCount}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </Link>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-slate-100 bg-white md:hidden"
          >
            <div className="flex flex-col gap-2 p-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div
                      className={`flex h-12 items-center gap-3 rounded-xl px-4 transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white font-bold"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="text-sm">{link.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
