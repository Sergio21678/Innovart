'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaSignInAlt } from 'react-icons/fa'
import { API_URL } from '@/services/api'

const normalizeUser = (u: any) => ({
  id: u?.id ?? u?.Id,
  email: u?.email ?? u?.Email,
  name: u?.name ?? u?.Name,
  role: u?.role ?? u?.Role
})

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && localStorage.getItem('user')) {
      // set axios default header si ya hay sesión
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      router.push('/')
    }
  }, [router])

  const handleLogin = async (e?: any) => {
    if (e) e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password })
      if (res.data.token) {
        const user = normalizeUser(res.data.user || {})
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(user))
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
        window.dispatchEvent(new Event('auth-changed'))
        setLoading(false)
        // Forzamos navegación dura para refrescar navbar y estado
        window.location.href = '/'
      } else {
        setError('No se recibio un token valido del servidor')
        setLoading(false)
      }
    } catch (err: any) {
      console.error('Login error:', err)
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        setError('Error de conexion. Verifica que el backend este corriendo en http://localhost:5000')
      } else {
        setError(err.response?.data?.error || err.response?.data?.mensaje || 'Error de login. Verifica tus credenciales.')
      }
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-sky-100 to-blue-200 py-10">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center border border-blue-100">
          <img src="/logo_innovart_white.png" alt="Logo InnovArt" className="h-16 mb-4 drop-shadow" />
          <h2 className="text-3xl font-extrabold text-blue-900 mb-2 flex items-center gap-2">
            <FaSignInAlt className="text-blue-700" /> Iniciar Sesion
          </h2>
          <p className="text-blue-700 mb-6 text-center text-base">
            Ingresa con tu correo y contraseña para acceder a tu cuenta.
          </p>
          <form className="flex flex-col gap-3 w-full" onSubmit={handleLogin} autoComplete="off">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Correo electronico"
              className="border px-3 py-2 rounded focus:outline-blue-400"
              required
              autoFocus
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="border px-3 py-2 rounded focus:outline-blue-400"
              required
              minLength={6}
            />
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-full shadow transition mt-2 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : <>Ingresar <FaSignInAlt /></>}
            </button>
          </form>
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded border border-red-300 mt-4 w-full text-center">
              {error}
            </div>
          )}
          <div className="mt-6 text-blue-700 text-sm text-center">
            ¿No tienes cuenta? <Link href="/usuarios" className="underline text-blue-900 font-semibold">Registrate aqui</Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        input:focus {
          outline: 2px solid #2563eb;
          box-shadow: 0 0 0 2px #93c5fd;
        }
      `}</style>
    </div>
  )
}
