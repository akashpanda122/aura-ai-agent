"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Heart, Sparkles, Star, ArrowRight, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const CTA = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

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

      {/* Floating elements */}
      {Array.from({ length: 12 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${15 + (i % 4) * 20}%`,
            left: `${10 + (i % 3) * 30}%`,
          }}
          animate={{
            y: [0, -80, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8 + (i % 3) * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        >
          {i % 3 === 0 ? (
            <Heart className="w-4 h-4" style={{ color: "#FF4F81" }} fill="currentColor" />
          ) : i % 3 === 1 ? (
            <Star className="w-4 h-4" style={{ color: "#FFD300" }} fill="currentColor" />
          ) : (
            <Sparkles className="w-4 h-4" style={{ color: "#8A4D76" }} />
          )}
        </motion.div>
      ))}

      <motion.div style={{ y, opacity }} className="w-full max-w-6xl mx-auto px-4">
        <motion.div
          className="relative flex flex-col items-center justify-center text-center w-full px-8 md:px-12 mx-auto h-[600px] rounded-3xl overflow-hidden"
          style={{
            backgroundColor: "rgba(253, 236, 239, 0.8)",
            border: "1px solid rgba(220, 198, 224, 0.3)",
            backdropFilter: "blur(20px)",
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 25px 80px rgba(255, 79, 129, 0.15)",
          }}
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 79, 129, 0.1), rgba(255, 211, 0, 0.1), rgba(220, 198, 224, 0.1))",
            }}
            animate={{
              background: [
                "linear-gradient(135deg, rgba(255, 79, 129, 0.1), rgba(255, 211, 0, 0.1), rgba(220, 198, 224, 0.1))",
                "linear-gradient(135deg, rgba(220, 198, 224, 0.1), rgba(255, 79, 129, 0.1), rgba(255, 211, 0, 0.1))",
                "linear-gradient(135deg, rgba(255, 211, 0, 0.1), rgba(220, 198, 224, 0.1), rgba(255, 79, 129, 0.1))",
              ],
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />

          {/* Retro grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `linear-gradient(rgba(138, 77, 118, 0.3) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(138, 77, 118, 0.3) 1px, transparent 1px)`,
                backgroundSize: "50px 50px",
              }}
            />
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  backgroundColor: i % 3 === 0 ? "#FF4F81" : i % 3 === 1 ? "#FFD300" : "#8A4D76",
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: Math.random() * 4,
                }}
              />
            ))}
          </div>

          {/* Glow effects */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 blur-3xl"
            style={{ backgroundColor: "rgba(255, 79, 129, 0.3)" }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          />

          <motion.div
            className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full blur-3xl"
            style={{ backgroundColor: "rgba(255, 211, 0, 0.2)" }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
          />

          <motion.div
            className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full blur-3xl"
            style={{ backgroundColor: "rgba(220, 198, 224, 0.3)" }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
          />

          {/* Content */}
          <div className="relative z-20 flex flex-col items-center justify-center w-full">
            {/* Floating accent elements */}
            <motion.div
              className="absolute -top-8 -left-8 w-6 h-6 rounded-full"
              style={{ backgroundColor: "#FFD300" }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.div
              className="absolute -top-4 -right-12 w-4 h-4 rounded-full"
              style={{ backgroundColor: "#FF4F81" }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
            />

            {/* Main heading */}
            <motion.h2
              className="text-3xl md:text-5xl lg:text-6xl font-semibold leading-tight"
              style={{
                background: "linear-gradient(135deg, #8A4D76 0%, #FF4F81 50%, #8A4D76 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <motion.span
                className="block"
                style={{
                  background: "linear-gradient(135deg, #8A4D76 0%, #FF4F81 50%, #8A4D76 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Find balance.
              </motion.span>
              <motion.span
                className="block"
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
                whileHover={{ scale: 1.05 }}
              >
                Find peace.
              </motion.span>
              <motion.span
                className="block relative"
                style={{
                  background: "linear-gradient(135deg, #8A4D76 0%, #FF4F81 50%, #8A4D76 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Find you.
                <motion.div
                  className="absolute -top-4 -right-8"
                  animate={{
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Sparkles className="w-8 h-8" style={{ color: "#FFD300" }} />
                </motion.div>
              </motion.span>
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-base md:text-lg text-center max-w-xl mx-auto mt-8 leading-relaxed"
              style={{ color: "#8A4D76" }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              Life&apos;s messy. With{" "}
              <motion.span
                style={{ color: "#FF4F81" }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Aura
              </motion.span>
              , you&apos;re never alone in the storm.
              <motion.span
                className="inline-block ml-2"
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Heart className="w-5 h-5 inline" style={{ color: "#FF4F81" }} fill="currentColor" />
              </motion.span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col md:flex-row items-center justify-center w-full gap-6 mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="relative overflow-hidden group w-full md:w-auto px-8 py-4 text-lg rounded-full"
                  style={{
                    backgroundColor: "#FF4F81",
                    color: "#FDECEF",
                    border: "none",
                  }}
                >
                  <Link href="/get-started">
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      style={{
                        background: "linear-gradient(135deg, #FFD300, #FF4F81, #8A4D76)",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10 flex items-center">
                      Get Started
                      <motion.div
                        className="ml-2"
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </span>
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="relative overflow-hidden group w-full md:w-auto px-8 py-4 text-lg rounded-full"
                  style={{
                    backgroundColor: "rgba(220, 198, 224, 0.3)",
                    borderColor: "rgba(138, 77, 118, 0.3)",
                    color: "#8A4D76",
                  }}
                >
                  <Link href="/learn-more">
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      style={{
                        background: "linear-gradient(135deg, rgba(255, 236, 210, 0.5), rgba(220, 198, 224, 0.5))",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10 flex items-center">
                      Learn More
                      <motion.div
                        className="ml-2"
                        whileHover={{ rotate: 15 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Zap className="w-5 h-5" />
                      </motion.div>
                    </span>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="flex items-center gap-8 mt-12 text-sm"
              style={{ color: "#8A4D76" }}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Star className="w-4 h-4" style={{ color: "#FFD300" }} fill="currentColor" />
                </motion.div>
                <span>4.9/5 Rating</span>
              </motion.div>

              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                >
                  <Heart className="w-4 h-4" style={{ color: "#FF4F81" }} fill="currentColor" />
                </motion.div>
                <span>10K+ Users</span>
              </motion.div>

              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: "#8A4D76" }} />
                </motion.div>
                <span>Free to Start</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Corner decorations */}
          <motion.div
            className="absolute top-4 left-4 w-16 h-16 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle at center, #FF4F81, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
            }}
          />

          <motion.div
            className="absolute bottom-4 right-4 w-16 h-16 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle at center, #FFD300, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: 2,
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default CTA
