'use client'
import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaUserPlus, FaCheckCircle } from 'react-icons/fa'
import { API_URL } from '@/services/api'

const ROLES = [
  { value: 'cliente', label: 'Cliente' },
  { value: 'artesano', label: 'Artesano' }
]

export default function Usuarios() {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    password: '',
    confirmar: '',
    rol: 'cliente'
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    try {
      await axios.post(`${API_URL}/auth/register`, {
        name: form.nombre,
        email: form.correo,
        password: form.password,
        role: form.rol
      })
      setSuccess('Registro exitoso. Ahora puedes iniciar sesión.')
      setForm({ nombre: '', correo: '', password: '', confirmar: '', rol: 'cliente' })
      setTimeout(() => router.push('/login'), 1200)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrar usuario')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-sky-100 to-blue-200 py-10">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center border border-blue-100">
          <img src="/logo_innovart_white.png" alt="Logo InnovArt" className="h-16 mb-4 drop-shadow" />
          <h2 className="text-3xl font-extrabold text-blue-900 mb-2 flex items-center gap-2">
            <FaUserPlus className="text-blue-700" /> Crear cuenta InnovArt
          </h2>
          <p className="text-blue-700 mb-6 text-center text-base">
            Únete gratis y accede a productos únicos. Si eres artesano, selecciona ese rol para publicar tus productos.
          </p>
          <form className="flex flex-col gap-3 w-full" onSubmit={handleSubmit} autoComplete="off">
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre completo *" className="border px-3 py-2 rounded focus:outline-blue-400" required />
            <input name="correo" type="email" value={form.correo} onChange={handleChange} placeholder="Correo electrónico *" className="border px-3 py-2 rounded focus:outline-blue-400" required />
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Contraseña *" className="border px-3 py-2 rounded focus:outline-blue-400" required minLength={6} />
            <input name="confirmar" type="password" value={form.confirmar} onChange={handleChange} placeholder="Confirmar contraseña *" className="border px-3 py-2 rounded focus:outline-blue-400" required minLength={6} />
            <select name="rol" value={form.rol} onChange={handleChange} className="border px-3 py-2 rounded focus:outline-blue-400" required>
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-full shadow transition mt-2 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded border border-red-300 mt-4 w-full text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded border border-green-300 mt-4 w-full text-center flex items-center justify-center gap-2">
              <FaCheckCircle className="text-green-600" /> {success}
            </div>
          )}
          <div className="mt-6 text-blue-700 text-sm text-center">
            ¿Ya tienes cuenta? <Link href="/login" className="underline text-blue-900 font-semibold">Inicia sesión aquí</Link>
          </div>
        </div>
        <div className="mt-8 bg-white/80 rounded-xl shadow p-6 text-blue-900 text-base">
          <h3 className="font-bold text-lg mb-2">Beneficios</h3>
          <ul className="list-disc ml-6">
            <li>Compra productos únicos y apoya a artesanos locales.</li>
            <li>Publica tus productos si eres artesano.</li>
            <li>Contacta directamente con los mejores artesanos.</li>
          </ul>
        </div>
      </div>
      <style jsx>{`
        input:focus, textarea:focus, select:focus {
          outline: 2px solid #2563eb;
          box-shadow: 0 0 0 2px #93c5fd;
        }
      `}</style>
    </div>
  )
}
