'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { FaCog, FaEdit, FaKey, FaSignOutAlt, FaChartBar, FaShieldAlt } from 'react-icons/fa'
import { API_URL } from '@/services/api'

export default function PerfilAdmin() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('config')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      setUser(null)
      router.replace('/login')
      return
    }
    axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const role = res.data.role ?? res.data.rol
      if (role !== 'admin') {
        router.replace('/perfil')
        return
      }
      setUser(res.data)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
      setUser(null)
      router.replace('/login')
    })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.replace('/login')
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]">Cargando perfil...</div>
  if (!user) return null

  return (
    <div className="flex flex-col items-center py-8 bg-gradient-to-br from-white via-sky-100 to-blue-200 min-h-[60vh]">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Perfil de Administrador</h1>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center mb-6 w-full max-w-xl">
          <img src={user.foto_perfil || '/default-profile.png'} alt={user.nombre_completo} className="h-32 w-32 rounded-full object-cover border-4 border-blue-200 shadow-lg mb-2" />
          <h2 className="text-2xl font-bold text-blue-900 mb-1 flex items-center gap-2">
            {user.nombre_completo}
            <FaShieldAlt className="text-red-600" title="Administrador" />
          </h2>
          <div className="text-blue-700 mb-1">{user.correo}</div>
          <div className="text-blue-700 mb-1">{user.telefono || <span className="italic text-gray-400">Sin teléfono</span>}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <button className={`px-4 py-2 rounded-full font-semibold ${tab === 'config' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-900'}`} onClick={() => setTab('config')}>Configuración</button>
            <button className={`px-4 py-2 rounded-full font-semibold ${tab === 'admin' ? 'bg-red-700 text-white' : 'bg-blue-100 text-blue-900'}`} onClick={() => setTab('admin')}>Panel Admin</button>
          </div>
          {tab === 'config' && (
            <div>
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><FaCog /> Configuración</h3>
              <Link href="/perfil/editar" className="block mb-2 text-blue-700 underline flex items-center gap-2"><FaEdit /> Editar información</Link>
              <Link href="/recuperar-contrasena" className="block mb-2 text-blue-700 underline flex items-center gap-2"><FaKey /> Cambiar contraseña</Link>
              <button onClick={handleLogout} className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2"><FaSignOutAlt /> Cerrar sesión</button>
            </div>
          )}
          {tab === 'admin' && (
            <div>
              <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2"><FaChartBar /> Panel de Administración</h3>
              <Link href="/admin/dashboard" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2">
                <FaShieldAlt /> Ir al Panel de Administración
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
