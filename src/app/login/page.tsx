'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { useTelegramWebApp } from '@/components/TelegramWebAppProvider';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { IoMail, IoLockClosed, IoCarSport } from 'react-icons/io5';
import { FiSend } from 'react-icons/fi';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { webApp, isReady, user: tgUser } = useTelegramWebApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams?.get('chat_id');
  const [showTgLogin, setShowTgLogin] = useState(false);

  useEffect(() => {
    if (isReady && tgUser && webApp) {
      // Auto-login via Mini App
      handleTelegramLogin();
    }
  }, [isReady, tgUser, webApp]);

  const handleTelegramLogin = async () => {
    if (!webApp?.initData) return;
    
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://avtotop-backend.onrender.com/api';
      const response = await fetch(`${API_URL}/auth/mini-app-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData: webApp.initData }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Telegram login failed');
      }
      
      localStorage.setItem('auth_token', data.session?.access_token);
      toast.success('Telegram orqali muvaffaqiyatli kirildi!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Telegram login xatoligi');
      setShowTgLogin(true);
    } finally {
      setLoading(false);
    }
  };

  const notifyBot = async (fullName: string, userEmail: string) => {
    if (!chatId) return;
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://avtotop-backend.onrender.com/api';
      await fetch(`${API_URL}/auth/notify-bot-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, full_name: fullName, email: userEmail }),
      });
    } catch (err) {
      console.error('Bot notify error:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    setLoading(true);

    try {
      const data = await signIn(email, password);
      toast.success('Muvaffaqiyatli kirildi!');
      if (chatId && data?.profile) {
        await notifyBot(data.profile.full_name || '', email);
        toast.success('Botga xabar yuborildi!');
      }
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 page-transition">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 page-transition">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
            <IoCarSport className="text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tizimga kirish</h1>
          <p className="text-gray-600">
            Avtotop'ga xush kelibsiz
          </p>
        </div>

        {/* Telegram Login Button */}
        {showTgLogin && tgUser && webApp && (
          <div className="mb-6">
            <Button
              onClick={handleTelegramLogin}
              loading={loading}
              fullWidth
              size="lg"
              variant="secondary"
              leftIcon={<FiSend size={20} />}
            >
              Telegram orqali kirish
            </Button>
          </div>
        )}

        {/* Form */}
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              leftIcon={<IoMail size={18} />}
              required
            />

            <Input
              label="Parol"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<IoLockClosed size={18} />}
              required
            />

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
            >
              Kirish
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Hisobingiz yo'qmi?{' '}
          <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Ro'yxatdan o'ting
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 page-transition">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Yuklanmoqda...</span>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
