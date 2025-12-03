'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { API_URL } from '@/services/api'

export default function ArtesanoDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.get(`${API_URL}/artesano/summary`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setStats(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8">Cargando...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-900 mb-6">Panel de Artesano</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-900">{stats?.ventas ?? '...'}</span>
          <span className="text-blue-700">Ventas</span>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-900">{stats?.calificacion ?? '...'}</span>
          <span className="text-blue-700">Calificación</span>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-900">{stats?.mensajes ?? '...'}</span>
          <span className="text-blue-700">Mensajes</span>
        </div>
        <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center">
          <span className="text-3xl font-bold text-blue-900">{stats?.visitas ?? '...'}</span>
          <span className="text-blue-700">Visitas</span>
        </div>
      </div>
      <div className="flex gap-4 mt-8">
        <Link href="/artesano-dashboard/productos" className="bg-blue-700 text-white px-4 py-2 rounded font-semibold">Mis Productos</Link>
        <Link href="/artesano-dashboard/pedidos" className="bg-blue-700 text-white px-4 py-2 rounded font-semibold">Pedidos Recibidos</Link>
        <Link href="/artesano-dashboard/reviews" className="bg-blue-700 text-white px-4 py-2 rounded font-semibold">Mis Reseñas</Link>
        <Link href="/artesano-dashboard/chat" className="bg-blue-700 text-white px-4 py-2 rounded font-semibold">Chat</Link>
        <Link href="/artesano-dashboard/perfil" className="bg-blue-700 text-white px-4 py-2 rounded font-semibold">Mi Perfil</Link>
      </div>
    </div>
  )
}
