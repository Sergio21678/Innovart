'use client'
import { useState } from 'react'

export default function AdminReportesPage() {
  // Simulación de reportes recibidos
  const [reportes, setReportes] = useState([
    { id: 1, tipo: 'problema', mensaje: 'No puedo acceder a mi cuenta', usuario: 'juan@mail.com', estado: 'pendiente' },
    { id: 2, tipo: 'reporte', mensaje: 'Producto inapropiado', usuario: 'ana@mail.com', estado: 'resuelto' }
  ])

  const marcarResuelto = (id: number) => {
    setReportes(reportes.map(r => r.id === id ? { ...r, estado: 'resuelto' } : r))
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Reportes y Soporte</h2>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2">ID</th>
            <th className="p-2">Usuario</th>
            <th className="p-2">Tipo</th>
            <th className="p-2">Mensaje</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map(r => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.id}</td>
              <td className="p-2">{r.usuario}</td>
              <td className="p-2">{r.tipo}</td>
              <td className="p-2">{r.mensaje}</td>
              <td className="p-2">{r.estado}</td>
              <td className="p-2">
                {r.estado === 'pendiente' && (
                  <button onClick={() => marcarResuelto(r.id)} className="text-green-700 hover:underline">Marcar resuelto</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 text-blue-700">
        <b>Nota:</b> Aquí puedes gestionar los reportes y dar seguimiento a los usuarios.
      </div>
    </div>
  )
}
