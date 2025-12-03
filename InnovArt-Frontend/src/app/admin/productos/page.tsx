'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '@/services/api'

export default function AdminProductosPage() {
  const [productos, setProductos] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState('')

  const fetchProductos = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${API_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProductos(res.data);
  }

  useEffect(() => { fetchProductos() }, [])

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Eliminar este producto?')) return
    const token = localStorage.getItem('token')
    await axios.delete(`${API_URL}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchProductos()
  }

  const filtrados = productos.filter(p =>
    p.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Gestión de Productos</h2>
      <input
        placeholder="Buscar por título o descripción"
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        className="border px-2 py-1 mb-4 w-full"
      />
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2">ID</th>
            <th className="p-2">Título</th>
            <th className="p-2">Descripción</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.id}</td>
              <td className="p-2">{p.titulo}</td>
              <td className="p-2">{p.descripcion}</td>
              <td className="p-2">${p.precio}</td>
              <td className="p-2">
                <button onClick={() => handleEliminar(p.id)} className="text-red-600 hover:underline">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 text-blue-700">
        <b>Nota:</b> Puedes eliminar productos que incumplan las normas o sean reportados.
      </div>
    </div>
  )
}
