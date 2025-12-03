'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { FaStar, FaMapMarkerAlt, FaWhatsapp, FaEnvelope, FaBoxOpen } from 'react-icons/fa'
import { API_URL } from '../../../services/api'

export default function ArtesanoPerfil() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id
  const [artesano, setArtesano] = useState<any>(null)
  const [productos, setProductos] = useState<any[]>([])
  const [resenas, setResenas] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      axios.get(`${API_URL}/users/${id}`)
        .then(res => setArtesano(res.data))
        .catch(() => setError('Artesano no encontrado'))
      axios.get(`${API_URL}/products?usuarioId=${id}`)
        .then(res => setProductos(res.data))
        .catch(() => setProductos([]))
      axios.get(`${API_URL}/reviews?artesanoId=${id}`)
        .then(res => setResenas(res.data))
        .catch(() => setResenas([]))
    }
  }, [id])

  if (error) return <div className="p-6 text-red-700">{error}</div>
  if (!artesano) return <div className="p-6">Cargando...</div>

  // Parse campos
  let especialidades: string[] = []
  let portafolio: string[] = []
  try { especialidades = artesano.especialidades ? artesano.especialidades.split(',') : [] } catch {}
  try { portafolio = artesano.portafolio ? JSON.parse(artesano.portafolio) : [] } catch {}

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 bg-white/90 rounded-2xl shadow-xl p-8 mb-8">
        <img src={artesano.foto_perfil || '/default-profile.png'} alt={artesano.nombre_completo} className="h-32 w-32 rounded-full object-cover border-4 border-blue-200 mb-4 md:mb-0" />
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-blue-900">{artesano.nombre_completo}</h2>
          <div className="flex items-center gap-2 text-blue-700">
            <FaMapMarkerAlt /> {artesano.ciudad}{artesano.pais ? `, ${artesano.pais}` : ''}
          </div>
          {especialidades.length > 0 && (
            <div className="flex flex-wrap gap-2 text-blue-700 text-sm">
              {especialidades.map((e, i) => (
                <span key={i} className="bg-blue-100 px-2 py-0.5 rounded">{e.trim()}</span>
              ))}
            </div>
          )}
          {artesano.descripcion && (
            <div className="text-blue-800 mt-2">{artesano.descripcion}</div>
          )}
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1 text-yellow-600 font-semibold">
              <FaStar /> {typeof artesano.calificacion_promedio === 'number'
                ? artesano.calificacion_promedio.toFixed(1)
                : '0.0'} / 5
            </span>
            <span className="text-blue-700">{artesano.total_reseñas || 0} reseñas</span>
            <span className="flex items-center gap-1 text-blue-700">
              <FaBoxOpen /> {productos.length} productos
            </span>
          </div>
          {/* Botón para contactar */}
          <div className="flex gap-4 mt-4">
            <Link href={`/mensajes?destinatarioId=${artesano.id}`}>
              <button className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-full font-semibold flex items-center gap-2">
                <FaEnvelope /> Contactar
              </button>
            </Link>
            {artesano.redes_sociales && (() => {
              let redes = {}
              try { redes = JSON.parse(artesano.redes_sociales) } catch {}
              return redes && (redes as any).whatsapp ? (
                <a href={(redes as any).whatsapp} target="_blank" rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full font-semibold flex items-center gap-2">
                  <FaWhatsapp /> WhatsApp
                </a>
              ) : null
            })()}
          </div>
          {/* Portafolio */}
          {portafolio.length > 0 && (
            <div className="mt-4">
              <b className="text-blue-900">Portafolio:</b>
              <div className="flex gap-2 mt-2 flex-wrap">
                {portafolio.map((url, i) => (
                  <img key={i} src={url} alt={`Portafolio ${i+1}`} className="h-16 w-16 object-cover rounded shadow" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Productos publicados */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-2">Productos publicados</h3>
        {productos.length === 0 ? (
          <div className="text-blue-700">Este artesano aún no ha publicado productos.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {productos.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                <img src={p.imagen || '/default-artesania.png'} alt={p.titulo} className="h-24 w-full object-cover rounded mb-2" />
                <div className="font-bold text-blue-900">{p.titulo}</div>
                <div className="text-blue-800 text-sm">{p.descripcion}</div>
                <div className="text-blue-700 font-semibold mt-1">${p.precio}</div>
                <Link href={`/productos/${p.id}`} className="mt-2 text-blue-700 underline">Ver detalle</Link>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Reseñas de clientes */}
      <div>
        <h3 className="text-xl font-bold text-blue-900 mb-2">Reseñas de clientes</h3>
        {resenas.length === 0 ? (
          <div className="text-blue-700">Aún no hay reseñas para este artesano.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resenas.map(r => (
              <div key={r.id} className="bg-blue-50 rounded-xl shadow p-4 flex flex-col">
                <div className="font-bold text-blue-900 mb-1">{r.cliente_nombre || 'Cliente'}</div>
                <div className="flex items-center text-yellow-600 font-bold mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < (r.calificacion || 0) ? 'text-yellow-500' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <div className="text-blue-800 italic mb-2">"{r.comentario}"</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
