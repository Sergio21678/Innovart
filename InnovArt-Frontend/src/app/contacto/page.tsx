'use client'
import Link from 'next/link'
import { FaFacebook, FaInstagram, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-100 to-blue-200">
      {/* Formulario de contacto */}
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="bg-white/95 rounded-2xl shadow-2xl p-10 max-w-xl w-full">
          <div className="flex flex-col items-center mb-6">
            <img src="/logo_innovart_white.png" alt="Logo InnovArt" className="h-16 mb-2 drop-shadow" />
            <h2 className="text-3xl font-bold text-blue-900 mb-2">Contáctanos</h2>
            <p className="text-blue-800 text-center mb-2">
              ¿Tienes dudas, sugerencias o quieres unirte a la red? Escríbenos y te responderemos lo antes posible.
            </p>
          </div>
          <form className="flex flex-col gap-4">
            <input type="text" placeholder="Nombre" className="border rounded px-3 py-2 focus:outline-blue-400" />
            <input type="email" placeholder="Correo electrónico" className="border rounded px-3 py-2 focus:outline-blue-400" />
            <textarea placeholder="Mensaje" className="border rounded px-3 py-2 focus:outline-blue-400" rows={5}></textarea>
            <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-full shadow transition">Enviar mensaje</button>
          </form>
          <div className="mt-8 text-blue-700 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <FaEnvelope /> <span>Email: <a href="mailto:contacto@innovart.com" className="underline">contacto@innovart.com</a></span>
            </div>
            <div className="flex items-center gap-2">
              <FaPhone /> <span>Teléfono: <a href="tel:+51987654321" className="underline">+51 987 654 321</a></span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt /> <span>Perú, Lima</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
