'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const success = await login(password);
      if (success) {
        router.push('/admin/dashboard');
      } else {
        setError('Invalid password');
        setPassword('');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2c2420] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#a67b5b] rounded-full mb-6">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-serif text-white mb-2">Admin Panel</h1>
          <p className="text-white/60 text-sm">THE ELEPHANT PRODUCTION</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-lg">
          <div className="mb-6">
            <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded focus:outline-none focus:border-[#a67b5b] transition-colors"
              placeholder="Enter admin password"
              autoComplete="current-password"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#a67b5b] hover:bg-[#946b4d] disabled:bg-[#a67b5b]/50 disabled:cursor-not-allowed text-white font-medium py-3 rounded transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-white/40 text-xs text-center mt-6">
            Default password: elephant2024
          </p>
        </form>
      </div>
    </div>
  );
}
