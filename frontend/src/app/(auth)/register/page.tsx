'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { authService } from '../../../services/authService';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    try {
      const response = await authService.register({ username, email, password });
      if (response && response.data && response.data.token) {
        authService.saveToken(response.data.token);
        router.push('/');
      } else {
        router.push('/login');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    }
  };

  return (
    <div className="glass-panel w-full max-w-md p-10 rounded-xl shadow-2xl shadow-on-surface/5 border border-outline-variant/20 max-h-[90vh] overflow-y-auto custom-scrollbar">
      <div className="mb-8 text-center lg:text-left">
        <h2 className="font-display font-extrabold text-3xl text-on-surface mb-2">Create Account</h2>
        <p className="text-on-surface-variant font-medium">Join us to start your scholarly journey</p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
          {error}
        </div>
      )}
      
      <form className="space-y-5" onSubmit={handleRegister}>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-on-surface-variant px-1" htmlFor="username">
            Username
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="text-outline w-5 h-5" />
            </div>
            <input 
              id="username" 
              name="username" 
              type="text" 
              placeholder="johndoe" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant/30 rounded-full text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary-container outline-none transition-all"
            />
          </div>
        </div>


        <div className="space-y-2">
          <label className="block text-sm font-semibold text-on-surface-variant px-1" htmlFor="email">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="text-outline w-5 h-5" />
            </div>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="name@university.edu" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant/30 rounded-full text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary-container outline-none transition-all"
            />
          </div>
        </div>


        <div className="space-y-2">
          <label className="block text-sm font-semibold text-on-surface-variant px-1" htmlFor="password">
            Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="text-outline w-5 h-5" />
            </div>
            <input 
              id="password" 
              name="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 bg-surface-container-low border border-outline-variant/30 rounded-full text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary-container outline-none transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="text-outline hover:text-primary transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>


        <div className="space-y-2">
          <label className="block text-sm font-semibold text-on-surface-variant px-1" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="text-outline w-5 h-5" />
            </div>
            <input 
              id="confirmPassword" 
              name="confirmPassword" 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="••••••••" 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 bg-surface-container-low border border-outline-variant/30 rounded-full text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary-container outline-none transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-outline hover:text-primary transition-colors focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Sign Up Button */}
        <button 
          type="submit" 
          className="w-full primary-gradient text-on-primary font-display font-bold py-4 rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex justify-center items-center space-x-2 mt-4"
        >
          <span>Sign Up</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      <div className="mt-8 flex flex-col items-center space-y-6">
        <div className="flex items-center w-full">
          <div className="flex-grow h-px bg-outline-variant/30"></div>
          <span className="px-4 text-xs font-bold uppercase tracking-widest text-outline">or</span>
          <div className="flex-grow h-px bg-outline-variant/30"></div>
        </div>
        
        <div className="text-center">
          <p className="text-on-surface-variant text-sm font-medium">
            Already have an account?  
            <Link href="/login" className="text-primary font-bold hover:underline ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
