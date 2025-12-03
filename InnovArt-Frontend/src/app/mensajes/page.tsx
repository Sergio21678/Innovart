'use client'
import { useEffect, useState, useRef, Suspense } from 'react'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { FaUserCircle, FaPaperPlane } from 'react-icons/fa'
import { API_URL } from '../../services/api'

type Mensaje = {
  id: number
  remitenteId: number
  destinatarioId: number
  contenido: string
  timestamp?: string
}

type Usuario = {
  id: number
  nombre_completo: string
  foto_perfil?: string
  rol: string
}

function MensajesContent() {
  const searchParams = useSearchParams()
  const destinatarioId = searchParams.get('destinatarioId')
  const [user, setUser] = useState<Usuario | null>(null)
  const [destinatario, setDestinatario] = useState<Usuario | null>(null)
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [nuevoMensaje, setNuevoMensaje] = useState('')
  const [loading, setLoading] = useState(true)
  const chatRef = useRef<HTMLDivElement>(null)

  // Cargar usuario autenticado
  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
  }, [])

  // Cargar destinatario (artesano)
  useEffect(() => {
    if (destinatarioId) {
      axios.get(`${API_URL}/users/${destinatarioId}`)
        .then(res => setDestinatario(res.data))
    }
  }, [destinatarioId])

  // Función para cargar mensajes entre usuario y destinatario
  const fetchMensajes = () => {
    if (user && destinatarioId) {
      const token = localStorage.getItem('token');
      axios.get(`${API_URL}/mensajes`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          const conv = res.data.filter((m: Mensaje) =>
            (m.remitenteId === user.id && m.destinatarioId == Number(destinatarioId)) ||
            (m.remitenteId == Number(destinatarioId) && m.destinatarioId === user.id)
          )
          setMensajes(conv)
          setLoading(false)
          setTimeout(() => {
            chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
          }, 100)
        })
    }
  }

  // Polling para recargar mensajes cada 2 segundos
  useEffect(() => {
    setLoading(true)
    fetchMensajes()
    const interval = setInterval(fetchMensajes, 2000)
    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [user, destinatarioId])

  // Enviar mensaje
  const handleEnviar = async () => {
    if (!nuevoMensaje.trim() || !user || !destinatarioId) return
    const token = localStorage.getItem('token');
    await axios.post(`${API_URL}/mensajes`, {
      contenido: nuevoMensaje,
      remitenteId: user.id,
      destinatarioId: Number(destinatarioId)
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setNuevoMensaje('')
    fetchMensajes()
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-white via-sky-100 to-blue-200">
        <FaUserCircle size={80} className="text-blue-400 mb-6" />
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Debes iniciar sesión para usar el chat</h2>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center py-10 min-h-screen bg-gradient-to-br from-white via-sky-100 to-blue-200">
      <div className="bg-white/90 rounded-2xl shadow-xl p-0 flex flex-col items-center max-w-2xl w-full min-h-[60vh]">
        {/* Encabezado chat */}
        <div className="w-full flex items-center gap-4 px-6 py-4 border-b border-blue-100 bg-blue-50 rounded-t-2xl">
          {destinatario?.foto_perfil
            ? <img src={destinatario.foto_perfil} alt={destinatario.nombre_completo} className="h-12 w-12 rounded-full object-cover" />
            : <FaUserCircle size={48} className="text-blue-400" />}
          <div>
            <div className="font-bold text-blue-900 text-lg">{destinatario?.nombre_completo || 'Artesano'}</div>
            <div className="text-blue-700 text-xs">{destinatario?.rol === 'artesano' ? 'Artesano' : 'Usuario'}</div>
          </div>
        </div>
        {/* Chat burbujas */}
        <div ref={chatRef} className="flex-1 w-full px-4 py-6 overflow-y-auto" style={{ minHeight: 320, maxHeight: 480 }}>
          {loading ? (
            <div className="text-blue-700 text-center">Cargando mensajes...</div>
          ) : mensajes.length === 0 ? (
            <div className="text-blue-700 text-center">No hay mensajes aún. ¡Inicia la conversación!</div>
          ) : (
            <div className="flex flex-col gap-3">
              {mensajes.map((m, i) => (
                <div
                  key={m.id}
                  className={`flex ${m.remitenteId === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs px-4 py-2 rounded-2xl shadow
                    ${m.remitenteId === user.id
                      ? 'bg-blue-700 text-white rounded-br-sm'
                      : 'bg-blue-100 text-blue-900 rounded-bl-sm'
                    }`}
                  >
                    <div className="whitespace-pre-line">{m.contenido}</div>
                    <div className="text-xs text-right mt-1 opacity-70">
                      {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Input de mensaje */}
        <form
          className="w-full flex items-center gap-2 px-4 py-4 border-t border-blue-100 bg-white rounded-b-2xl"
          onSubmit={e => { e.preventDefault(); handleEnviar(); }}
        >
          <input
            type="text"
            value={nuevoMensaje}
            onChange={e => setNuevoMensaje(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 border rounded-full px-4 py-2 outline-none"
            maxLength={500}
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-full flex items-center gap-2 font-semibold transition"
            disabled={!nuevoMensaje.trim()}
            title="Enviar"
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
      <style jsx>{`
        .rounded-br-sm { border-bottom-right-radius: 0.5rem !important; }
        .rounded-bl-sm { border-bottom-left-radius: 0.5rem !important; }
      `}</style>
    </div>
  )
}

// Exporta el componente principal como default
export default function MensajesPage() {
  return (
    <Suspense fallback={<div className="p-8">Cargando chat...</div>}>
      <MensajesContent />
    </Suspense>
  )
}