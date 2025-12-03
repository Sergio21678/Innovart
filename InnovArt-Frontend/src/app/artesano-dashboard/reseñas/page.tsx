'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../../../services/api'

export default function ReseñasArtesano() {
  const [resenas, setResenas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.get(`${API_URL}/reviews`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setResenas(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Mis Reseñas</h2>
      {loading ? (
        <div className="text-blue-700">Cargando...</div>
      ) : resenas.length === 0 ? (
        <div className="text-blue-700">No tienes reseñas aún.</div>
      ) : (
        <ul>
          {resenas.map(r => (
            <li key={r.id} className="mb-2">
              <b>{r.cliente_nombre || 'Cliente'}:</b> {r.comentario} ({r.calificacion} estrellas)
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
