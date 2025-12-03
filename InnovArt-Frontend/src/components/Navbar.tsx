'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaUserCircle, FaHome, FaBoxOpen, FaUserFriends, FaBell, FaShoppingCart, FaSignInAlt } from 'react-icons/fa'

type NavUser = { id?: number; email?: string; name?: string; role?: string }

const readUser = (): NavUser | null => {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('user')
  if (!stored) return null
  try { return JSON.parse(stored) } catch { return null }
}

const readToken = () => (typeof window === 'undefined' ? null : localStorage.getItem('token'))

export default function Navbar() {
  const [user, setUser] = useState<NavUser | null>(null)

  useEffect(() => {
    setUser(readUser())
    const token = readToken()
    if (token) {
      // asegura que axios use el token por defecto
      import('axios').then(ax => ax.default.defaults.headers.common['Authorization'] = `Bearer ${token}`)
    }
    const handler = () => {
      setUser(readUser())
      const t = readToken()
      if (t) import('axios').then(ax => ax.default.defaults.headers.common['Authorization'] = `Bearer ${t}`)
    }
    window.addEventListener('storage', handler)
    window.addEventListener('auth-changed', handler as EventListener)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('auth-changed', handler as EventListener)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    import('axios').then(ax => delete ax.default.defaults.headers.common['Authorization'])
    window.dispatchEvent(new Event('auth-changed'))
    window.location.href = '/login'
  }

  return (
    <nav className="w-full bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 shadow-lg flex items-center justify-between px-8 py-4 z-30 sticky top-0 left-0 animate-navbar-fade">
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2 text-white font-extrabold text-2xl drop-shadow hover:scale-105 transition-transform">
          <img src="/logo_innovart_white.png" alt="Logo InnovArt" className="h-10 w-auto drop-shadow" />
          InnovArt
        </Link>
        <div className="hidden md:flex gap-8 ml-8">
          <Link href="/" className="flex items-center gap-2 text-white font-semibold hover:text-blue-200 transition-colors">
            <FaHome /> Inicio
          </Link>
          <Link href="/artesanos" className="flex items-center gap-2 text-white font-semibold hover:text-blue-200 transition-colors">
            <FaUserFriends /> Artesanos
          </Link>
          <Link href="/productos" className="flex items-center gap-2 text-white font-semibold hover:text-blue-200 transition-colors">
            <FaBoxOpen /> Productos
          </Link>
          <Link href="/galeria" className="flex items-center gap-2 text-white font-semibold hover:text-blue-200 transition-colors">
            <FaBoxOpen /> Galeria
          </Link>
          <Link href="/notificaciones" className="flex items-center gap-2 text-white font-semibold hover:text-blue-200 transition-colors">
            <FaBell /> Notificaciones
          </Link>
          <Link href="/carrito" className="flex items-center gap-2 text-white font-semibold hover:text-blue-200 transition-colors">
            <FaShoppingCart /> Carrito
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Link href="/perfil" className="flex items-center gap-2 text-white font-semibold hover:text-blue-200 transition-colors">
          <FaUserCircle /> Perfil
        </Link>
        {user ? (
          <button onClick={handleLogout} className="flex items-center gap-2 text-white font-semibold hover:text-blue-200 transition-colors">
            <FaSignInAlt /> Cerrar sesion
          </button>
        ) : (
          <Link href="/login" className="flex items-center gap-2 text-white font-semibold hover:text-blue-200 transition-colors">
            <FaSignInAlt /> Ingresar
          </Link>
        )}
      </div>
      <style jsx>{`
        .animate-navbar-fade {
          animation: navbar-fade 1.2s;
        }
        @keyframes navbar-fade {
          from { opacity: 0; transform: translateY(-30px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </nav>
  )
}
