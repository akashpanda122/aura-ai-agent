"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Heart, Sparkles, Star, ArrowRight, Instagram, Twitter, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Container from "./Container"
import Wrapper from "./Wrapper"
import { Button } from "./ui/button"
import { FOOTER_LINKS } from "@/constants/links"
import Logo from "../../public/logo.png"

const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: "-100px" })

  return (
    <footer ref={containerRef} className="w-full py-16 relative overflow-hidden" style={{ backgroundColor: "#FDECEF" }}>
      {/* Background elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, #DCC6E0 0%, transparent 70%), 
                           radial-gradient(circle at 80% 80%, #FFECD2 0%, transparent 70%)`,
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
            y: [0, -60, 0],
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
            <Heart className="w-3 h-3" style={{ color: "#FF4F81" }} fill="currentColor" />
          ) : i % 3 === 1 ? (
            <Star className="w-3 h-3" style={{ color: "#FFD300" }} fill="currentColor" />
          ) : (
            <Sparkles className="w-3 h-3" style={{ color: "#8A4D76" }} />
          )}
        </motion.div>
      ))}

      {/* Decorative top border */}
      <motion.div
        className="absolute top-0 left-0 w-full h-px"
        style={{
          background: "linear-gradient(90deg, transparent, #FF4F81, #FFD300, #8A4D76, transparent)",
        }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      <Container>
        <Wrapper className="relative flex flex-col md:flex-row justify-between pb-20 overflow-hidden">
          {/* Custom particles */}
          <div className="absolute inset-0 w-full -z-10">
            {Array.from({ length: 30 }, (_, i) => (
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
                  opacity: [0, 0.6, 0],
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

          {/* Brand section */}
          <motion.div
            className="flex flex-col items-start max-w-sm relative z-10"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="flex items-center gap-3 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                className="relative"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <Image
                  src={Logo}
                  alt="Aura Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <motion.div
                  className="absolute -inset-1 rounded-lg opacity-0 hover:opacity-100"
                  style={{ backgroundColor: "rgba(255, 79, 129, 0.2)" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <motion.span
                className="text-2xl font-semibold"
                style={{
                  background: "linear-gradient(135deg, #8A4D76 0%, #FF4F81 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Aura
              </motion.span>
            </motion.div>

            <motion.p
              className="text-base leading-relaxed mb-6"
              style={{ color: "#8A4D76" }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Your Personalized Therapist that{" "}
              <motion.span
                style={{ color: "#FF4F81" }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                truly cares
              </motion.span>
              .
              <motion.span
                className="inline-block ml-1"
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Heart className="w-4 h-4 inline" style={{ color: "#FF4F81" }} fill="currentColor" />
              </motion.span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  asChild
                  className="relative overflow-hidden group px-6 py-3 rounded-full"
                  style={{
                    backgroundColor: "#FF4F81",
                    color: "#FDECEF",
                    border: "none",
                  }}
                >
                  <Link href="/app">
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      style={{
                        background: "linear-gradient(135deg, #FFD300, #FF4F81, #8A4D76)",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10 flex items-center">
                      Start Yapping
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

            {/* Decorative elements around brand */}
            <motion.div
              className="absolute -top-4 -right-4 w-6 h-6 rounded-full"
              style={{ backgroundColor: "#FFD300" }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.div
              className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full"
              style={{ backgroundColor: "#FF4F81" }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
            />
          </motion.div>

          {/* Links section */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-2xl mt-12 md:mt-0 relative z-10"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {FOOTER_LINKS?.map((section, sectionIndex) => (
              <motion.div
                key={sectionIndex}
                className="flex flex-col gap-4 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4 + sectionIndex * 0.1, ease: "easeOut" }}
              >
                {/* Section accent */}
                <motion.div
                  className="absolute -top-2 -left-2 w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      sectionIndex % 3 === 0 ? "#FF4F81" : sectionIndex % 3 === 1 ? "#FFD300" : "#8A4D76",
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: sectionIndex * 0.5,
                  }}
                />

                <motion.h4
                  className="text-sm font-semibold relative"
                  style={{ color: "#8A4D76" }}
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {section.title}
                  <motion.div
                    className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 hover:opacity-100"
                    style={{ width: "100%" }}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.h4>

                <ul className="space-y-3 w-full">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={linkIndex}
                      className="w-full"
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ duration: 0.4, delay: 0.6 + sectionIndex * 0.1 + linkIndex * 0.05 }}
                    >
                      <motion.div
                        whileHover={{ x: 4, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Link
                          href={link.href}
                          className="text-sm w-full block relative group"
                          style={{ color: "#8A4D76" }}
                        >
                          <motion.span
                            className="relative z-10"
                            whileHover={{ color: "#FF4F81" }}
                            transition={{ duration: 0.2 }}
                          >
                            {link.name}
                          </motion.span>
                          <motion.div
                            className="absolute inset-0 rounded opacity-0 group-hover:opacity-100"
                            style={{ backgroundColor: "rgba(255, 79, 129, 0.05)" }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          />
                        </Link>
                      </motion.div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </Wrapper>
      </Container>

      {/* Bottom section */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
      >
        {/* Decorative divider */}
        <motion.div
          className="w-full h-px mb-8"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255, 79, 129, 0.3), rgba(255, 211, 0, 0.3), rgba(138, 77, 118, 0.3), transparent)",
          }}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
        />

        <Container>
          <Wrapper className="flex flex-col md:flex-row items-center justify-between relative">
            {/* Copyright */}
            <motion.p
              className="text-sm mb-4 md:mb-0"
              style={{ color: "#8A4D76" }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              &copy; {new Date().getFullYear()}{" "}
              <motion.span
                style={{ color: "#FF4F81" }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Aura
              </motion.span>
              . All rights reserved.
            </motion.p>

            {/* Social links */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
            >
              {[
                { icon: Instagram, href: "#", color: "#FF4F81" },
                { icon: Twitter, href: "#", color: "#FFD300" },
                { icon: MessageCircle, href: "#", color: "#8A4D76" },
              ].map((social, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link
                    href={social.href}
                    className="p-2 rounded-full relative group overflow-hidden"
                    style={{ backgroundColor: "rgba(253, 236, 239, 0.6)" }}
                  >
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      style={{ backgroundColor: `${social.color}20` }}
                      transition={{ duration: 0.3 }}
                    />
                    <social.icon className="w-5 h-5 relative z-10" style={{ color: social.color }} />

                    {/* Ripple effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 opacity-0 group-hover:opacity-100"
                      style={{ borderColor: social.color }}
                      animate={{
                        scale: [1, 1.5],
                        opacity: [0.5, 0],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 1,
                      }}
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Floating elements around social icons */}
            <motion.div
              className="absolute -top-8 right-20 w-3 h-3 rounded-full"
              style={{ backgroundColor: "#FFD300" }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.div
              className="absolute -bottom-4 right-32 w-2 h-2 rounded-full"
              style={{ backgroundColor: "#FF4F81" }}
              animate={{
                y: [0, -8, 0],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
            />
          </Wrapper>
        </Container>
      </motion.div>

      {/* Bottom glow effect */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 blur-3xl"
        style={{ backgroundColor: "rgba(255, 79, 129, 0.1)" }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
      />
    </footer>
  )
}

export default Footer
