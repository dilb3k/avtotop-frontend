'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  IoCarSport, IoArrowBack, IoImage, IoCheckmarkCircle
} from 'react-icons/io5';

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const steps = [
    { id: 'basic', label: "Asosiy ma'lumotlar", icon: '1' },
    { id: 'specs', label: 'Texnik xususiyatlar', icon: '2' },
    { id: 'images', label: 'Rasmlar', icon: '3' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto flex gap-6 px-4 sm:px-6 lg:px-8 py-6">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 flex-shrink-0">
          <div className="sticky top-24 space-y-4">
            {/* Back button */}
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-xl hover:bg-white"
            >
              <IoArrowBack size={18} />
              <span className="text-sm font-medium">Bosh sahifa</span>
            </Link>

            {/* Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <IoCarSport className="text-primary-600" size={20} />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Yangi e'lon</h2>
                  <p className="text-xs text-gray-500">3 ta qadam</p>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-1">
                {steps.map((step, i) => (
                  <div key={step.id} className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-primary-50 text-primary-700">
                    <div className="w-7 h-7 bg-primary-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">
                      {step.icon}
                    </div>
                    <span className="text-sm font-medium">{step.label}</span>
                  </div>
                ))}
              </div>

              {/* Tips */}
              <div className="mt-5 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <h4 className="text-xs font-semibold text-amber-800 mb-2">Maslahatlar</h4>
                <ul className="text-xs text-amber-700 space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <IoCheckmarkCircle size={12} className="mt-0.5 flex-shrink-0" />
                    Rasm sifatli bo'lsin
                  </li>
                  <li className="flex items-start gap-1.5">
                    <IoCheckmarkCircle size={12} className="mt-0.5 flex-shrink-0" />
                    Narxni to'g'ri kiriting
                  </li>
                  <li className="flex items-start gap-1.5">
                    <IoCheckmarkCircle size={12} className="mt-0.5 flex-shrink-0" />
                    Tavsif batafsil bo'lsin
                  </li>
                </ul>
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tezkor havolalar</h4>
              <div className="space-y-1">
                <Link
                  href="/cars"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <IoCarSport size={16} />
                  Barcha e'lonlar
                </Link>
                {isAuthenticated && (
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    <IoImage size={16} />
                    Mening e'lonlarim
                  </Link>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Mobile header */}
          <div className="lg:hidden mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
            >
              <IoArrowBack size={16} />
              Orqaga
            </Link>
            <h1 className="text-xl font-bold text-gray-900 mt-2">Yangi e'lon qo'shish</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
