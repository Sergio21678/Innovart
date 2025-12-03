'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '@/services/api'

export default function PerfilArtesano() {
  const [user, setUser] = useState<any>(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data))
  }, [])

  const handleChange = (e: any) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    const token = localStorage.getItem('token')
    await axios.put(`${API_URL}/users/${user.id}`, user, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setMsg('Perfil actualizado correctamente')
    localStorage.setItem('user', JSON.stringify(user))
  }

  if (!user) return <div className="p-8">Cargando...</div>

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Mi Perfil de Artesano</h2>
      <div className="flex flex-col gap-3">
        <input name="nombre_completo" value={user.nombre_completo || ''} onChange={handleChange} placeholder="Nombre completo" className="border px-2 py-1" />
        <input name="ciudad" value={user.ciudad || ''} onChange={handleChange} placeholder="Ciudad" className="border px-2 py-1" />
        <input name="pais" value={user.pais || ''} onChange={handleChange} placeholder="País" className="border px-2 py-1" />
        <textarea name="descripcion" value={user.descripcion || ''} onChange={handleChange} placeholder="Descripción" className="border px-2 py-1" />
        <input name="especialidades" value={user.especialidades || ''} onChange={handleChange} placeholder="Especialidades (separadas por coma)" className="border px-2 py-1" />
        <button onClick={handleSave} className="bg-blue-700 text-white px-4 py-2 rounded">Guardar cambios</button>
        {msg && <div className="text-green-700 mt-2">{msg}</div>}
      </div>
    </div>
  )
}
