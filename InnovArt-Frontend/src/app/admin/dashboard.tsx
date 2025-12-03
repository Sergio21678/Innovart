'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { API_URL } from '@/services/api'

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const u = JSON.parse(stored)
      setUser(u)
      if (u.rol !== 'admin') {
        router.replace('/')
      }
    } else {
      router.replace('/login')
    }
  }, [router])

  useEffect(() => {
    const fetchSummary = async () => {
      const token = localStorage.getItem('token')
      try {
        const res = await axios.get(`${API_URL}/admin/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setSummary(res.data)
      } catch {
        setSummary(null)
      }
      setLoading(false)
    }
    fetchSummary()
  }, [])

  if (loading) {
    return <div className="p-8">Cargando...</div>
  }

  if (!user || user.rol !== 'admin') {
    return null
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-900 mb-6">Panel de Administración</h2>
      <div className="mb-8 text-blue-800">
        Bienvenido, <b>{user.nombre_completo}</b> (<span className="text-red-600">ADMIN</span>)
      </div>
      <nav className="mb-10">
        <ul className="flex flex-wrap gap-4">
          <li>
            <Link href="/admin/usuarios" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 font-semibold">Usuarios</Link>
          </li>
          <li>
            <Link href="/admin/productos" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 font-semibold">Productos</Link>
          </li>
          <li>
            <Link href="/admin/reportes" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 font-semibold">Reportes</Link>
          </li>
          <li>
            <Link href="/admin/estadisticas" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 font-semibold">Estadísticas</Link>
          </li>
        </ul>
      </nav>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Link href="/admin/usuarios" className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:bg-blue-50 transition">
          <span className="text-2xl font-bold text-blue-800 mb-2">Usuarios</span>
          <span className="text-blue-700">Gestiona usuarios, roles y permisos.</span>
        </Link>
        <Link href="/admin/productos" className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:bg-blue-50 transition">
          <span className="text-2xl font-bold text-blue-800 mb-2">Productos</span>
          <span className="text-blue-700">Aprueba, edita o elimina productos.</span>
        </Link>
        <Link href="/admin/reportes" className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:bg-blue-50 transition">
          <span className="text-2xl font-bold text-blue-800 mb-2">Reportes</span>
          <span className="text-blue-700">Revisa reportes y soporte.</span>
        </Link>
        <Link href="/admin/estadisticas" className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:bg-blue-50 transition">
          <span className="text-2xl font-bold text-blue-800 mb-2">Estadísticas</span>
          <span className="text-blue-700">Métricas de la plataforma.</span>
        </Link>
      </div>
      <div className="bg-blue-50 rounded-xl p-6 shadow">
        <h3 className="text-xl font-bold text-blue-900 mb-2">Resumen rápido</h3>
        <ul className="list-disc ml-6 text-blue-800">
          <li>Usuarios registrados: <b>{summary?.usuarios ?? '...'}</b></li>
          <li>Productos publicados: <b>{summary?.productos ?? '...'}</b></li>
          <li>Pedidos completados: <b>{summary?.pedidos ?? '...'}</b></li>
          <li>Mensajes enviados: <b>{summary?.mensajes ?? '...'}</b></li>
        </ul>
        <div className="mt-4 text-blue-700">
          <b>Acceso:</b> Solo el administrador puede ver y gestionar esta sección.<br />
          Usa el menú superior para navegar entre las funcionalidades de administración.
        </div>
      </div>
      <div className="mt-10 text-blue-800">
        <h4 className="font-bold mb-2">¿Qué puedes hacer aquí?</h4>
        <ul className="list-disc ml-6">
          <li>Ver, editar y eliminar usuarios, cambiar roles.</li>
          <li>Gestionar productos: aprobar, eliminar, destacar.</li>
          <li>Revisar y resolver reportes y solicitudes de soporte.</li>
          <li>Visualizar estadísticas clave de la plataforma.</li>
        </ul>
        <div className="mt-4">
          <b>Consejo:</b> Si necesitas ayuda, revisa la sección de soporte o contacta a otro administrador.
        </div>
      </div>
    </div>
  )
}
