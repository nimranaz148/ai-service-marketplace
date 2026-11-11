"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Star, MapPin, ShieldCheck } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "Inverter AC ka PCB board trip ho raha tha. Atelier ke voice agent par bola aur 20 minute me Tariq Bhai pohanch gaye. Manifold gauge se check kia aur fault foran fix!",
    author: "Dr. Ayesha Siddiqui",
    role: "Resident",
    city: "Sector F-10, Islamabad",
    rating: 5,
    avatar: "AS",
    service: "HVAC Diagnostics",
  },
  {
    quote: "Main distribution board me short circuit ho gaya tha. Escrow token system se peace of mind mili k payment tabhi release hui jab repair mukammal ho gaya.",
    author: "Hamza Tariq",
    role: "Property Owner",
    city: "DHA Phase 5, Lahore",
    rating: 5,
    avatar: "HT",
    service: "Emergency Electrical",
  },
  {
    quote: "Bilingual voice support is unreal. Speaking Urdu over phone and getting an automated dispatch without any coordinator in the middle feels like magic.",
    author: "Zubair Khan",
    role: "Business Director",
    city: "Gulshan-e-Iqbal, Karachi",
    rating: 5,
    avatar: "ZK",
    service: "Commercial Plumbing",
  },
];

export function TestimonialsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 26,
      },
    },
  };

  return (
    <section id="testimonials" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="space-y-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="catalis-badge">
            <Sparkles size={12} className="text-[#0054F9]" />
            <span>Testimonials</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            What our clients are{" "}
            <span className="font-serif italic font-normal text-[#0054F9]">
              saying across Pakistan.
            </span>
          </h2>

          <p className="font-body text-sm sm:text-base text-zinc-300 max-w-xl mx-auto">
            Real homeowners and commercial facility managers sharing their experience with autonomous dispatch.
          </p>
        </div>

        {/* Catalis testimonial cards row with Staggered Motion & Mouse Spotlight */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 items-stretch"
        >
          {TESTIMONIALS.map((t, idx) => (
            <motion.div key={idx} variants={cardVariants} className="pt-6">
              <div className="p-8 pt-12 relative flex flex-col justify-between space-y-6 h-full !overflow-visible">
                {/* Floating Top Avatar with Bounce */}
                <motion.div 
                  whileHover={{ scale: 1.15, rotate: 6 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#0054F9] border-4 border-[#0A0A0F] text-white flex items-center justify-center font-display font-black text-base shadow-lg cursor-pointer z-20"
                >
                  {t.avatar}
                </motion.div>

                {/* Stars & Quote */}
                <div className="space-y-4 text-center">
                  <div className="flex items-center justify-center gap-1 text-[#0054F9]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="#0054F9" stroke="#0054F9" />
                    ))}
                  </div>
                  <p className="font-body text-sm text-zinc-300 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                {/* Author & City Footer */}
                <div className="pt-4 border-t border-white/5 text-center space-y-1">
                  <div className="font-display font-bold text-sm text-white flex items-center justify-center gap-1.5">
                    <span>{t.author}</span>
                    <ShieldCheck size={14} className="text-[#0054F9]" />
                  </div>
                  <div className="text-[11px] text-zinc-400 font-code flex items-center justify-center gap-1">
                    <MapPin size={10} className="text-[#0054F9]" />
                    <span>{t.city}</span>
                  </div>
                  <div className="text-[10px] text-[#0054F9] font-code pt-1">
                    {t.service}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
