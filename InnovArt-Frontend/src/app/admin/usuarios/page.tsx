'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '@/services/api'

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState('')

  const fetchUsuarios = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsuarios(res.data);
  }

  useEffect(() => { fetchUsuarios() }, [])

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Eliminar este usuario?')) return
    const token = localStorage.getItem('token')
    await axios.delete(`${API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchUsuarios()
  }

  const handleRol = async (id: number, rol: string) => {
    const token = localStorage.getItem('token')
    // Busca el usuario actual
    const usuario = usuarios.find(u => u.id === id)
    if (!usuario) return
    try {
      await axios.put(`${API_URL}/users/${id}`, { ...usuario, rol }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchUsuarios()
    } catch (err) {
      alert('Error al cambiar el rol')
    }
  }

  const filtrados = usuarios.filter(u =>
    u.nombre_completo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.correo?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Gestión de Usuarios</h2>
      <input
        placeholder="Buscar por nombre o correo"
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        className="border px-2 py-1 mb-4 w-full"
      />
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Correo</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map(u => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.nombre_completo}</td>
              <td className="p-2">{u.correo}</td>
              <td className="p-2">
                <select value={u.rol} onChange={e => handleRol(u.id, e.target.value)} className="border px-1 py-0.5">
                  <option value="cliente">Cliente</option>
                  <option value="artesano">Artesano</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="p-2">
                <button onClick={() => handleEliminar(u.id)} className="text-red-600 hover:underline">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 text-blue-700">
        <b>Nota:</b> Puedes cambiar el rol de los usuarios o eliminarlos. Los cambios son inmediatos.
      </div>
    </div>
  )
}
