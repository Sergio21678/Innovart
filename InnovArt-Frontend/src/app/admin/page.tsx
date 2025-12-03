'use client'
import Link from 'next/link'

export default function AdminPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-900 mb-6">Panel de Administración</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
      <div className="mt-10">
        <h3 className="text-xl font-bold text-blue-900 mb-2">Resumen rápido</h3>
        <ul className="list-disc ml-6 text-blue-800">
          <li>Usuarios registrados: <b>120</b></li>
          <li>Productos publicados: <b>340</b></li>
          <li>Pedidos completados: <b>87</b></li>
          <li>Mensajes enviados: <b>450</b></li>
        </ul>
      </div>
    </div>
  )
}
