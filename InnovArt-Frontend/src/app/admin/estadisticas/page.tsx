'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../../../services/api'

export default function AdminEstadisticasPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token')
      try {
        const res = await axios.get(`${API_URL}/admin/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setStats(res.data)
      } catch (error) {
        console.error('Error fetching admin stats:', error)
        setStats(null)
      }
      setLoading(false)
    }
    fetchStats()
  }, [])

  if (loading) return <div className="p-8">Cargando...</div>

  if (!stats) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Estadísticas de la Plataforma</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          <p>No se pudieron cargar las estadísticas. Por favor, verifica que tengas permisos de administrador.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Estadísticas de la Plataforma</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-900">{stats?.usuarios ?? 0}</span>
          <span className="text-blue-700">Usuarios registrados</span>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-900">{stats?.productos ?? 0}</span>
          <span className="text-blue-700">Productos publicados</span>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-900">{stats?.pedidos ?? 0}</span>
          <span className="text-blue-700">Pedidos completados</span>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-900">{stats?.mensajes ?? 0}</span>
          <span className="text-blue-700">Mensajes enviados</span>
        </div>
      </div>
      <div className="mt-8 text-blue-700">
        <b>Consejo:</b> Usa estos datos para tomar decisiones y mejorar la plataforma.
      </div>
    </div>
  )
}
