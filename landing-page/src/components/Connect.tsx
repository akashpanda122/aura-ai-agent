"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Sparkles, Zap, Heart, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Particles } from "./ui/particles"
import Link from "next/link";
import Images from "./Images";

const Connect = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center py-16 md:pb-24 lg:pb-60 pt-12 w-full overflow-hidden"
      style={{ backgroundColor: "#FDECEF" }}
    >
      {/* Background elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, #DCC6E0 0%, transparent 70%), 
                           radial-gradient(circle at 80% 70%, #FFECD2 0%, transparent 70%)`,
        }}
      />

      <motion.div
        className="absolute top-20 right-20 w-32 h-32 rounded-full opacity-20 blur-xl"
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
        className="absolute bottom-40 left-20 w-24 h-24 rounded-full opacity-15 blur-lg"
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

      {/* Content container */}
      <motion.div className="relative z-10 w-full max-w-7xl mx-auto px-4" style={{ y, opacity, scale }}>
        {/* Header section */}
        <motion.div
          className="flex flex-col items-center text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Section Badge */}
          <motion.div
            className="relative inline-flex items-center px-4 py-1.5 rounded-full"
            style={{
              backgroundColor: "rgba(220, 198, 224, 0.3)",
              border: "1px solid rgba(255, 79, 129, 0.2)",
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full opacity-0 hover:opacity-100"
              style={{
                background: "linear-gradient(135deg, rgba(255, 211, 0, 0.1), rgba(255, 79, 129, 0.1))",
              }}
              transition={{ duration: 0.3 }}
            />

            <motion.div
              className="mr-2 p-1 rounded-full"
              style={{ backgroundColor: "rgba(255, 79, 129, 0.2)" }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: "#FF4F81" }} />
            </motion.div>

            <span style={{ color: "#8A4D76", fontWeight: 600 }}>Connect Tools</span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            className="text-2xl md:text-4xl lg:text-5xl font-medium mt-6 relative"
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
            We&apos;re Built
            <motion.span
              className="relative ml-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
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
                Different!
              </motion.span>
              <motion.div
                className="absolute -top-6 -right-6"
                animate={{
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <Star className="w-5 h-5" style={{ color: "#FFD300" }} fill="#FFD300" />
              </motion.div>
            </motion.span>
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-base md:text-lg text-center mt-6 leading-relaxed"
            style={{ color: "#8A4D76" }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            No appointments. No judgment. Just
            <motion.span
              className="relative mx-1"
              style={{ color: "#FF4F81" }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              science-backed care
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Zap className="w-3 h-3" style={{ color: "#FFD300" }} />
              </motion.div>
            </motion.span>
            that adapts to you, 24/7.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="mt-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                asChild
                className="relative overflow-hidden group px-6 py-2 rounded-full"
                style={{
                  backgroundColor: "#FF4F81",
                  color: "#FDECEF",
                  border: "none",
                }}
              >
                <Link href="/tools">
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    style={{
                      background: "linear-gradient(135deg, #FFD300, #FF4F81)",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 flex items-center">
                    Explore Tools
                    <motion.div
                      className="ml-2"
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Image showcase */}
        <motion.div
          className="w-full relative mt-16 md:mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="relative rounded-2xl overflow-hidden border shadow-xl"
            style={{
              borderColor: "rgba(220, 198, 224, 0.3)",
              backgroundColor: "rgba(255, 236, 210, 0.1)",
              boxShadow: "0 20px 60px rgba(255, 79, 129, 0.15)",
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 25px 80px rgba(255, 79, 129, 0.2)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Animated gradient overlay */}
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 79, 129, 0.2), rgba(255, 211, 0, 0.2), rgba(220, 198, 224, 0.2))",
              }}
              animate={{
                background: [
                  "linear-gradient(135deg, rgba(255, 79, 129, 0.2), rgba(255, 211, 0, 0.2), rgba(220, 198, 224, 0.2))",
                  "linear-gradient(135deg, rgba(220, 198, 224, 0.2), rgba(255, 79, 129, 0.2), rgba(255, 211, 0, 0.2))",
                  "linear-gradient(135deg, rgba(255, 211, 0, 0.2), rgba(220, 198, 224, 0.2), rgba(255, 79, 129, 0.2))",
                ],
              }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />

            {/* Placeholder image */}
            <Images.connect className="w-full h-auto" />

            {/* Feature badges */}
            <motion.div
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium flex items-center"
              style={{
                backgroundColor: "rgba(255, 79, 129, 0.9)",
                color: "#FDECEF",
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <Heart className="w-3 h-3 mr-1" />
              <span>AI-Powered</span>
            </motion.div>

            <motion.div
              className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium flex items-center"
              style={{
                backgroundColor: "rgba(255, 211, 0, 0.9)",
                color: "#8A4D76",
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <Zap className="w-3 h-3 mr-1" />
              <span>24/7 Support</span>
            </motion.div>

            {/* Floating elements */}
            <motion.div
              className="absolute bottom-8 left-8 w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "rgba(253, 236, 239, 0.9)",
                boxShadow: "0 8px 32px rgba(255, 79, 129, 0.2)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8" style={{ color: "#FF4F81" }} />
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "rgba(253, 236, 239, 0.9)",
                boxShadow: "0 8px 32px rgba(255, 211, 0, 0.2)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 1.8 }}
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Star className="w-8 h-8" style={{ color: "#FFD300" }} />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {[
            {
              icon: <Heart className="w-6 h-6" style={{ color: "#FF4F81" }} />,
              title: "Personalized Care",
              description: "Tailored support that adapts to your unique needs and journey.",
              color: "#FF4F81",
              bgColor: "rgba(255, 79, 129, 0.1)",
              delay: 0,
            },
            {
              icon: <Zap className="w-6 h-6" style={{ color: "#FFD300" }} />,
              title: "Instant Support",
              description: "Available 24/7 whenever you need guidance or assistance.",
              color: "#FFD300",
              bgColor: "rgba(255, 211, 0, 0.1)",
              delay: 0.2,
            },
            {
              icon: <Sparkles className="w-6 h-6" style={{ color: "#8A4D76" }} />,
              title: "Science-Backed",
              description: "Evidence-based approaches for effective mental wellness.",
              color: "#8A4D76",
              bgColor: "rgba(138, 77, 118, 0.1)",
              delay: 0.4,
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="rounded-xl p-6 relative overflow-hidden"
              style={{
                backgroundColor: "rgba(253, 236, 239, 0.6)",
                borderTop: `2px solid ${feature.color}`,
                boxShadow: "0 10px 30px rgba(138, 77, 118, 0.1)",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 1.2 + feature.delay }}
              whileHover={{
                y: -5,
                boxShadow: "0 15px 30px rgba(138, 77, 118, 0.15)",
              }}
            >
              <motion.div
                className="absolute inset-0 opacity-0 hover:opacity-100"
                style={{
                  background: `linear-gradient(135deg, ${feature.bgColor}, rgba(253, 236, 239, 0))`,
                }}
                transition={{ duration: 0.3 }}
              />

              <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: feature.bgColor }}
                whileHover={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1 }}
              >
                {feature.icon}
              </motion.div>

              <h3 className="text-lg font-medium mb-2" style={{ color: feature.color }}>
                {feature.title}
              </h3>

              <p className="text-sm" style={{ color: "#8A4D76" }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Connect
