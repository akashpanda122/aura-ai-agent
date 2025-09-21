"use client";

import Container from "./Container";
import Icons from "./Icons";
import Images from "./Images";
import MagicCard from "./ui/magic-card";
import { Ripple } from "./ui/ripple";
import { SectionBadge } from "./ui/section-bade";

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Sparkles, Zap, Heart, Star, Brain, TrendingUp, MessageCircle, Shield, Palette } from "lucide-react"

const Features = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center py-12 md:py-26 lg:py-64 w-full overflow-hidden"
      style={{ backgroundColor: "#FDECEF" }}
    >
      {/* Background elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, #DCC6E0 0%, transparent 70%), 
                           radial-gradient(circle at 70% 80%, #FFECD2 0%, transparent 70%)`,
        }}
      />

      <motion.div
        className="absolute top-40 right-20 w-40 h-40 rounded-full opacity-15 blur-2xl"
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

      <motion.div style={{ y, opacity }} className="w-full max-w-7xl mx-auto px-4">
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
            <span style={{ color: "#8A4D76", fontWeight: 600 }}>Features</span>
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
            Space to figure things out -<br />
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
              on your terms.
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
            Untangle thoughts, find clarity, and own your growth in a safe digital sanctuary.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="space-y-8">
          {/* First Row */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-[1fr_.65fr] gap-6"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Large Feature Card */}
            <motion.div
              className="relative rounded-2xl p-8 overflow-hidden min-h-80"
              style={{
                backgroundColor: "rgba(255, 236, 210, 0.3)",
                border: "1px solid rgba(220, 198, 224, 0.3)",
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 60px rgba(255, 79, 129, 0.15)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 79, 129, 0.1), rgba(255, 211, 0, 0.1))",
                }}
                animate={{
                  background: [
                    "linear-gradient(135deg, rgba(255, 79, 129, 0.1), rgba(255, 211, 0, 0.1))",
                    "linear-gradient(135deg, rgba(255, 211, 0, 0.1), rgba(255, 79, 129, 0.1))",
                  ],
                }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />

              <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                <motion.div
                  className="mb-6"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <Sparkles className="w-20 h-20" style={{ color: "#FF4F81" }} />
                </motion.div>

                {/* Ripple effect */}
                {/*<div className="absolute inset-0 flex items-center justify-center">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-32 h-32 border-2 rounded-full"
                      style={{ borderColor: "rgba(255, 79, 129, 0.3)" }}
                      animate={{
                        scale: [1, 2, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 1,
                      }}
                    />
                  ))}
                </div>*/}
                <Ripple />

                <h3 className="text-2xl font-medium" style={{ color: "#8A4D76" }}>
                  AI-Powered Therapy
                </h3>
                <p className="mt-2" style={{ color: "#8A4D76" }}>
                  Experience the future of mental wellness
                </p>
              </div>
            </motion.div>

            {/* Adaptive Therapy Engine */}
            <motion.div
              className="relative rounded-2xl p-6 overflow-hidden"
              style={{
                backgroundColor: "rgba(220, 198, 224, 0.3)",
                border: "1px solid rgba(255, 79, 129, 0.2)",
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 15px 40px rgba(220, 198, 224, 0.2)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col h-full">
                <div className="flex-1 mb-4">
                  <motion.div
                    className="w-full h-40 rounded-xl overflow-hidden"
                    style={{ backgroundColor: "rgba(253, 236, 239, 0.5)" }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <div className="w-full h-full flex items-center justify-center relative">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Brain className="w-16 h-16" style={{ color: "#FF4F81" }} />
                      </motion.div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: "#FFD300",
                              top: `${30 + i * 10}%`,
                              left: `${20 + i * 15}%`,
                            }}
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: i * 0.5,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
                <div>
                  <h4 className="text-xl font-medium mb-2" style={{ color: "#8A4D76" }}>
                    Adaptive Therapy Engine
                  </h4>
                  <p className="text-sm" style={{ color: "#8A4D76" }}>
                    AI that learns your unique patterns & evolves with you.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Second Row */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {/* Human-Like Conversation */}
            <motion.div
              className="relative rounded-2xl p-6 overflow-hidden"
              style={{
                backgroundColor: "rgba(255, 236, 210, 0.3)",
                border: "1px solid rgba(255, 79, 129, 0.2)",
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 15px 40px rgba(255, 236, 210, 0.3)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col h-full">
                <div className="flex-1 mb-4">
                  <div className="w-full h-52 relative flex items-center justify-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    >
                      <MessageCircle className="w-16 h-16" style={{ color: "#FF4F81" }} />
                    </motion.div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-20 h-20 border-2 rounded-full opacity-20"
                          style={{ borderColor: "#FF4F81" }}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.2, 0, 0.2],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 1,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-medium mb-2" style={{ color: "#8A4D76" }}>
                    Human-Like Conversation
                  </h4>
                  <p className="text-sm" style={{ color: "#8A4D76" }}>
                    Natural dialogues that listen, reflect & guide (no scripts)
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Middle Column */}
            <div className="space-y-6">
              {/* Privacy Card */}
              <motion.div
                className="relative rounded-2xl p-4 h-32 overflow-hidden"
                style={{
                  backgroundColor: "rgba(220, 198, 224, 0.3)",
                  border: "1px solid rgba(138, 77, 118, 0.2)",
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <div className="relative z-10 h-full flex items-center justify-center">
                  <motion.p
                    className="text-sm text-center leading-relaxed"
                    style={{
                      color: "#8A4D76",
                      background: "radial-gradient(50% 50% at 50% 50%, #8A4D76 0%, rgba(138, 77, 118, 0.3) 90%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                    }}
                  >
                    Talk anytime, anywhere. Zero judgment, 100% privacy. Therapy that speaks your language: memes, mood
                    playlists & real talk
                  </motion.p>
                </div>
                <motion.div
                  className="absolute top-2 right-2"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Shield className="w-6 h-6" style={{ color: "#FF4F81" }} />
                </motion.div>
              </motion.div>

              {/* Mood Tracking */}
              <motion.div
                className="relative rounded-2xl p-4 overflow-hidden"
                style={{
                  backgroundColor: "rgba(255, 236, 210, 0.3)",
                  border: "1px solid rgba(255, 211, 0, 0.3)",
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <div className="w-full h-48 relative flex items-center justify-center">
                  <motion.svg
                    className="w-full h-full opacity-60"
                    viewBox="0 0 200 100"
                    preserveAspectRatio="none"
                    animate={{
                      opacity: [0.6, 0.8, 0.6],
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <motion.path
                      d="M0,50 L30,50 L40,30 L50,70 L60,20 L70,80 L80,50 L120,50 L130,30 L140,70 L150,20 L160,80 L170,50 L200,50"
                      stroke="#FFD300"
                      strokeWidth="3"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                  </motion.svg>
                  <motion.div
                    className="absolute top-4 right-4"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <TrendingUp className="w-6 h-6" style={{ color: "#FF4F81" }} />
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* GenZ Mode */}
            <motion.div
              className="relative rounded-2xl p-6 overflow-hidden"
              style={{
                backgroundColor: "rgba(220, 198, 224, 0.3)",
                border: "1px solid rgba(138, 77, 118, 0.2)",
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 15px 40px rgba(220, 198, 224, 0.2)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col h-full">
                <div>
                  <h4 className="text-xl font-medium mb-2" style={{ color: "#8A4D76" }}>
                    GenZ Mode{" "}
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ backgroundColor: "rgba(255, 211, 0, 0.2)", color: "#8A4D76" }}
                    >
                      Coming Soon
                    </span>
                  </h4>
                  <p className="text-sm mb-4" style={{ color: "#8A4D76" }}>
                    Learns your vibe - gets smarter with every chat
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <motion.div
                    className="relative"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Palette className="w-16 h-16" style={{ color: "#FFD300" }} />
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: i % 2 === 0 ? "#FF4F81" : "#FFD300",
                          top: `${20 + i * 10}%`,
                          left: `${20 + i * 10}%`,
                        }}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Third Row */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-[.40fr_1fr] gap-6"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {/* Mood Insights */}
            <motion.div
              className="relative rounded-2xl p-6 overflow-hidden"
              style={{
                backgroundColor: "rgba(255, 236, 210, 0.3)",
                border: "1px solid rgba(255, 79, 129, 0.2)",
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 15px 40px rgba(255, 236, 210, 0.3)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col h-full">
                <div className="flex-1 mb-4">
                  <div
                    className="w-full aspect-square relative rounded-lg p-4"
                    style={{ backgroundColor: "rgba(253, 236, 239, 0.5)" }}
                  >
                    {/* Chart visualization */}
                    <div className="absolute inset-4">
                      <div
                        className="w-full h-full border-l border-b relative"
                        style={{ borderColor: "rgba(138, 77, 118, 0.2)" }}
                      >
                        {/* Grid lines */}
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute left-0 right-0 h-px"
                            style={{
                              backgroundColor: "rgba(138, 77, 118, 0.1)",
                              bottom: `${25 * i}%`,
                            }}
                          />
                        ))}

                        {/* Trend line */}
                        <svg
                          className="absolute inset-0 w-full h-full"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          <motion.path
                            d="M10,80 Q25,60 40,70 Q55,50 70,45 Q85,35 90,25"
                            stroke="#FF4F81"
                            strokeWidth="2"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                          />
                        </svg>

                        {/* Data points */}
                        {[
                          { bottom: "20%", left: "10%", color: "#FF4F81" },
                          { bottom: "30%", left: "40%", color: "#FFD300" },
                          { bottom: "55%", left: "70%", color: "#8A4D76" },
                          { bottom: "75%", left: "90%", color: "#FF4F81" },
                        ].map((point, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: point.color,
                              bottom: point.bottom,
                              left: point.left,
                            }}
                            animate={{
                              scale: [1, 1.3, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: i * 0.5,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Mood indicators */}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      {["😊", "😐", "😔"].map((emoji, i) => (
                        <motion.div
                          key={i}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                          style={{ backgroundColor: "rgba(253, 236, 239, 0.8)" }}
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.3,
                          }}
                        >
                          {emoji}
                        </motion.div>
                      ))}
                    </div>

                    <div
                      className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: "#8A4D76", color: "#FDECEF" }}
                    >
                      Coming Soon
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-medium mb-2" style={{ color: "#8A4D76" }}>
                    Real-Time Mood Insights
                  </h4>
                  <p className="text-sm" style={{ color: "#8A4D76" }}>
                    Track emotional trends & triggers with smart analytics
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 24/7 Availability */}
            <motion.div
              className="relative rounded-2xl p-6 overflow-hidden"
              style={{
                backgroundColor: "rgba(220, 198, 224, 0.3)",
                border: "1px solid rgba(138, 77, 118, 0.2)",
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 15px 40px rgba(220, 198, 224, 0.2)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col h-full">
                <div className="flex-1 mb-4">
                  <div className="w-full h-40 lg:h-52 relative flex items-center justify-center">
                    {/* Clock */}
                    <motion.div
                      className="w-24 h-24 border-4 rounded-full relative"
                      style={{ borderColor: "#8A4D76", backgroundColor: "#FDECEF" }}
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      {/* Clock markers */}
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-0.5 h-6"
                          style={{
                            backgroundColor: "#8A4D76",
                            top: i % 2 === 0 ? "1px" : "auto",
                            bottom: i % 2 === 1 ? "1px" : "auto",
                            left: i === 1 || i === 3 ? "1px" : "auto",
                            right: i === 1 || i === 3 ? "1px" : "auto",
                            transform: i === 0 || i === 2 ? "translateX(-50%)" : "translateY(-50%)",
                          }}
                        />
                      ))}

                      {/* Clock hands */}
                      <motion.div
                        className="absolute top-1/2 left-1/2 w-0.5 h-8 origin-bottom"
                        style={{ backgroundColor: "#FF4F81", transform: "translate(-50%, -100%) rotate(60deg)" }}
                        animate={{ rotate: [60, 420] }}
                        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      />
                      <motion.div
                        className="absolute top-1/2 left-1/2 w-0.5 h-6 origin-bottom"
                        style={{ backgroundColor: "#FFD300", transform: "translate(-50%, -100%) rotate(90deg)" }}
                        animate={{ rotate: [90, 450] }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      />
                      <div
                        className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                        style={{ backgroundColor: "#8A4D76" }}
                      />
                    </motion.div>

                    {/* Orbiting elements */}
                    <motion.div
                      className="absolute"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <div className="w-32 h-32 relative">
                        {[
                          { icon: <Heart className="w-4 h-4" />, color: "#FF4F81", pos: "-top-2 left-1/2" },
                          { icon: <Zap className="w-4 h-4" />, color: "#FFD300", pos: "top-1/2 -right-2" },
                          { icon: <Star className="w-4 h-4" />, color: "#8A4D76", pos: "-bottom-2 left-1/2" },
                          { icon: <Sparkles className="w-4 h-4" />, color: "#FF4F81", pos: "top-1/2 -left-2" },
                        ].map((item, i) => (
                          <motion.div
                            key={i}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full ${item.pos}`}
                            style={{ backgroundColor: "rgba(253, 236, 239, 0.9)" }}
                            animate={{
                              scale: [1, 1.2, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: i * 0.5,
                            }}
                          >
                            <div style={{ color: item.color }}>{item.icon}</div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Floating badges */}
                    {[
                      { text: "2AM ✓", color: "#FF4F81", pos: "top-4 left-8", delay: 0 },
                      { text: "No Wait", color: "#FFD300", pos: "top-8 right-8", delay: 0.5 },
                      { text: "Free", color: "#8A4D76", pos: "bottom-6 left-4", delay: 1 },
                    ].map((badge, i) => (
                      <motion.div
                        key={i}
                        className={`absolute ${badge.pos} px-2 py-1 rounded-full text-xs font-medium`}
                        style={{
                          backgroundColor: "rgba(253, 236, 239, 0.9)",
                          color: badge.color,
                        }}
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: badge.delay,
                        }}
                      >
                        {badge.text}
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-medium mb-2" style={{ color: "#8A4D76" }}>
                    Therapy in your pocket: anytime, anywhere
                  </h4>
                  <p className="text-sm" style={{ color: "#8A4D76" }}>
                    Stressed at 2 AM? Overwhelmed at work? Aura&apos;s here - no waiting rooms, no fees.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Features
