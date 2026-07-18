'use client';

import Link from 'next/link';
import { IoCarSport, IoLogoGithub, IoSend } from 'react-icons/io5';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <IoCarSport className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-white">Avtotop</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Mashinalarni sotib olish va sotish uchun eng yaxshi platforma. 
              O'zbekistondagi eng katta avtomobil bozori.
            </p>
            <div className="flex gap-4">
              <a
                href="https://t.me/avtotop_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <IoSend size={20} />
              </a>
              <a
                href="https://github.com/dilb3k/avtotop"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <IoLogoGithub size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tezkor havolalar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cars" className="hover:text-white transition-colors">
                  Barcha e'lonlar
                </Link>
              </li>
              <li>
                <Link href="/create" className="hover:text-white transition-colors">
                  E'lon qo'shish
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Ro'yxatdan o'tish
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kategoriyalar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cars?category=1" className="hover:text-white transition-colors">
                  Sedan
                </Link>
              </li>
              <li>
                <Link href="/cars?category=2" className="hover:text-white transition-colors">
                  SUV / Jeep
                </Link>
              </li>
              <li>
                <Link href="/cars?category=3" className="hover:text-white transition-colors">
                  Hatchback
                </Link>
              </li>
              <li>
                <Link href="/cars?category=8" className="hover:text-white transition-colors">
                  Elektromobil
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Avtotop. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
}
