"use client"

import { PERKS } from "@/constants/perks";
import { cn } from "@/functions/cn";
//import { LucideIcon } from "lucide-react";
import Container from "./Container";
import { SectionBadge } from "./ui/section-bade";

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Heart, Brain, Shield, Star, Sparkles, MessageCircle, TrendingUp, type LucideIcon } from "lucide-react"

const Perks = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: "-100px" })

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center py-16 md:py-24 w-full overflow-hidden"
      style={{ backgroundColor: "#FDECEF" }}
    >
      {/* Background elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #DCC6E0 0%, transparent 70%), 
                           radial-gradient(circle at 75% 75%, #FFECD2 0%, transparent 70%)`,
        }}
      />

      <motion.div
        className="absolute top-20 right-20 w-40 h-40 rounded-full opacity-15 blur-2xl"
        style={{ backgroundColor: "#DCC6E0" }}
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-40 left-20 w-32 h-32 rounded-full opacity-20 blur-xl"
        style={{ backgroundColor: "#FFECD2" }}
        animate={{
          y: [0, 40, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: i % 3 === 0 ? "#FF4F81" : i % 3 === 1 ? "#FFD300" : "#8A4D76",
            top: `${20 + i * 10}%`,
            left: `${10 + i * 12}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}

      <div className="w-full max-w-7xl mx-auto px-4">
        {/* Header section */}
        <motion.div
          className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Section Badge */}
          <motion.div
            className="relative inline-flex items-center px-4 py-1.5 rounded-full mb-6"
            style={{
              backgroundColor: "rgba(220, 198, 224, 0.3)",
              border: "1px solid rgba(255, 79, 129, 0.2)",
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              className="mr-2 p-1 rounded-full"
              style={{ backgroundColor: "rgba(255, 79, 129, 0.2)" }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <Star className="w-3.5 h-3.5" style={{ color: "#FF4F81" }} />
            </motion.div>
            <span style={{ color: "#8A4D76", fontWeight: 600 }}>Perks</span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            className="text-2xl md:text-4xl lg:text-5xl font-medium mb-6"
            style={{
              background: "linear-gradient(135deg, #8A4D76 0%, #FF4F81 50%, #8A4D76 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              lineHeight: 1.2,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Not just therapy.{" "}
            <motion.span
              style={{
                background: "linear-gradient(135deg, #FF4F81, #FFD300)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            >
              Your AI companion
            </motion.span>
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-base md:text-lg leading-relaxed"
            style={{ color: "#8A4D76" }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            Aura learns your patterns, celebrates your wins, and grows with you.{" "}
            <motion.span
              style={{ color: "#FF4F81" }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              No generic advice.
            </motion.span>
          </motion.p>
        </motion.div>

        {/* Perks Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Grid background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `linear-gradient(rgba(138, 77, 118, 0.1) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(138, 77, 118, 0.1) 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          {PERKS.map((perk, index) => (
            <PerkCard key={index} index={index} {...perk} isInView={isInView} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

const PerkCard = ({
  title,
  description,
  icon: Icon,
  index,
  isInView,
}: {
  title: string
  description: string
  icon: LucideIcon
  index: number
  isInView: boolean
}) => {
  const colors = [
    { bg: "rgba(255, 79, 129, 0.1)", accent: "#FF4F81", glow: "rgba(255, 79, 129, 0.2)" },
    { bg: "rgba(255, 211, 0, 0.1)", accent: "#FFD300", glow: "rgba(255, 211, 0, 0.2)" },
    { bg: "rgba(220, 198, 224, 0.1)", accent: "#DCC6E0", glow: "rgba(220, 198, 224, 0.2)" },
    { bg: "rgba(255, 236, 210, 0.1)", accent: "#FF4F81", glow: "rgba(255, 79, 129, 0.2)" }, // Fixed: Changed from #FFECD2 to #FF4F81
    { bg: "rgba(138, 77, 118, 0.1)", accent: "#8A4D76", glow: "rgba(138, 77, 118, 0.2)" },
    { bg: "rgba(255, 79, 129, 0.1)", accent: "#FF4F81", glow: "rgba(255, 79, 129, 0.2)" },
  ]

  const cardColor = colors[index % colors.length]

  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: 0.8 + index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -8 }}
    >
      {/* Card background */}
      <motion.div
        className="relative rounded-2xl p-8 h-full overflow-hidden"
        style={{
          backgroundColor: "rgba(253, 236, 239, 0.6)",
          border: `1px solid ${cardColor.accent}20`,
        }}
        whileHover={{
          boxShadow: `0 20px 60px ${cardColor.glow}`,
          borderColor: `${cardColor.accent}40`,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{
            background: `linear-gradient(135deg, ${cardColor.bg}, rgba(253, 236, 239, 0))`,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Floating accent dot */}
        <motion.div
          className="absolute top-4 right-4 w-3 h-3 rounded-full"
          style={{ backgroundColor: cardColor.accent }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: index * 0.5,
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Icon */}
          <motion.div
            className="mb-6 relative"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
              style={{ backgroundColor: cardColor.bg }}
              animate={{
                boxShadow: [`0 0 20px ${cardColor.glow}`, `0 0 30px ${cardColor.glow}`, `0 0 20px ${cardColor.glow}`],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            >
              <Icon className="w-8 h-8" style={{ color: cardColor.accent }} strokeWidth={1.5} />

              {/* Icon glow effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ backgroundColor: cardColor.accent }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0, 0.1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: index * 0.3,
                }}
              />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h3
            className="text-xl font-medium mb-3 relative"
            style={{ color: "#8A4D76" }}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {title}
            <motion.div
              className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100"
              style={{ width: "100%" }}
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.h3>

          {/* Description */}
          <motion.p
            className="text-sm leading-relaxed flex-1"
            style={{ color: "#8A4D76" }}
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {description}
          </motion.p>

          {/* Hover indicator */}
          <motion.div
            className="mt-4 flex items-center text-xs font-medium opacity-0 group-hover:opacity-100"
            style={{ color: cardColor.accent }}
            initial={{ x: -10 }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span>Learn more</span>
            <motion.div
              className="ml-1"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              →
            </motion.div>
          </motion.div>
        </div>

        {/* Corner accent */}
        <motion.div
          className="absolute bottom-0 right-0 w-16 h-16 opacity-10"
          style={{
            background: `radial-gradient(circle at center, ${cardColor.accent}, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            delay: index * 0.7,
          }}
        />
      </motion.div>

      {/* Card number indicator */}
      <motion.div
        className="absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
        style={{
          backgroundColor: cardColor.accent,
          color: "#FDECEF",
        }}
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.5, delay: 1 + index * 0.1, type: "spring", stiffness: 400, damping: 17 }}
        whileHover={{ scale: 1.2 }}
      >
        {index + 1}
      </motion.div>
    </motion.div>
  )
}

export default Perks
