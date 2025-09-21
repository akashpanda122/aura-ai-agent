"use client"

import { REVIEWS } from "@/constants/reviews";
import Container from "./Container";
import Marquee from "./ui/marquee";
import { SectionBadge } from "./ui/section-bade";
import Image from "next/image";
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Star, Heart, Sparkles, Quote } from "lucide-react"

const firstRow = REVIEWS.slice(0, REVIEWS.length / 2);
const secondRow = REVIEWS.slice(REVIEWS.length / 2);

// Sample reviews data - replace with your REVIEWS constant

const Reviews = () => {
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
          backgroundImage: `radial-gradient(circle at 30% 30%, #DCC6E0 0%, transparent 70%), 
                           radial-gradient(circle at 70% 70%, #FFECD2 0%, transparent 70%)`,
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

      {/* Floating hearts and stars */}
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${20 + i * 15}%`,
            left: `${15 + i * 12}%`,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 1.2,
          }}
        >
          {i % 2 === 0 ? (
            <Heart className="w-4 h-4" style={{ color: "#FF4F81" }} fill="currentColor" />
          ) : (
            <Star className="w-4 h-4" style={{ color: "#FFD300" }} fill="currentColor" />
          )}
        </motion.div>
      ))}

      <div className="w-full max-w-7xl mx-auto px-4">
        {/* Header section */}
        <motion.div
          className="flex flex-col items-center text-center max-w-xl mx-auto mb-16"
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
              <Heart className="w-3.5 h-3.5" style={{ color: "#FF4F81" }} />
            </motion.div>
            <span style={{ color: "#8A4D76", fontWeight: 600 }}>Our Customers</span>
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
            What our{" "}
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
              customers say
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
            We are proud to have helped thousands of customers across the globe.{" "}
            <motion.span
              style={{ color: "#FF4F81" }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Here are some of their stories
            </motion.span>
          </motion.p>

          {/* Stats */}
          <motion.div
            className="flex items-center gap-8 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <div className="text-center">
              <motion.div
                className="text-2xl font-bold"
                style={{ color: "#FF4F81" }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                10K+
              </motion.div>
              <div className="text-sm" style={{ color: "#8A4D76" }}>
                Happy Users
              </div>
            </div>
            <div className="text-center">
              <motion.div
                className="text-2xl font-bold"
                style={{ color: "#FFD300" }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
              >
                4.9★
              </motion.div>
              <div className="text-sm" style={{ color: "#8A4D76" }}>
                Average Rating
              </div>
            </div>
            <div className="text-center">
              <motion.div
                className="text-2xl font-bold"
                style={{ color: "#8A4D76" }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
              >
                24/7
              </motion.div>
              <div className="text-sm" style={{ color: "#8A4D76" }}>
                Support
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Reviews Marquee */}
        <motion.div
          className="relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="relative flex flex-col items-center justify-center overflow-hidden">
            {/* First Row */}
            <div className="flex animate-marquee hover:pause-animation">
              {[...firstRow, ...firstRow].map((review, index) => (
                <ReviewCard key={`first-${index}`} {...review} index={index} />
              ))}
            </div>

            {/* Second Row */}
            <div className="flex animate-marquee-reverse hover:pause-animation mt-4">
              {[...secondRow, ...secondRow].map((review, index) => (
                <ReviewCard key={`second-${index}`} {...review} index={index} reverse />
              ))}
            </div>

            {/* Gradient overlays */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-1/4"
              style={{
                background: "linear-gradient(to right, #FDECEF, transparent)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-1/4"
              style={{
                background: "linear-gradient(to left, #FDECEF, transparent)",
              }}
            />

            {/* Background glow effects */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-28 h-28 rounded-full -z-10 blur-3xl"
              style={{ backgroundColor: "rgba(255, 79, 129, 0.3)" }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.div
              className="absolute top-1/4 right-1/4 w-28 h-28 rounded-full -z-10 blur-3xl"
              style={{ backgroundColor: "rgba(255, 211, 0, 0.3)" }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const ReviewCard = ({
  img,
  name,
  username,
  review,
  rating = 5,
  mood = "happy",
  index,
  reverse = false,
}: {
  img: string
  name: string
  username: string
  review: string
  rating?: number
  mood?: string
  index: number
  reverse?: boolean
}) => {
  const moodColors = {
    grateful: "#FF4F81",
    relieved: "#FFD300",
    empowered: "#8A4D76",
    hopeful: "#DCC6E0",
    surprised: "#FFECD2",
    enlightened: "#FF4F81",
    happy: "#FFD300",
  }

  const moodColor = moodColors[mood as keyof typeof moodColors] || "#FF4F81"

  return (
    <motion.figure
      className="relative w-80 mx-4 cursor-pointer overflow-hidden rounded-2xl border p-6 group"
      style={{
        backgroundColor: "rgba(253, 236, 239, 0.8)",
        borderColor: "rgba(220, 198, 224, 0.3)",
        backdropFilter: "blur(10px)",
        animationDelay: `${index * 0.1}s`,
      }}
      whileHover={{
        scale: 1.05,
        y: -8,
        boxShadow: `0 20px 60px rgba(255, 79, 129, 0.15)`,
        borderColor: "rgba(255, 79, 129, 0.4)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      //style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, rgba(255, 79, 129, 0.05), rgba(255, 211, 0, 0.05))`,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Quote icon */}
      <motion.div
        className="absolute top-4 right-4 opacity-20"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
      >
        <Quote className="w-6 h-6" style={{ color: moodColor }} />
      </motion.div>

      {/* Mood indicator */}
      <motion.div
        className="absolute top-4 left-4 w-3 h-3 rounded-full"
        style={{ backgroundColor: moodColor }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          delay: index * 0.3,
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-row items-center gap-3 mb-4">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Image
              className="rounded-full border-2"
              width="40"
              height="40"
              alt={name}
              src={img || "/placeholder.svg"}
              style={{ borderColor: moodColor }}
            />
            <motion.div
              className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100"
              style={{ backgroundColor: moodColor }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0, 0.2, 0],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </motion.div>

          <div className="flex flex-col flex-1">
            <motion.figcaption
              className="text-sm font-medium"
              style={{ color: "#8A4D76" }}
              whileHover={{ x: 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {name}
            </motion.figcaption>
            <motion.p
              className="text-xs font-medium opacity-60"
              style={{ color: "#8A4D76" }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {username}
            </motion.p>
          </div>

          {/* Rating stars */}
          <div className="flex gap-1">
            {Array.from({ length: rating }, (_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.1 + index * 0.2,
                }}
              >
                <Star className="w-3 h-3" style={{ color: "#FFD300" }} fill="currentColor" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Review text */}
        <motion.blockquote
          className="text-sm leading-relaxed"
          style={{ color: "#8A4D76" }}
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {review}
        </motion.blockquote>

        {/* Mood tag */}
        <motion.div
          className="mt-4 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${moodColor}20`,
            color: moodColor,
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Sparkles className="w-3 h-3 mr-1" />
          {mood}
        </motion.div>
      </div>

      {/* Corner decoration */}
      <motion.div
        className="absolute bottom-0 right-0 w-12 h-12 opacity-10"
        style={{
          background: `radial-gradient(circle at center, ${moodColor}, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          delay: index * 0.4,
        }}
      />
    </motion.figure>
  )
}

export default Reviews