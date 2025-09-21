"use client"

import { cn } from "@/lib/utils"
import { ArrowRightIcon, XIcon, MenuIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Logo from "../../public/logo.png"
import Image from 'next/image'
import AuthPopup from "./YappingButton"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [scrolled, setScrolled] = useState<boolean>(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const menuItems = [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <div className="relative w-full h-full">
      {/* Animated background blur */}
      <motion.div
        className="z-[99] fixed pointer-events-none inset-x-0 h-[88px] backdrop-blur-sm"
        style={{
          background: scrolled ? "rgba(253, 236, 239, 0.8)" : "rgba(253, 236, 239, 0.4)",
          maskImage: "linear-gradient(to bottom, #000 20%, transparent calc(100% - 20%))",
        }}
        animate={{
          opacity: scrolled ? 1 : 0.8,
        }}
        transition={{ duration: 0.3 }}
      />

      <motion.header
        className={cn(
          "fixed top-4 inset-x-0 mx-auto max-w-6xl px-2 md:px-12 z-[100] transition-all duration-500",
          isOpen ? "h-[calc(100%-24px)]" : "h-12",
        )}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="relative backdrop-blur-lg rounded-xl lg:rounded-2xl border px-2 md:px-4 flex items-center justify-start overflow-hidden"
          style={{
            backgroundColor: "rgba(253, 236, 239, 0.9)",
            borderColor: "rgba(220, 198, 224, 0.3)",
            boxShadow: "0 8px 32px rgba(255, 79, 129, 0.1)",
          }}
          animate={{
            boxShadow: scrolled ? "0 12px 40px rgba(255, 79, 129, 0.15)" : "0 8px 32px rgba(255, 79, 129, 0.1)",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: "linear-gradient(135deg, rgba(255, 236, 210, 0.3), rgba(220, 198, 224, 0.2))",
            }}
            animate={{
              background: [
                "linear-gradient(135deg, rgba(255, 236, 210, 0.3), rgba(220, 198, 224, 0.2))",
                "linear-gradient(135deg, rgba(220, 198, 224, 0.2), rgba(255, 236, 210, 0.3))",
                "linear-gradient(135deg, rgba(255, 236, 210, 0.3), rgba(220, 198, 224, 0.2))",
              ],
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />

          {/* Floating accent dots */}
          <motion.div
            className="absolute top-2 left-8 w-1 h-1 rounded-full"
            style={{ backgroundColor: "#FFD300" }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-2 right-12 w-0.5 h-0.5 rounded-full"
            style={{ backgroundColor: "#FF4F81" }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
          />

          <div className="flex items-center justify-between w-full relative z-10 mt-[7px] lg:mt-auto mb-auto">
            <div className="flex items-center flex-1 lg:flex-none pl-1">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link href="/" className="text-lg font-semibold" style={{ color: "#8A4D76" }}>
                  <motion.div
                    className="w-auto h-6 rounded-lg overflow-hidden"
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Replace with your logo */}
                    <Image
                      src={Logo} // import Logo from './path/to/your/logo.png'
                      alt="Company Logo"
                      className="h-full w-auto object-contain"
                      style={{ maxHeight: '24px' }} // Matches h-6 (24px)
                      width={100} // Add appropriate width
                      height={24} // Matches h-6
                    />
                  </motion.div>
                </Link>
              </motion.div>

              {/* Desktop Menu */}
              <div className="items-center hidden ml-6 lg:flex space-x-1">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 group"
                      style={{ color: "#8A4D76" }}
                    >
                      <motion.span
                        className="relative z-10"
                        whileHover={{ y: -1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        {item.label}
                      </motion.span>
                      <motion.div
                        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100"
                        style={{ backgroundColor: "rgba(255, 211, 0, 0.1)" }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="items-center flex gap-2 lg:gap-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  asChild
                  className="relative overflow-hidden group hover:translate-y-0 hover:scale-100"
                  style={{ color: "#8A4D76" }}
                >
                  <Link href="/">
                    <motion.span
                      className="relative z-10"
                      whileHover={{ y: -1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      Login
                    </motion.span>
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      style={{ backgroundColor: "rgba(220, 198, 224, 0.2)" }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                </Button>
              </motion.div>
              
              <AuthPopup />

              {/*<motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="hidden sm:block"
              >
                <Button
                  size="sm"
                  asChild
                  className="relative overflow-hidden group"
                  style={{
                    backgroundColor: "#FF4F81",
                    color: "#FDECEF",
                    border: "none",
                  }}
                >
                  <Link href="/">
                    <motion.div
                      className="flex items-center"
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <span className="relative z-10">Start Yapping</span>
                      <motion.div
                        className="ml-2 hidden lg:block"
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <ArrowRightIcon className="w-4 h-4" />
                      </motion.div>
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      style={{
                        background: "linear-gradient(135deg, #FFD300, #FF4F81)",
                      }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                </Button>
              </motion.div>*/}

              {/* Mobile Menu Button */}
              <motion.div
                className="lg:hidden"
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="p-2 w-8 h-8 relative overflow-hidden group"
                  style={{ color: "#8A4D76" }}
                >
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    {isOpen ? <XIcon className="w-4 h-4" /> : <MenuIcon className="w-3.5 h-3.5" />}
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 rounded-lg"
                    style={{ backgroundColor: "rgba(255, 211, 0, 0.1)" }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="lg:hidden absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden"
                style={{
                  backgroundColor: "rgba(253, 236, 239, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(220, 198, 224, 0.3)",
                }}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="p-4 space-y-2">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className="block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 group"
                        style={{ color: "#8A4D76" }}
                        onClick={() => setIsOpen(false)}
                      >
                        <motion.div
                          className="flex items-center justify-between"
                          whileHover={{ x: 4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <span>{item.label}</span>
                          <motion.div
                            whileHover={{ x: 2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          >
                            <ArrowRightIcon className="w-4 h-4 opacity-50" />
                          </motion.div>
                        </motion.div>
                        <motion.div
                          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100"
                          style={{ backgroundColor: "rgba(255, 236, 210, 0.3)" }}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        />
                      </Link>
                    </motion.div>
                  ))}

                  {/*<AuthPopup />*/}

                  <motion.div
                    className="pt-4 border-t"
                    style={{ borderColor: "rgba(220, 198, 224, 0.3)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Button
                        size="sm"
                        className="w-full relative overflow-hidden group"
                        style={{
                          backgroundColor: "#FF4F81",
                          color: "#FDECEF",
                          border: "none",
                        }}
                        asChild
                      >
                        <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                          <motion.div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100"
                            style={{
                              background: "linear-gradient(135deg, #FFD300, #FF4F81)",
                            }}
                            transition={{ duration: 0.3 }}
                          />
                          <span className="relative z-10 flex items-center justify-center">
                            Start Yapping
                            <ArrowRightIcon className="w-4 h-4 ml-2" />
                          </span>
                        </Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.header>
    </div>
  )
}

export default Navbar
