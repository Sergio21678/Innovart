'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '@/services/api'

export default function NotificacionesPage() {
  const [notificaciones, setNotificaciones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
  }, [])

  useEffect(() => {
    const fetchNotificaciones = async () => {
      if (!user) return
      setLoading(true)
      const token = localStorage.getItem('token')
      // Mensajes recibidos
      const mensajesRes = await axios.get(`${API_URL}/mensajes?destinatarioId=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // Puedes agregar aquí otras notificaciones (pedidos, reseñas, etc.)
      const mensajes = mensajesRes.data.map((m: any) => ({
        tipo: 'mensaje',
        mensaje: `Nuevo mensaje de usuario #${m.remitenteId}: "${m.contenido}"`,
        leido: false,
        id: m.id,
        remitenteId: m.remitenteId
      }))
      // Ejemplo para reviews (opcional):
      // const reviewsRes = await axios.get('http://3.148.112.19:3001/api/reviews?artesanoId=' + user.id, {
      //   headers: { Authorization: `Bearer ${token}` }
      // })
      // const reviews = reviewsRes.data.map((r: any) => ({
      //   tipo: 'review',
      //   mensaje: `Nueva reseña de usuario #${r.clienteId}: "${r.comentario}"`,
      //   leido: false,
      //   id: r.id,
      //   clienteId: r.clienteId
      // }))
      // setNotificaciones([...mensajes, ...reviews])
      setNotificaciones(mensajes)
      setLoading(false)
    }
    if (user) fetchNotificaciones()
  }, [user])

  const marcarLeido = (id: number) => {
    setNotificaciones(notificaciones.map(n => n.id === id ? { ...n, leido: true } : n))
  }

  if (loading) return <div className="p-8">Cargando notificaciones...</div>

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Notificaciones</h2>
      {notificaciones.length === 0 ? (
        <div className="text-blue-700">No tienes notificaciones nuevas.</div>
      ) : (
        <div className="space-y-4">
          {notificaciones.map((n, idx) => (
            <div key={n.id} className={`p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform ${n.leido ? 'bg-gray-100' : 'bg-blue-50'} ${idx === 0 ? 'animate-fadeIn' : ''}`}>
              <div className={`flex justify-between items-center ${n.leido ? 'text-gray-500' : 'text-blue-900 font-semibold'}`}>
                <span>
                  {n.mensaje}
                  {n.tipo === 'mensaje' && (
                    <a
                      href={`/mensajes?destinatarioId=${n.remitenteId}`}
                      className="ml-2 text-blue-700 underline"
                    >
                      Ver chat
                    </a>
                  )}
                </span>
                {!n.leido && (
                  <button onClick={() => marcarLeido(n.id)} className="text-blue-600 hover:underline text-sm">Marcar como leído</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 text-blue-700">
        <b>¿Qué son?</b> Aquí verás avisos de mensajes, pedidos, reseñas y novedades importantes.
      </div>
    </div>
  )
}
