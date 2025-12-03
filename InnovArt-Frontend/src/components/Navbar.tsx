'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaUserCircle, FaHome, FaBoxOpen, FaUserFriends, FaBell, FaShoppingCart, FaSignInAlt, FaBars, FaTimes } from 'react-icons/fa'

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
  const [open, setOpen] = useState(false)

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
    <nav className="w-full bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 shadow-lg z-30 sticky top-0 left-0 animate-navbar-fade">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-white font-extrabold text-2xl drop-shadow hover:scale-105 transition-transform">
            <img src="/logo_innovart_white.png" alt="Logo InnovArt" className="h-10 w-auto drop-shadow" />
            InnovArt
          </Link>
        </div>
        <button
          className="md:hidden text-white text-2xl"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
        <div className="hidden md:flex items-center gap-8">
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
      </div>
      {open && (
        <div className="md:hidden bg-blue-800/95 text-white px-6 pb-4 space-y-4">
          <Link href="/" className="flex items-center gap-2 font-semibold hover:text-blue-200 transition-colors" onClick={() => setOpen(false)}>
            <FaHome /> Inicio
          </Link>
          <Link href="/artesanos" className="flex items-center gap-2 font-semibold hover:text-blue-200 transition-colors" onClick={() => setOpen(false)}>
            <FaUserFriends /> Artesanos
          </Link>
          <Link href="/productos" className="flex items-center gap-2 font-semibold hover:text-blue-200 transition-colors" onClick={() => setOpen(false)}>
            <FaBoxOpen /> Productos
          </Link>
          <Link href="/galeria" className="flex items-center gap-2 font-semibold hover:text-blue-200 transition-colors" onClick={() => setOpen(false)}>
            <FaBoxOpen /> Galeria
          </Link>
          <Link href="/notificaciones" className="flex items-center gap-2 font-semibold hover:text-blue-200 transition-colors" onClick={() => setOpen(false)}>
            <FaBell /> Notificaciones
          </Link>
          <Link href="/carrito" className="flex items-center gap-2 font-semibold hover:text-blue-200 transition-colors" onClick={() => setOpen(false)}>
            <FaShoppingCart /> Carrito
          </Link>
          <Link href="/perfil" className="flex items-center gap-2 font-semibold hover:text-blue-200 transition-colors" onClick={() => setOpen(false)}>
            <FaUserCircle /> Perfil
          </Link>
          {user ? (
            <button onClick={handleLogout} className="flex items-center gap-2 font-semibold hover:text-blue-200 transition-colors">
              <FaSignInAlt /> Cerrar sesion
            </button>
          ) : (
            <Link href="/login" className="flex items-center gap-2 font-semibold hover:text-blue-200 transition-colors" onClick={() => setOpen(false)}>
              <FaSignInAlt /> Ingresar
            </Link>
          )}
        </div>
      )}
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
