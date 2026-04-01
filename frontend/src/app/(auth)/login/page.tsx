'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="glass-panel w-full max-w-md p-10 rounded-xl shadow-2xl shadow-on-surface/5 border border-outline-variant/20">
      <div className="mb-10 text-center lg:text-left">
        <h2 className="font-display font-extrabold text-3xl text-on-surface mb-2">Welcome Back</h2>
        <p className="text-on-surface-variant font-medium">Please enter your credentials to continue</p>
      </div>
      
      <form className="space-y-6">

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
              className="w-full pl-12 pr-4 py-4 bg-surface-container-low border border-outline-variant/30 rounded-full text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary-container outline-none transition-all"
            />
          </div>
        </div>


        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="block text-sm font-semibold text-on-surface-variant" htmlFor="password">
              Password
            </label>
          </div>
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
              className="w-full pl-12 pr-12 py-4 bg-surface-container-low border border-outline-variant/30 rounded-full text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary-container outline-none transition-all"
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



        <button 
          type="submit" 
          className="w-full primary-gradient text-on-primary font-display font-bold py-4 rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex justify-center items-center space-x-2"
        >
          <span>Sign In</span>
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
            New to the platform? 
            <Link href="/register" className="text-primary font-bold hover:underline ml-1">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
