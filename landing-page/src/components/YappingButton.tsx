'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Lock, CheckCircle, XCircle, AlertCircle, X, ArrowRightIcon } from 'lucide-react';
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
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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

const AuthPopup: React.FC<AuthPopupProps> = ({ 
  onSuccess, 
  onClose, 
  allowedEmails = [] 
}) => {
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

  return (
    <>
      {/*<div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full">*/}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="hidden sm:block"
            >
                <Button
                    size="sm"
                    onClick={() => setIsOpen(true)}
                    className="w-full relative overflow-hidden group"
                    style={{
                        backgroundColor: "#FF4F81",
                        color: "#FDECEF",
                        border: "none",
                    }}
                >
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
                </Button>
            </motion.div>
    {/*}    </div>
      </div>*/}

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
    </>
  );
};

export default AuthPopup;