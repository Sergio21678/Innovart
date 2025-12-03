'use client'

import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'

export default function Header() {
  return (
    <header className="w-full flex justify-between items-center px-8 py-4 bg-sky-400 border-b border-gray-700 z-20">
      <span className="text-white text-2xl font-bold drop-shadow">InnovArt</span>
      <div className="flex gap-6">
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 hover:text-blue-500 transition"
          aria-label="Facebook"
        >
          <FaFacebook size={28} />
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-600 hover:text-pink-400 transition"
          aria-label="Instagram"
        >
          <FaInstagram size={28} />
        </a>
        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-500 hover:text-green-400 transition"
          aria-label="Whatsapp"
        >
          <FaWhatsapp size={28} />
        </a>
      </div>
    </header>
  )
}
