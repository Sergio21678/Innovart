'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../../../services/api'
import Link from 'next/link'

type Summary = {
  totalUsuarios: number
  totalArtesanos: number
  totalProductos: number
  totalPedidos: number
  totalReseñas: number
  totalMensajes?: number
  reportesPendientes: number
  usuariosRecientes: any[]
  productosRecientes: any[]
  pedidosRecientes: any[]
  reportesRecientes: any[]
  graficoUsuarios: { fecha: string, cantidad: number }[]
  graficoRoles: { rol: string, cantidad: number }[]
  graficoCategorias: { categoria: string, cantidad: number }[]
  graficoPedidos: { estado: string, cantidad: number }[]
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    axios.get(`${API_URL}/admin/summary`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setSummary(res.data))
      .catch(() => setError('Error al cargar el dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 text-blue-700">Cargando dashboard...</div>
  if (error) return <div className="p-8 text-red-700">{error}</div>
  if (!summary) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-100 to-blue-200 p-6">
      <h1 className="text-3xl font-extrabold text-blue-900 mb-6">Panel de Administración</h1>
      {/* Métricas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <MetricCard label="Usuarios" value={summary.totalUsuarios} color="blue" />
        <MetricCard label="Artesanos" value={summary.totalArtesanos} color="green" />
        <MetricCard label="Productos" value={summary.totalProductos} color="yellow" />
        <MetricCard label="Pedidos" value={summary.totalPedidos} color="pink" />
        <MetricCard label="Reseñas" value={summary.totalReseñas} color="purple" />
        <MetricCard label="Reportes pendientes" value={summary.reportesPendientes} color="red" />
        {summary.totalMensajes !== undefined && (
          <MetricCard label="Mensajes" value={summary.totalMensajes} color="gray" />
        )}
      </div>
      {/* Gráficas y estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <ChartUsuarios data={summary.graficoUsuarios} />
        <ChartRoles data={summary.graficoRoles} />
        <ChartCategorias data={summary.graficoCategorias} />
        <ChartPedidos data={summary.graficoPedidos} />
      </div>
      {/* Últimos movimientos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <RecentTable title="Últimos usuarios registrados" data={summary.usuariosRecientes} columns={['id', 'nombre_completo', 'correo', 'rol', 'fecha_registro']} />
        <RecentTable title="Últimos productos publicados" data={summary.productosRecientes} columns={['id', 'titulo', 'categoria', 'usuarioId', 'fecha_publicacion']} />
        <RecentTable title="Últimos pedidos" data={summary.pedidosRecientes} columns={['id', 'productoId', 'clienteId', 'estado', 'fecha']} />
        <RecentTable title="Reportes recientes" data={summary.reportesRecientes} columns={['id', 'tipo', 'estado', 'fecha']} />
      </div>
      {/* Accesos rápidos */}
      <div className="flex flex-wrap gap-4 mt-8">
        <Link href="/admin/categorias" className="bg-blue-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-800 transition">Crear categoría</Link>
        <Link href="/admin/usuarios" className="bg-green-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-800 transition">Gestionar usuarios</Link>
        <Link href="/admin/reportes" className="bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition">Gestionar reportes</Link>
        <Link href="/admin/productos" className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-yellow-700 transition">Gestionar productos</Link>
        <Link href="/admin/pedidos" className="bg-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-700 transition">Gestionar pedidos</Link>
        <Link href="/admin/resenas" className="bg-purple-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-800 transition">Gestionar reseñas</Link>
        <Link href="/admin/notificaciones" className="bg-gray-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition">Notificaciones globales</Link>
        <Link href="/admin/destacados" className="bg-blue-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-950 transition">Artesanos destacados</Link>
      </div>
    </div>
  )
}

// Tarjeta de métrica rápida
function MetricCard({ label, value, color }: { label: string, value: number, color: string }) {
  const colorMap: any = {
    blue: 'bg-blue-100 text-blue-900',
    green: 'bg-green-100 text-green-900',
    yellow: 'bg-yellow-100 text-yellow-900',
    pink: 'bg-pink-100 text-pink-900',
    purple: 'bg-purple-100 text-purple-900',
    red: 'bg-red-100 text-red-900',
    gray: 'bg-gray-100 text-gray-900',
    default: 'bg-gray-100 text-gray-900'
  }
  return (
    <div className={`rounded-xl shadow p-6 flex flex-col items-center font-bold text-2xl ${colorMap[color] || colorMap.default}`}>
      <span className="text-base font-medium mb-2">{label}</span>
      <span className="text-4xl">{value}</span>
    </div>
  )
}

// Tabla de últimos movimientos
function RecentTable({ title, data, columns }: { title: string, data: any[], columns: string[] }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-bold text-blue-900 mb-2">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col} className="px-2 py-1 text-left font-semibold">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? data.map((row, i) => (
              <tr key={i} className="border-b last:border-b-0">
                {columns.map(col => (
                  <td key={col} className="px-2 py-1">{row[col]}</td>
                ))}
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-blue-700">Sin datos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Gráficas simples (puedes mejorar con chart.js o recharts)
function ChartUsuarios({ data }: { data: any[] }) {
  // data: [{ fecha, cantidad }]
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-bold text-blue-900 mb-2">Crecimiento de usuarios</h3>
      <div className="flex items-end gap-1 h-32">
        {data.map((d, i) => (
          <div key={i} className="bg-blue-400" style={{ height: `${d.cantidad * 2}px`, width: '16px' }} title={d.fecha + ': ' + d.cantidad}></div>
        ))}
      </div>
      <div className="flex justify-between text-xs mt-2">
        {data.map((d, i) => (
          <span key={i}>{d.fecha.slice(5)}</span>
        ))}
      </div>
    </div>
  )
}
function ChartRoles({ data }: { data: any[] }) {
  // data: [{ rol, cantidad }]
  const total = data.reduce((sum, d) => sum + d.cantidad, 0)
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-bold text-blue-900 mb-2">Distribución por rol</h3>
      <div className="flex gap-2 items-end h-24">
        {data.map((d, i) => (
          <div key={i} className="bg-green-400" style={{ height: `${(d.cantidad / total) * 80 + 10}px`, width: '32px' }} title={d.rol + ': ' + d.cantidad}></div>
        ))}
      </div>
      <div className="flex justify-between text-xs mt-2">
        {data.map((d, i) => (
          <span key={i}>{d.rol}</span>
        ))}
      </div>
    </div>
  )
}
function ChartCategorias({ data }: { data: any[] }) {
  // data: [{ categoria, cantidad }]
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-bold text-blue-900 mb-2">Productos por categoría</h3>
      <div className="flex gap-2 items-end h-24">
        {data.map((d, i) => (
          <div key={i} className="bg-yellow-400" style={{ height: `${d.cantidad * 8 + 10}px`, width: '32px' }} title={d.categoria + ': ' + d.cantidad}></div>
        ))}
      </div>
      <div className="flex justify-between text-xs mt-2">
        {data.map((d, i) => (
          <span key={i}>{d.categoria}</span>
        ))}
      </div>
    </div>
  )
}
function ChartPedidos({ data }: { data: any[] }) {
  // data: [{ estado, cantidad }]
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-bold text-blue-900 mb-2">Pedidos por estado</h3>
      <div className="flex gap-2 items-end h-24">
        {data.map((d, i) => (
          <div key={i} className="bg-pink-400" style={{ height: `${d.cantidad * 10 + 10}px`, width: '32px' }} title={d.estado + ': ' + d.cantidad}></div>
        ))}
      </div>
      <div className="flex justify-between text-xs mt-2">
        {data.map((d, i) => (
          <span key={i}>{d.estado}</span>
        ))}
      </div>
    </div>
  )
}
