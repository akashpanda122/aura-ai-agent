"use client"

import { ArrowRightIcon, Mail, Lock, CheckCircle, XCircle, AlertCircle, X, SparklesIcon, HeartIcon, PlayIcon } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import AuthPopup from "./YappingButton"
//import Video from "../../public/videos/aura_video.mp4"
import { 
  auth, 
  firestore, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection
} from '@/lib/firebase'; // You'll need to create this file

// Types
interface InviteData {
  email: string;
  used: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

interface AllowedEmailData {
  approved: boolean;
  createdAt: Date;
  role?: string;
}

interface User {
  email: string;
  uid: string;
}

type AuthStep = 'request' | 'verify' | 'login' | 'success';

interface AuthPopupProps {
  onSuccess?: (user: User) => void;
  onClose?: () => void;
  allowedEmails?: string[];
}

const Hero: React.FC<AuthPopupProps> = ({ 
  onSuccess, 
  onClose, 
  allowedEmails = [] 
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  {/*const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })*/}

  //const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  //const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [step, setStep] = useState<AuthStep>('request');
  const [email, setEmail] = useState<string>('');
  const [inviteCode, setInviteCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // Default allowed emails (can be overridden via props or fetched from Firestore)
  const defaultAllowedEmails: string[] = [
    'admin@example.com',
    'user@example.com',
    'beta@example.com'
  ];

  const currentAllowedEmails = allowedEmails.length > 0 ? allowedEmails : defaultAllowedEmails;

  const resetForm = (): void => {
    setEmail('');
    setInviteCode('');
    setPassword('');
    setError('');
    setMessage('');
    setLoading(false);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const generateInviteCode = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const checkEmailAuthorization = async (email: string): Promise<boolean> => {
    try {
      // Check local allowed list first
      if (currentAllowedEmails.includes(email)) {
        return true;
      }

      // Check Firestore for dynamic email approvals
      const emailDoc = await getDoc(doc(firestore, 'allowedEmails', email));
      return emailDoc.exists() && emailDoc.data()?.approved === true;
    } catch (error) {
      console.error('Error checking email authorization:', error);
      return false;
    }
  };

  const createInviteCode = async (email: string): Promise<string> => {
    try {
      const inviteCode = generateInviteCode();
      const inviteData: InviteData = {
        email,
        used: false,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      };

      await setDoc(doc(firestore, 'invites', inviteCode), inviteData);
      return inviteCode;
    } catch (error) {
      console.error('Error creating invite code:', error);
      throw new Error('Failed to create invite code');
    }
  };

  const handleRequestAccess = async (e?: React.MouseEvent | React.KeyboardEvent): Promise<void> => {
    if (e) e.preventDefault();
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const isAuthorized = await checkEmailAuthorization(email);
      
      if (!isAuthorized) {
        throw new Error('This email is not authorized for access. Please request an invitation from an administrator.');
      }

      // In a real implementation, you would send an email here
      // For demo purposes, we'll create and display the invite code
      const newInviteCode = await createInviteCode(email);
      
      setMessage(`Access request approved! Your invite code is: ${newInviteCode}`);
      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing your request');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e?: React.MouseEvent | React.KeyboardEvent): Promise<void> => {
    if (e) e.preventDefault();
    
    if (!inviteCode.trim()) {
      setError('Please enter your invite code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const inviteDoc = await getDoc(doc(firestore, 'invites', inviteCode));
      
      if (!inviteDoc.exists()) {
        throw new Error('Invalid invite code');
      }

      const inviteData = inviteDoc.data() as InviteData;
      
      if (inviteData.used) {
        throw new Error('This invite code has already been used');
      }

      if (inviteData.email !== email) {
        throw new Error('This invite code is not valid for your email address');
      }

      // Check if invite has expired
      if (inviteData.expiresAt && new Date() > inviteData.expiresAt.toDate()) {
        throw new Error('This invite code has expired');
      }

      setMessage('Invite code verified! Please create your password.');
      setStep('login');
    } catch (err: any) {
      setError(err.message || 'Failed to verify invite code');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e?: React.MouseEvent | React.KeyboardEvent): Promise<void> => {
    if (e) e.preventDefault();
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let userCredential;

      if (step === 'login' && inviteCode) {
        // New user - create account
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Mark invite as used
        await updateDoc(doc(firestore, 'invites', inviteCode), { 
          used: true,
          usedAt: new Date(),
          userId: userCredential.user.uid
        });
        
        // Add to allowed users
        const allowedEmailData: AllowedEmailData = {
          approved: true,
          createdAt: new Date(),
          role: 'user'
        };
        
        await setDoc(doc(firestore, 'allowedEmails', email), allowedEmailData);
      } else {
        // Existing user - sign in
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      const user: User = {
        email: userCredential.user.email!,
        uid: userCredential.user.uid
      };

      setStep('success');
      setMessage('Authentication successful! Welcome to the platform.');
      
      // Call success callback if provided
      if (onSuccess) {
        setTimeout(() => onSuccess(user), 1000);
      }
    } catch (err: any) {
      let errorMessage = 'Authentication failed';
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Invalid password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        default:
          errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (): void => {
    setIsOpen(false);
    setTimeout(() => {
      setStep('request');
      resetForm();
      if (onClose) onClose();
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void): void => {
    if (e.key === 'Enter' && !loading) {
      action();
    }
  };

  const togglePlayPause = () => {
    if(videoRef.current) {
      if(isPlaying){
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center text-center w-full max-w-6xl my-24 mx-auto z-40 overflow-hidden"
    >
      {/* Floating background elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-20 blur-xl"
        style={{ backgroundColor: "#DCC6E0" }}
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-40 right-16 w-16 h-16 rounded-full opacity-15 blur-lg"
        style={{ backgroundColor: "#FFECD2" }}
        animate={{
          y: [0, 40, 0],
          x: [0, -15, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="absolute bottom-20 left-1/4 w-12 h-12 rounded-full opacity-25"
        style={{ backgroundColor: "#FFD300" }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Animated particles */}
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: i % 2 === 0 ? "#FF4F81" : "#FFD300",
            top: `${20 + i * 15}%`,
            left: `${10 + i * 15}%`,
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

      <motion.div 
        //style={}
      >
        {/* Announcement Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="relative pl-2 pr-1 py-1 rounded-full border backdrop-blur-lg cursor-pointer flex items-center gap-2.5 select-none w-max mx-auto group overflow-hidden"
            style={{
              borderColor: "rgba(220, 198, 224, 0.3)",
              backgroundColor: "rgba(255, 236, 210, 0.2)",
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              style={{
                background: "linear-gradient(135deg, rgba(255, 211, 0, 0.1), rgba(255, 79, 129, 0.1))",
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Pulsing indicator */}
            <div className="relative w-3.5 h-3.5 rounded-full flex items-center justify-center">
              <motion.div
                className="absolute w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: "rgba(255, 79, 129, 0.4)" }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className="absolute w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: "rgba(255, 79, 129, 0.6)" }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
              />
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#FF4F81" }} />
            </div>

            <span
              className="relative z-10 inline-flex items-center justify-center gap-2 text-sm font-medium"
              style={{ color: "#8A4D76" }}
            >
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                style={{
                  background: "linear-gradient(90deg, #8A4D76, #FF4F81, #FFD300, #8A4D76)",
                  backgroundSize: "200% 100%",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Find Your Balance
              </motion.span>
              <motion.span
                className="text-xs px-1.5 py-0.5 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(255, 79, 129, 0.1)",
                  color: "#8A4D76",
                }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Start Free
                <motion.div whileHover={{ x: 2 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                  <ArrowRightIcon className="w-3.5 h-3.5 ml-1" style={{ color: "#FF4F81" }} />
                </motion.div>
              </motion.span>
            </span>
          </motion.div>
        </motion.div>

        {/* Main Heading - FIXED VERSION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-8"
        >
          <motion.h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="block"
              style={{
                background: "linear-gradient(135deg, #8A4D76 0%, #FF4F81 50%, #8A4D76 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Your Personalised
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="block relative"
            >
              {/* Fixed: Split the text and apply different styling */}
              <span style={{ color: "#8A4D76" }}>Therapist that </span>
              <motion.span
                className="relative inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.span
                  style={{
                    background: "linear-gradient(135deg, #FF4F81, #FFD300)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                >
                  truly cares
                </motion.span>
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <HeartIcon className="w-6 h-6" style={{ color: "#FF4F81" }} fill="currentColor" />
                </motion.div>
              </motion.span>
            </motion.span>
          </motion.h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p
            className="text-sm sm:text-base lg:text-lg mt-6 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#8A4D76" }}
          >
            Always-on support to live well,{" "}
            <motion.span
              className="hidden sm:inline relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <span style={{ color: "#FF4F81" }}>feel deeply</span>, and{" "}
              <span style={{ color: "#FFD300" }}>thrive fearlessly</span>.
              <motion.div
                className="absolute -top-1 -right-4"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <SparklesIcon className="w-4 h-4" style={{ color: "#FFD300" }} />
              </motion.div>
            </motion.span>
          </p>
        </motion.div>

        {/* CTA Button */}

        {/*<AuthPopup />*/}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="relative overflow-hidden group text-lg px-8 py-4 rounded-full"
              style={{
                backgroundColor: "#FF4F81",
                color: "#FDECEF",
                border: "none",
              }}
            >
              
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
                    className="ml-2 hidden lg:block"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <ArrowRightIcon className="w-5 h-5" />
                  </motion.div>
                </span>
              
            </Button>
          </motion.div>
        </motion.div>

        {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {step === 'request' && 'Request Access'}
                  {step === 'verify' && 'Verify Invite Code'}
                  {step === 'login' && 'Create Account'}
                  {step === 'success' && 'Welcome!'}
                </h2>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                  <XCircle size={20} className="flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {message && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                  <CheckCircle size={20} className="flex-shrink-0" />
                  <span className="text-sm">{message}</span>
                </div>
              )}

              {step === 'request' && (
                <div className="space-y-4">
                  <div>
                    <label 
                      htmlFor="email" 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        size={20} 
                      />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, handleRequestAccess)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Enter your email"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="text-amber-600 mt-0.5 flex-shrink-0" size={16} />
                    <p className="text-sm text-amber-700">
                      Access is restricted to invited users only. If you don't have an invitation, please contact an administrator.
                    </p>
                  </div>
                  <button
                    onClick={handleRequestAccess}
                    disabled={loading || !email.trim()}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {loading ? 'Checking...' : 'Request Access'}
                  </button>
                </div>
              )}

              {step === 'verify' && (
                <div className="space-y-4">
                  <div>
                    <label 
                      htmlFor="inviteCode" 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Invite Code
                    </label>
                    <div className="relative">
                      <Lock 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        size={20} 
                      />
                      <input
                        id="inviteCode"
                        type="text"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                        onKeyPress={(e) => handleKeyPress(e, handleVerifyCode)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono outline-none"
                        placeholder="Enter invite code"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('request')}
                      disabled={loading}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleVerifyCode}
                      disabled={loading || !inviteCode.trim()}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {loading ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                </div>
              )}

              {step === 'login' && (
                <div className="space-y-4">
                  <div>
                    <label 
                      htmlFor="password" 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Create Password
                    </label>
                    <div className="relative">
                      <Lock 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        size={20} 
                      />
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Create a secure password"
                        minLength={6}
                        disabled={loading}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 6 characters long
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">
                      Account will be created for: <span className="font-semibold">{email}</span>
                    </p>
                  </div>
                  <button
                    onClick={handleLogin}
                    disabled={loading || password.length < 6}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              )}

              {step === 'success' && (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="text-green-600" size={32} />
                  </div>
                  <p className="text-gray-600">
                    You now have access to the tool. Welcome aboard!
                  </p>
                  <button
                    onClick={handleClose}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Continue to Tool
                  </button>
                </div>
              )}

              {step !== 'success' && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Already have an account?{' '}
                    <button
                      onClick={() => {
                        setStep('login');
                        setInviteCode('');
                      }}
                      className="text-blue-600 hover:underline focus:outline-none focus:underline"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16"
        >
          <motion.div
            className="relative mx-auto max-w-5xl rounded-2xl lg:rounded-[32px] border p-3 backdrop-blur-lg md:p-4 overflow-hidden"
            style={{
              borderColor: "rgba(220, 198, 224, 0.3)",
              backgroundColor: "rgba(255, 236, 210, 0.1)",
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
                  "linear-gradient(135deg, rgba(255, 79, 129, 0.1), rgba(255, 211, 0, 0.1), rgba(220, 198, 224, 0.1))",
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

            <motion.div
              className="relative rounded-xl lg:rounded-[24px] border p-2 overflow-hidden"
              style={{
                borderColor: "rgba(138, 77, 118, 0.2)",
                backgroundColor: "rgba(253, 236, 239, 0.8)",
              }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
              >
                {/*<Image
                  src="/placeholder.svg?height=600&width=1000"
                  alt="Dashboard Preview"
                  width={1000}
                  height={600}
                  className="rounded-lg lg:rounded-[20px] w-full h-auto"
                />*/}
                <video 
                  ref={videoRef}
                  src="/videos/aura_video.mp4"
                  className="w-full h-full object-cover"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  loop
                  playsInline
                  // We make the video itself clickable to toggle play/pause
                  onClick={togglePlayPause}
                />
                {/* AnimatePresence allows the button to have an exit animation */}
                <AnimatePresence>
                  {!isPlaying && (
                    <motion.div
                      // This div is a clickable overlay that contains the button
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer"
                      onClick={togglePlayPause}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div 
                        className="flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm w-20 h-20 rounded-full hover:bg-opacity-30 transition-colors duration-300"
                      >
                        <PlayIcon className="w-10 h-10 text-white" fill="white" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Overlay elements */}
              <motion.div
                className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: "rgba(255, 79, 129, 0.9)",
                  color: "#FDECEF",
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.8 }}
              >
                Live Demo
              </motion.div>

              <motion.div
                className="absolute bottom-4 right-4 flex space-x-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: i === 0 ? "#FF4F81" : "rgba(138, 77, 118, 0.3)" }}
                    animate={{
                      scale: i === 0 ? [1, 1.2, 1] : 1,
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.5,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Hero
