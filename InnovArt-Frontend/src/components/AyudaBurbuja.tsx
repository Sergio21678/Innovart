'use client'
import { FaComments } from 'react-icons/fa'

export default function AyudaBurbuja() {
  return (
    <a
      href="/contacto"
      className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-full shadow-lg transition-all duration-200 cursor-pointer"
      title="¿Necesitas ayuda? Contáctanos"
    >
      <span className="relative flex items-center">
        <FaComments size={22} className="animate-bounce-message" />
        {/* Burbuja animada detrás del icono */}
        <span className="absolute -top-2 -right-2 w-3 h-3 bg-green-400 rounded-full animate-ping-message"></span>
      </span>
      <span className="font-semibold hidden sm:inline">¿Necesitas ayuda? Contáctanos</span>
      <style jsx>{`
        .animate-bounce-message {
          animation: bounce-message 1.2s infinite;
        }
        @keyframes bounce-message {
          0%, 100% { transform: translateY(0);}
          20% { transform: translateY(-6px);}
          40% { transform: translateY(0);}
          60% { transform: translateY(-3px);}
          80% { transform: translateY(0);}
        }
        .animate-ping-message {
          animation: ping-message 1.2s infinite;
        }
        @keyframes ping-message {
          0% { transform: scale(1); opacity: 0.7;}
          70% { transform: scale(1.7); opacity: 0;}
          100% { transform: scale(2); opacity: 0;}
        }
      `}</style>
    </a>
  )
}
