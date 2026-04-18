'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export function useRegisterForm() {
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
      if (response?.data?.token) {
        authService.saveToken(response.data.token);
        localStorage.setItem('quiz_username', response.data.username || username);
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    }
  };

  return {
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    username, setUsername,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    error,
    handleRegister,
  };
}
