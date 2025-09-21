"use client"

import { useRef, useState, type FormEvent, type MouseEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Sparkles, Star, CheckCircle, Mail, X } from "lucide-react"
import Link from "next/link"
import Container from "@/components/Container"
import { Input } from "./ui/Input"
import { getPlaneKeyframes } from "../lib/getPlaneKeyframes"
import { getTrailsKeyframes } from "../lib/getTrailsKeyframes"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import axios, { type AxiosError } from "axios"

const Waitlist = () => {
  const [input, setInput] = useState<string>("")
  const [active, setActive] = useState<boolean>(true)
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const { to, fromTo, set } = gsap

  const container = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline>()

  const toggleTimeline = (): void => {
    if (tl.current) {
      tl.current.reversed(!tl.current.reversed())
    }
  }

  useGSAP(
    () => {
      const boxes = gsap.utils.toArray(".box") as Element[]
      tl.current = gsap
        .timeline()
        .to(boxes[0], { x: 120, rotation: 360 })
        .to(boxes[1], { x: -120, rotation: -360 }, "<")
        .to(boxes[2], { y: -166 })
        .reverse()
    },
    { scope: container },
  )

  const handleSubmit = async (e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault()

    const email = input
    const button = buttonRef.current

    if (!email || !button) {
      return
    }

    if (!active) {
      setActive(true)
      // GSAP animation
      to(button, {
        keyframes: getPlaneKeyframes({ setState: setActive, setInputState: setInput }),
      })

      to(button, {
        keyframes: getTrailsKeyframes(button),
      })
    }

    try {
      const response = await axios.post("https://localhost:5000/api/subscribe", { email })
      setSuccessMessage(response.data.message || "Successfully subscribed!")
      setErrorMessage("")

      // Clear input after successful submission
      setTimeout(() => {
        setInput("")
      }, 1500)
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>
      setErrorMessage(axiosError.response?.data?.error || "Subscription failed")
      setSuccessMessage("")
    }
  }

  return (
    <div
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
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${15 + (i % 4) * 20}%`,
            left: `${10 + (i % 3) * 30}%`,
          }}
          animate={{
            y: [0, -50, 0],
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

      <Container className="relative z-[999999]">
        <motion.div
          className="flex items-center justify-center w-full"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between w-full px-6 md:px-10 rounded-2xl lg:rounded-3xl py-8 md:py-10 relative overflow-hidden"
            style={{
              backgroundColor: "rgba(253, 236, 239, 0.8)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(220, 198, 224, 0.3)",
              boxShadow: "0 20px 60px rgba(255, 79, 129, 0.15)",
            }}
            whileHover={{
              boxShadow: "0 25px 80px rgba(255, 79, 129, 0.25)",
            }}
            transition={{ duration: 0.3 }}
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

            {/* Floating accent elements */}
            <motion.div
              className="absolute top-4 right-4 w-3 h-3 rounded-full"
              style={{ backgroundColor: "#FFD300" }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.div
              className="absolute bottom-4 left-4 w-2 h-2 rounded-full"
              style={{ backgroundColor: "#FF4F81" }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
            />

            <div className="flex flex-col items-start gap-4 w-full relative z-10">
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <motion.div
                  className="p-1.5 rounded-full"
                  style={{ backgroundColor: "rgba(255, 79, 129, 0.2)" }}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <Mail className="w-4 h-4" style={{ color: "#FF4F81" }} />
                </motion.div>
                <motion.h4
                  className="text-xl md:text-2xl font-semibold"
                  style={{
                    background: "linear-gradient(135deg, #8A4D76 0%, #FF4F81 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Join our waitlist
                </motion.h4>
              </motion.div>

              <motion.p
                className="text-base"
                style={{ color: "#8A4D76" }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                Be up to date with everything about{" "}
                <motion.span
                  style={{ color: "#FF4F81", fontWeight: 600 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Aura
                </motion.span>
              </motion.p>
            </div>

            <motion.div
              className="flex flex-col items-start gap-2 md:min-w-80 mt-5 md:mt-0 w-full md:w-max relative z-10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <form
                ref={formRef}
                action="#"
                onSubmit={handleSubmit}
                className="newsletter-form animate-fade-in-3 flex flex-col md:flex-row items-center gap-2 w-full md:max-w-xs"
              >
                <div className="relative w-full">
                  <Input
                    required
                    type="email"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your email"
                    className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:border-primary duration-300 w-full pl-4 pr-10 py-2.5 rounded-lg"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.6)",
                      borderColor: input ? "rgba(255, 79, 129, 0.5)" : "rgba(220, 198, 224, 0.5)",
                      color: "#8A4D76",
                    }}
                  />
                  <AnimatePresence>
                    {input && (
                      <motion.button
                        type="button"
                        onClick={() => setInput("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="w-4 h-4" style={{ color: "#8A4D76" }} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  ref={buttonRef}
                  className={`${
                    active && "active"
                  } disabled:!bg-[#DCC6E0] disabled:grayscale-[65%] disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base px-6 py-2.5 rounded-lg relative overflow-hidden`}
                  disabled={!input}
                  type="submit"
                  onClick={handleSubmit}
                  style={{
                    backgroundColor: "#FF4F81",
                    color: "#FDECEF",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0"
                    style={{
                      background: "linear-gradient(135deg, #FFD300, #FF4F81)",
                    }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="default relative z-10">Subscribe</span>
                  <span className="success relative z-10">
                    <svg viewBox="0 0 16 16">
                      <polyline points="3.75 9 7 12 13 5"></polyline>
                    </svg>
                    Done
                  </span>
                  <svg className="trails" viewBox="0 0 33 64">
                    <path d="M26,4 C28, 13.3333333 29,22.6666667 29,32 C29,41.3333333 28,50.6666667 26,60"></path>
                    <path d="M6,4 C8,13.3333333 9,22.6666667 9,32 C9,41.3333333 8,50.6666667 6,60"></path>
                  </svg>
                  <div className="plane">
                    <div className="left"></div>
                    <div className="right"></div>
                  </div>
                </motion.button>
              </form>

              {/* Status messages */}
              <AnimatePresence>
                {successMessage && (
                  <motion.div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "#FF4F81" }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{successMessage}</span>
                  </motion.div>
                )}

                {errorMessage && (
                  <motion.div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "#FF4F81" }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <X className="w-4 h-4" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.p
                className="text-xs"
                style={{ color: "#8A4D76" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.7, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                whileHover={{ opacity: 1 }}
              >
                By subscribing you agree with our{" "}
                <motion.span whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                  <Link href="#" style={{ color: "#FF4F81", textDecoration: "underline" }}>
                    Privacy Policy
                  </Link>
                </motion.span>
              </motion.p>
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-xl"
              style={{ backgroundColor: "rgba(255, 79, 129, 0.3)" }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            />

            <motion.div
              className="absolute -top-10 -left-10 w-32 h-32 rounded-full opacity-20 blur-xl"
              style={{ backgroundColor: "rgba(255, 211, 0, 0.3)" }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
            />
          </motion.div>
        </motion.div>
      </Container>

      {/* Add custom CSS for the newsletter form animations */}
      <style jsx global>{`
        .newsletter-form button {
          --primary: #ff4f81;
          --primary-dark: #8a4d76;
          --primary-darkest: #8a4d76;
          --input-placeholder: #8a4d76;
          --input-text: #8a4d76;
          --border-default: #dcc6e0;
          --border-active: #ff4f81;
          --background: #fdecef;
          --button-text: #fdecef;
          --success: #ff4f81;
          --trails: rgba(255, 79, 129, 0.15);
        }

        .newsletter-form button {
          display: block;
          position: relative;
          border: 0;
          cursor: pointer;
          text-align: center;
          border-radius: 8px;
          background: var(--primary);
          color: var(--button-text);
          transition: background 0.4s;
        }

        .newsletter-form button .plane,
        .newsletter-form button .trails {
          pointer-events: none;
          position: absolute;
        }

        .newsletter-form button .plane {
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          transform: translate(-8px, 20px) scale(0.5);
          opacity: 0;
          color: var(--button-text);
        }

        .newsletter-form button .plane .right,
        .newsletter-form button .plane .left {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          opacity: 0.5;
          background: var(--button-text);
          clip-path: polygon(100% 0, 100% 100%, 0 100%);
        }

        .newsletter-form button .plane .right {
          clip-path: polygon(0 0, 100% 0, 0 100%);
          opacity: 0.6;
        }

        .newsletter-form button .trails {
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          stroke: var(--trails);
          stroke-width: 2;
          stroke-linecap: round;
          fill: none;
          transform: translate(8px, -14px) scaleX(0.8);
          opacity: 0;
        }

        .newsletter-form button .default,
        .newsletter-form button .success {
          display: block;
          transition: opacity 0.4s;
        }

        .newsletter-form button .success {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
        }

        .newsletter-form button .success svg {
          width: 12px;
          height: 12px;
          margin-right: 4px;
          fill: none;
          stroke-width: 2;
          stroke-dasharray: 16px;
          stroke-dashoffset: 16px;
          stroke: var(--button-text);
          transition: stroke-dashoffset 0.4s;
        }

        .newsletter-form button.active .default {
          opacity: 0;
        }

        .newsletter-form button.active .success {
          opacity: 1;
        }

        .newsletter-form button.active .success svg {
          stroke-dashoffset: 0;
        }

        .newsletter-form button:disabled {
          cursor: not-allowed;
        }

        .newsletter-form button:hover:not(:disabled) {
          background: var(--primary-dark);
        }
      `}</style>
    </div>
  )
}

export default Waitlist
