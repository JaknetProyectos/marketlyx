"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ContactSection } from "@/components/ContactSection";
import {
  Palette,
  Image as ImageIcon,
  Sparkles,
  Trophy,
  TrendingUp,
  Award,
  Target,
  MessageCircle,
  Send,
  Mail,
} from "lucide-react";
import { getOptimizedUrl } from "@/lib/images";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      
      {/* Hero Section (Fondo Rojo con Íconos Flotantes) */}
      <section className="relative overflow-hidden bg-red-500 py-20 lg:py-28 text-white">
        {/* Floating Icons Background */}
        <div className="pointer-events-none absolute inset-0">
          <Trophy className="absolute left-[10%] top-[15%] h-32 w-32 -rotate-12 text-red-400/40" />
          <TrendingUp className="absolute bottom-[10%] right-[5%] h-48 w-48 text-red-600/30" />
          <Target className="absolute right-[20%] top-[10%] h-24 w-24 rotate-12 text-red-400/50 animate-pulse" />
          <Award className="absolute bottom-[20%] left-[5%] h-20 w-20 -rotate-6 text-red-600/40" />
        </div>

        <div className="container relative mx-auto px-4 lg:px-8 z-10">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
            
            {/* Left Content */}
            <div className="animate-in fade-in slide-in-from-left-8 duration-700">
              <h1 className="font-oswald text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
                {t("hero.title.part1")}
                <span className="relative ml-3 inline-block text-yellow-300">
                  {t("hero.title.highlight")}
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 180 12"
                    fill="none"
                  >
                    <path
                      d="M2 9C42 2 138 2 178 9"
                      stroke="#fde047"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <br />
                {t("hero.title.part2")}
              </h1>

              <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-red-50 md:text-lg">
                {t("hero.description")}
              </p>
            </div>

            {/* Right Visual */}
            <div className="relative flex justify-center animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="relative">
                {/* Decorative Elements */}
                <div className="absolute -left-6 -top-6 h-24 w-24 rounded-3xl bg-yellow-400" />
                <div className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-blue-600" />

                {/* Image card */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
                  <img
                    src={getOptimizedUrl("https://plus.unsplash.com/premium_photo-1683980578016-a1f980719ec2?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")}
                    alt={t("hero.imageAlt")}
                    className="w-full max-w-[520px] rounded-[2rem] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Services Bar (Fondo Blanco) */}
      <section className="relative z-20 -mt-10 px-4 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-4 rounded-[2rem] bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:grid-cols-3">
            <div className="group flex items-center gap-4 rounded-2xl bg-slate-50 px-5 py-4 transition-colors hover:bg-blue-50">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-500">
                <Palette className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {t("services.branding.category")}
                </p>
                <p className="font-bold text-slate-800">
                  {t("services.branding.title")}
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-4 rounded-2xl bg-slate-50 px-5 py-4 transition-colors hover:bg-blue-50">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <ImageIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {t("services.content.category")}
                </p>
                <p className="font-bold text-slate-800">
                  {t("services.content.title")}
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-4 rounded-2xl bg-slate-50 px-5 py-4 transition-colors hover:bg-blue-50">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {t("services.motion.category")}
                </p>
                <p className="font-bold text-slate-800">
                  {t("services.motion.title")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Position Section (Fondo Blanco) */}
      <section className="relative py-20 lg:py-32 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
            
            {/* Left Image */}
            <div className="order-2 lg:order-1">
              <div className="relative mx-auto max-w-md">
                <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-red-100" />
                <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-3xl bg-blue-100" />

                <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                  <img
                    src={getOptimizedUrl("https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")}
                    alt={t("strategy.imageAlt")}
                    className="rounded-[2rem] w-full"
                  />
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="order-1 lg:order-2">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-red-500">
                {t("strategy.tag")}
              </p>

              <h2 className="font-oswald text-4xl font-bold leading-tight md:text-5xl text-slate-900">
                {t("strategy.title.part1")}
                <span className="text-blue-600"> {t("strategy.title.highlight")}</span>
              </h2>

              <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-slate-600">
                {t("strategy.description")}
              </p>

              <div className="mt-10">
                <Link
                  href="#contacto"
                  className="inline-flex items-center rounded-2xl bg-blue-600 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-blue-700 shadow-sm"
                >
                  {t("strategy.button")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section Wrapper (Fondo Azul con Íconos Flotantes) */}
      <section className="relative bg-blue-600 pt-20 pb-24 overflow-hidden">
        {/* Floating Icons Background for Contact */}
        <div className="pointer-events-none absolute inset-0">
          <MessageCircle className="absolute right-[10%] top-[15%] h-40 w-40 rotate-12 text-blue-500/50" />
          <Send className="absolute bottom-[20%] left-[5%] h-32 w-32 -rotate-12 text-blue-700/30" />
          <Mail className="absolute left-[20%] top-[10%] h-20 w-20 rotate-6 text-blue-400/40 animate-bounce" />
        </div>
        
        <div className="relative z-10">
          <ContactSection />
        </div>
      </section>

    </div>
  );
}