"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Shield, Clock, Award, CheckCircle2 } from "lucide-react";

export function AboutSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 25,
      },
    },
  };

  return (
    <section id="about" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="rounded-[2.5rem] bg-[#0E0E16]/80 border border-white/8 p-8 sm:p-16 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#0054F9]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 mb-16">
          <div className="catalis-badge">
            <Sparkles size={12} className="text-[#0054F9]" />
            <span>About Atelier</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            We are passionate about empowering households and businesses to{" "}
            <span className="font-serif italic font-normal text-[#0054F9]">
              access world-class craftsmanship with zero uncertainty.
            </span>
          </h2>

          <p className="font-body text-base text-zinc-300 max-w-2xl mx-auto">
            Traditional labor directories in Pakistan are plagued by price inflation, unvetted handymen, and delayed arrivals. 
            Atelier AI replaces guesswork with autonomous multi-agent dispatch, NADRA biometric verification, and bank-grade escrow.
          </p>
        </div>

        {/* 3-Column Stats Grid (Catalis about_stats-grid) with Physics Motion & Spotlight Transitions */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/8"
        >
          <motion.div variants={cardVariants}>
            <div className="p-6 text-center space-y-2 cursor-default h-full">
              <motion.div 
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="font-display font-black text-4xl sm:text-5xl text-[#0054F9]"
              >
                80%
              </motion.div>
              <div className="font-display font-bold text-base text-white">
                Reduction in Dispatch Time
              </div>
              <p className="font-body text-xs text-zinc-400">
                Autonomous agents match nearest available master artisans in under 300 milliseconds.
              </p>
            </div>
          </motion.div>

          <motion.div variants={cardVariants}>
            <div className="p-6 text-center space-y-2 cursor-default h-full">
              <motion.div 
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="font-display font-black text-4xl sm:text-5xl text-white"
              >
                &lt; 20 min
              </motion.div>
              <div className="font-display font-bold text-base text-white">
                Average Arrival Turnaround
              </div>
              <p className="font-body text-xs text-zinc-400">
                Hyper-local cluster dispatch across Islamabad, Karachi, and Lahore.
              </p>
            </div>
          </motion.div>

          <motion.div variants={cardVariants}>
            <div className="p-6 text-center space-y-2 cursor-default h-full">
              <motion.div 
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="font-display font-black text-4xl sm:text-5xl text-[#0054F9]"
              >
                100%
              </motion.div>
              <div className="font-display font-bold text-base text-white">
                NADRA & Escrow Guaranteed
              </div>
              <p className="font-body text-xs text-zinc-400">
                Every artisan is biometrically verified. Payments locked in escrow until OTP sign-off.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
