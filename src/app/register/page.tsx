'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PhoneInput from '@/components/ui/PhoneInput';
import toast from 'react-hot-toast';
import { IoMail, IoLockClosed, IoPerson, IoCarSport } from 'react-icons/io5';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Parol kamida 6 ta belgi bo'lishi kerak");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Parollar mos kelmaydi");
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.fullName, formData.phone);
      toast.success("Muvaffaqiyatli ro'yxatdan o'tildi!");
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ro'yxatdan o'tish</h1>
          <p className="text-gray-600">
            Avtotop'ga xush kelibsiz
          </p>
        </div>

        {/* Form */}
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="To'liq ism *"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Ismingiz"
              leftIcon={<IoPerson size={18} />}
              required
            />

            <Input
              label="Email *"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              leftIcon={<IoMail size={18} />}
              required
            />

            <PhoneInput
              label="Telefon (ixtiyoriy)"
              name="phone"
              value={formData.phone}
              onChange={(val) => setFormData({ ...formData, phone: val })}
            />

            <Input
              label="Parol *"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Kamida 6 ta belgi"
              leftIcon={<IoLockClosed size={18} />}
              required
            />

            <Input
              label="Parolni tasdiqlang *"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Parolni qaytadan kiriting"
              leftIcon={<IoLockClosed size={18} />}
              required
            />

            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
            >
              Ro'yxatdan o'tish
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Hisobingiz bormi?{' '}
          <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Kiring
          </Link>
        </p>
      </div>
    </div>
  );
}
