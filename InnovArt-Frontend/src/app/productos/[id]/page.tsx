'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { FaStar, FaBoxOpen, FaWhatsapp, FaEnvelope, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { API_URL } from '@/services/api'

export default function ProductoDetalle() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id
  const [producto, setProducto] = useState<any>(null)
  const [imagenes, setImagenes] = useState<string[]>([])
  const [imgActual, setImgActual] = useState(0)
  const [artesano, setArtesano] = useState<any>(null)
  const [resenas, setResenas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showLightbox, setShowLightbox] = useState(false)
  const [calificacion, setCalificacion] = useState(0)
  const [comentario, setComentario] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      setLoading(true)
      axios.get(`${API_URL}/products/${id}`)
        .then(async res => {
          // Mapear campos del backend
          const producto = {
            ...res.data,
            titulo: res.data.title || res.data.titulo,
            descripcion: res.data.description || res.data.descripcion,
            precio: res.data.price || res.data.precio,
            usuarioId: res.data.usuarioId || res.data.userId
          };
          setProducto(producto)
          let imgs: string[] = []
          if (res.data.imagenes && Array.isArray(res.data.imagenes)) {
            imgs = res.data.imagenes
          } else if (res.data.imagen) {
            imgs = [res.data.imagen]
          } else {
            imgs = ['/default-artesania.png']
          }
          setImagenes(imgs)
          if (producto.usuarioId) {
            try {
              const artesanoRes = await axios.get(`${API_URL}/users/${producto.usuarioId}`)
              setArtesano(artesanoRes.data)
            } catch (err) {
              console.error('Error loading artesano:', err)
            }
          }
          axios.get(`${API_URL}/reviews?productoId=${id}`)
            .then(res => setResenas(res.data))
            .catch(() => setResenas([]))
          setLoading(false)
        })
        .catch((err: any) => {
          console.error('Error loading product:', err)
          setError(err.response?.data?.error || 'Error al cargar el producto')
          setLoading(false)
        })
    }
  }, [id])

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center">
        <div className="animate-pulse w-full max-w-4xl h-96 bg-gray-200 rounded-xl mb-6"></div>
        <div className="animate-pulse w-2/3 h-8 bg-gray-200 rounded mb-2"></div>
        <div className="animate-pulse w-1/2 h-6 bg-gray-100 rounded mb-2"></div>
        <div className="animate-pulse w-full h-32 bg-gray-100 rounded"></div>
      </div>
    )
  }

  if (!producto) {
    return <div className="p-8 text-blue-800">Producto no encontrado.</div>
  }

  const caracteristicas = [
    { atributo: 'Material', valor: producto.material || 'No especificado' },
    { atributo: 'Dimensiones', valor: producto.dimensiones || 'No especificado' },
    { atributo: 'Peso', valor: producto.peso || 'No especificado' },
    { atributo: 'Técnica artesanal', valor: producto.tecnica || 'No especificado' },
    { atributo: 'Tiempo de elaboración', valor: producto.tiempo_elaboracion || 'No especificado' }
  ]
  const estado = producto.estado || 'disponible'
  const handlePrev = () => setImgActual((imgActual - 1 + imagenes.length) % imagenes.length)
  const handleNext = () => setImgActual((imgActual + 1) % imagenes.length)

  // Reemplaza la función handleEnviarReseña por una implementación real:
  async function handleEnviarReseña(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setMsg('');
    setError(null);
    try {
      const token = localStorage.getItem('token');
      // Asegúrate de tener el usuario autenticado
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user?.id) {
        setError('Debes iniciar sesión para dejar una reseña');
        return;
      }
      await axios.post(`${API_URL}/reviews`, {
        productId: producto.id,
        userId: user.id,
        rating: parseInt(calificacion.toString()) || 5,
        comment: comentario
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg('¡Gracias por tu reseña!');
      setCalificacion(0);
      setComentario('');
      // Recargar reseñas
      axios.get(`${API_URL}/reviews?productoId=${producto.id}`)
        .then(res => setResenas(res.data))
        .catch(() => setResenas([]));
    } catch (err: any) {
      setError('Error al enviar reseña');
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-10 mb-10">
        {/* Lado izquierdo: info principal */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <h1 className="text-3xl font-bold text-blue-900">{producto.titulo}</h1>
          {/* Imagen principal y galería */}
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md">
              <img
                src={imagenes[imgActual] || producto.imagen || '/default-artesania.png'}
                alt={producto.titulo}
                className="w-full h-64 object-cover rounded-xl shadow cursor-pointer"
                onClick={() => setShowLightbox(true)}
              />
              {imagenes.length > 1 && (
                <>
                  <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-blue-100">
                    <FaChevronLeft />
                  </button>
                  <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-blue-100">
                    <FaChevronRight />
                  </button>
                </>
              )}
            </div>
            {imagenes.length > 1 && (
              <div className="flex gap-2 mt-3">
                {imagenes.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Miniatura ${i + 1}`}
                    className={`h-16 w-16 object-cover rounded border-2 cursor-pointer ${i === imgActual ? 'border-blue-700' : 'border-gray-200'}`}
                    onClick={() => setImgActual(i)}
                  />
                ))}
              </div>
            )}
            {showLightbox && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowLightbox(false)}>
                <img src={imagenes[imgActual]} alt="Zoom" className="max-h-[80vh] max-w-[90vw] rounded-xl shadow-2xl" />
              </div>
            )}
          </div>
          {/* Descripción */}
          <div className="bg-white/90 rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-2">Descripción</h2>
            <div className="text-blue-800">{producto.descripcion || 'Sin descripción detallada.'}</div>
          </div>
          {/* Etiquetas de categoría y estado */}
          <div className="flex gap-3 items-center">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">{producto.categoria || 'Sin categoría'}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${estado === 'disponible' ? 'bg-green-200 text-green-900' : estado === 'agotado' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </span>
          </div>
          {/* Precio */}
          <div className="text-3xl font-extrabold text-blue-800 mt-2 mb-2">${producto.precio}</div>
          {/* Botones */}
          <div className="flex gap-4 mt-2">
            <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-full font-semibold transition">Añadir al carrito</button>
            {artesano && (
              <Link href={`/mensajes?destinatarioId=${artesano.id}`}>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2">
                  <FaEnvelope /> Contactar artesano
                </button>
              </Link>
            )}
          </div>
        </div>
        {/* Lado derecho: características técnicas e info artesano */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Características técnicas */}
          <div className="bg-white/90 rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-2">Características técnicas</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-blue-800 border border-blue-200 rounded-xl overflow-hidden">
                <tbody>
                  {caracteristicas.map((c, i) => (
                    <tr key={i} className="border-b last:border-b-0 border-blue-100">
                      <td className="font-semibold py-2 pr-4 bg-blue-50 border-r border-blue-100 w-1/3">{c.atributo}</td>
                      <td className="py-2 px-2">{c.valor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Información del artesano */}
          {artesano && (
            <div className="bg-white/90 rounded-xl shadow p-6 flex flex-col items-center">
              <img src={artesano.foto_perfil || '/default-profile.png'} alt={artesano.nombre_completo} className="h-24 w-24 rounded-full object-cover border-4 border-blue-200 mb-2" />
              <h3 className="text-lg font-bold text-blue-900">{artesano.nombre_completo}</h3>
              <div className="text-blue-800 mb-1">{artesano.descripcion}</div>
              <div className="flex items-center gap-2 mb-1">
                <FaStar className="text-yellow-500" />
                <span className="font-semibold">{typeof artesano.calificacion_promedio === 'number'
                  ? artesano.calificacion_promedio.toFixed(1)
                  : '0.0'}</span>
                <span className="text-xs text-blue-700">({artesano.total_reseñas || 0} reseñas)</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Link href={`/artesanos/${artesano.id}`} className="underline text-blue-700 font-semibold">Ver perfil completo</Link>
                {artesano.redes_sociales && (() => {
                  let redes = {}
                  try { redes = JSON.parse(artesano.redes_sociales) } catch {}
                  return (
                    <>
                      {(redes as any).facebook && <a href={(redes as any).facebook} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-700 underline">Facebook</a>}
                      {(redes as any).instagram && <a href={(redes as any).instagram} target="_blank" rel="noopener noreferrer" className="ml-2 text-pink-600 underline">Instagram</a>}
                      {(redes as any).whatsapp && <a href={(redes as any).whatsapp} target="_blank" rel="noopener noreferrer" className="ml-2 text-green-600 underline">WhatsApp</a>}
                    </>
                  )
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Reseñas y valoraciones */}
      <div className="bg-white/90 rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-blue-900 mb-2">Reseñas de clientes</h2>
        {resenas.length === 0 ? (
          <div className="text-blue-700">Aún no hay reseñas para este producto.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {resenas.map(r => (
              <div key={r.id} className="bg-blue-50 rounded-lg p-4 shadow flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <FaStar className="text-yellow-500" />
                  <span className="font-semibold">{r.calificacion}</span>
                  <span className="text-blue-900 font-bold">{r.cliente_nombre || 'Cliente'}</span>
                  <span className="text-xs text-blue-700 ml-2">{r.fecha ? new Date(r.fecha).toLocaleDateString() : ''}</span>
                </div>
                <div className="text-blue-800 italic">{r.comentario}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Política de entrega / pedidos */}
      <div className="bg-white/90 rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-blue-900 mb-2">Política de entrega y pedidos</h2>
        <ul className="text-blue-800 list-disc ml-6">
          <li>Tiempo estimado de entrega: {producto.tiempo_entrega || 'Consultar con el artesano'}</li>
          <li>Costos de envío: {producto.costo_envio || 'Consultar con el artesano'}</li>
          <li>Opciones de personalización: {producto.personalizable ? 'Sí' : 'No'}</li>
          <li>Métodos de pago aceptados: {artesano?.metodos_pago_aceptados || 'Consultar con el artesano'}</li>
        </ul>
      </div>
      {/* Contacto/chat */}
      <div className="bg-white/90 rounded-xl shadow p-6 mb-8 flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-blue-900 mb-2">¿Tienes dudas o quieres personalizar tu pedido?</h2>
          {artesano && (
            <Link href={`/mensajes?destinatarioId=${artesano.id}`}>
              <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 mt-2">
                <FaEnvelope /> Enviar mensaje al artesano
              </button>
            </Link>
          )}
        </div>
      </div>
      {/* Productos relacionados */}
      <ProductosRelacionados artesanoId={artesano?.id} actualId={producto.id} />
      {/* Calificación y reseña */}
      <div className="bg-white/90 rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Califica y deja una reseña</h2>
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map(i => (
            <FaStar
              key={i}
              className={i <= calificacion ? 'text-yellow-500 cursor-pointer' : 'text-gray-300 cursor-pointer'}
              onClick={() => setCalificacion(i)}
            />
          ))}
        </div>
        <textarea value={comentario} onChange={e => setComentario(e.target.value)} placeholder="Escribe tu reseña..." className="w-full p-2 border border-blue-200 rounded-md mt-2 resize-none h-20"></textarea>
        <button onClick={handleEnviarReseña} className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md font-semibold transition-all mt-2">
          Enviar reseña
        </button>
        {msg && <div className="text-green-700 mt-2">{msg}</div>}
        {error && <div className="text-red-700 mt-2">{error}</div>}
      </div>
      <style jsx>{`
        .animate-pulse {
          animation: pulse 1.2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}

// Componente de productos relacionados
function ProductosRelacionados({ artesanoId, actualId }: { artesanoId?: number, actualId: number }) {
  const [relacionados, setRelacionados] = useState<any[]>([])
  useEffect(() => {
    if (artesanoId) {
      axios.get(`${API_URL}/products?usuarioId=${artesanoId}`)
        .then(res => {
          setRelacionados(res.data.filter((p: any) => p.id !== actualId).slice(0, 4))
        })
    }
  }, [artesanoId, actualId])
  if (!relacionados.length) return null
  return (
    <div className="bg-white/90 rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-bold text-blue-900 mb-4">Más productos de este artesano</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {relacionados.map(p => (
          <Link key={p.id} href={`/productos/${p.id}`} className="bg-white rounded-xl shadow p-3 flex flex-col items-center hover:shadow-blue-200 transition-shadow">
            <img src={p.imagen || '/default-artesania.png'} alt={p.titulo} className="h-24 w-full object-cover rounded mb-2" />
            <div className="font-bold text-blue-900">{p.titulo}</div>
            <div className="text-blue-800 font-semibold mt-1">${p.precio}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
