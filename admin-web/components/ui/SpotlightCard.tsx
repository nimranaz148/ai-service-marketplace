"use client";

import React, { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  borderGlowColor?: string;
  hoverLift?: number;
  scaleHover?: number;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(0, 84, 249, 0.15)",
  borderGlowColor = "rgba(0, 84, 249, 0.45)",
  hoverLift = -8,
  scaleHover = 1.025,
  ...props
}: SpotlightCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isHovered = useMotionValue(0);

  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  function handleMouseEnter() {
    isHovered.set(1);
  }

  function handleMouseLeave() {
    isHovered.set(0);
  }

  const spotlightBackground = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 80%)`;
  const borderBackground = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, ${borderGlowColor}, transparent 70%)`;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        y: hoverLift,
        scale: scaleHover,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
      whileTap={{
        scale: 0.98,
        transition: { type: "spring", stiffness: 500, damping: 20 },
      }}
      className={`group relative overflow-hidden rounded-[2.5rem] border border-white/8 bg-[#12121B] transition-colors duration-300 ${className}`}
      {...(props as any)}
    >
      {/* 1. Dynamic Mouse-Follow Border Glow Transition */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: borderBackground,
          maskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />

      {/* 2. Dynamic Mouse-Follow Radial Spotlight Surface Transition */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: spotlightBackground,
        }}
      />

      {/* 3. Card Content */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </motion.div>
  );
}
