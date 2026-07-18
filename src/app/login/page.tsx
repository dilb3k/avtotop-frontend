'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { IoMail, IoLockClosed, IoCarSport } from 'react-icons/io5';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    setLoading(true);

    try {
      await signIn(email, password);
      toast.success('Muvaffaqiyatli kirildi!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

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
