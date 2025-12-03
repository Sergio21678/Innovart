'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '@/services/api'

export default function ChatArtesano() {
  const [mensajes, setMensajes] = useState<any[]>([])
  const [contenido, setContenido] = useState('')
  const [destinatarioId, setDestinatarioId] = useState('')

  const fetchMensajes = async () => {
    try {
      const res = await axios.get(`${API_URL}/mensajes`)
      // Mapear campos del backend
      const mensajesMapeados = res.data.map((m: any) => ({
        ...m,
        remitenteId: m.fromUserId || m.remitenteId,
        destinatarioId: m.toUserId || m.destinatarioId,
        contenido: m.content || m.contenido
      }))
      setMensajes(mensajesMapeados)
    } catch (err: any) {
      console.error('Error loading messages:', err)
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        console.error('Error de conexión. Verifica que el backend esté corriendo.')
      }
    }
  }

  const handleEnviar = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Debes iniciar sesión para enviar mensajes')
        return
      }
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (!user.id || !destinatarioId || !contenido) {
        alert('Completa todos los campos')
        return
      }
      await axios.post(`${API_URL}/mensajes`, {
        fromUserId: user.id,
        toUserId: parseInt(destinatarioId),
        content: contenido
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setContenido('')
      setDestinatarioId('')
      fetchMensajes()
    } catch (err: any) {
      console.error('Error sending message:', err)
      alert('Error al enviar mensaje. Verifica que el backend esté corriendo.')
    }
  }

  useEffect(() => { fetchMensajes() }, [])

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Chat con Clientes</h2>
      <div className="mb-4">
        <input placeholder="ID Cliente" value={destinatarioId} onChange={e => setDestinatarioId(e.target.value)} className="border px-2 py-1 mr-2" />
        <input placeholder="Mensaje" value={contenido} onChange={e => setContenido(e.target.value)} className="border px-2 py-1 mr-2" />
        <button onClick={handleEnviar} className="bg-blue-700 text-white px-4 py-1 rounded">Enviar</button>
      </div>
      <ul>
        {mensajes.map(m => (
          <li key={m.id} className="mb-2">
            <span className="font-semibold">{m.remitenteId}:</span> {m.contenido} <span className="text-blue-700">(Para {m.destinatarioId})</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
