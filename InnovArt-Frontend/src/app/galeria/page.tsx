'use client'
import { useEffect, useState, Suspense } from 'react'
import axios from 'axios'
import { FaStar, FaSearch } from 'react-icons/fa'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { API_URL } from '../../services/api'
import StatusMessage from '../../components/StatusMessage'

// Extrae el componente que usa useSearchParams
function GaleriaContent() {
  const [productos, setProductos] = useState<any[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const [busqueda, setBusqueda] = useState(searchParams.get('busqueda') || '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setError(null)
    axios.get(`${API_URL}/products`)
      .then(res => {
        // Mapear campos del backend
        const productosMapeados = res.data.map((p: any) => ({
          ...p,
          titulo: p.title || p.titulo,
          descripcion: p.description || p.descripcion,
          precio: p.price || p.precio,
          imagen: p.image || p.imagen || '/default-artesania.png'
        }));
        setProductos(productosMapeados);
        setError(null);
      })
      .catch((err: any) => {
        console.error('Error loading products:', err);
        if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
          setError('Error de conexión. Verifica que el backend esté corriendo en http://localhost:5000');
        } else {
          setError(err.response?.data?.error || 'Error al cargar productos. Verifica que el backend esté corriendo.');
        }
      })
      .finally(() => setLoading(false))
  }, [])

  // Filtra productos si hay búsqueda
  const productosFiltrados = busqueda
    ? productos.filter(p =>
        (p.titulo || '').toLowerCase().includes(busqueda.toLowerCase()) ||
        (p.descripcion || '').toLowerCase().includes(busqueda.toLowerCase()) ||
        (p.artesano?.nombre_completo || '').toLowerCase().includes(busqueda.toLowerCase())
      )
    : productos

  const handleBusqueda = () => {
    router.push(`/galeria?busqueda=${encodeURIComponent(busqueda)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-100 to-blue-200">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">Galería de Artesanías</h2>
        <StatusMessage loading={loading} error={error}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {productosFiltrados.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center transition-transform transform hover:scale-105">
                <img src={p.imagen || '/default-artesania.png'} alt={p.titulo} className="h-32 w-full object-cover rounded mb-2" />
                <div className="font-bold text-blue-900">{p.titulo}</div>
                {/* Descripción */}
                {p.descripcion && (
                  <div className="text-blue-800 text-sm mt-1 mb-1 text-center line-clamp-2">{p.descripcion}</div>
                )}
                {/* Nombre del artesano */}
                {p.artesano && p.artesano.nombre_completo && (
                  <div className="text-blue-700 text-xs mb-1">
                    Artesano: <Link href={`/artesanos/${p.artesano.id}`} className="underline">{p.artesano.nombre_completo}</Link>
                  </div>
                )}
                {/* Valoración promedio */}
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.round(p.calificacion_promedio || 0) ? 'text-yellow-500' : 'text-gray-300'}
                    />
                  ))}
                  <span className="text-blue-700 text-xs ml-1">
                    {typeof p.calificacion_promedio === 'number'
                      ? p.calificacion_promedio.toFixed(1)
                      : '0.0'}
                  </span>
                </div>
                <div className="text-blue-800 font-semibold mt-1">${p.precio}</div>
                <Link href={`/productos/${p.id}`} className="mt-3 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-full font-semibold transition">
                  Más información
                </Link>
              </div>
            ))}
          </div>
          {productosFiltrados.length === 0 && (
            <div className="text-blue-700 mt-8 text-center">No se encontraron productos para tu búsqueda.</div>
          )}
        </StatusMessage>
      </div>
    </div>
  )
}

// Exporta la página usando Suspense
export default function GaleriaPage() {
  return (
    <Suspense fallback={<div className="p-8">Cargando galería...</div>}>
      <GaleriaContent />
    </Suspense>
  )
}
