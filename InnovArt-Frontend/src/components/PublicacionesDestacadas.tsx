import { useEffect, useState } from 'react'
import { FaHeart } from 'react-icons/fa'

type Publicacion = {
  id: number
  artesano: {
    nombre: string
    categoria: string
    fotoPerfil: string
  }
  fotoArtesania: string
  likes: number
}

export default function PublicacionesDestacadas() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    // Solo fallback local, sin Unsplash
    setPublicaciones([
      {
        id: 1,
        artesano: {
          nombre: "Artesano 1",
          categoria: "Cerámica",
          fotoPerfil: "https://randomuser.me/api/portraits/men/1.jpg"
        },
        fotoArtesania: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
        likes: 120
      },
      {
        id: 2,
        artesano: {
          nombre: "Artesano 2",
          categoria: "Textiles",
          fotoPerfil: "https://randomuser.me/api/portraits/women/2.jpg"
        },
        fotoArtesania: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        likes: 98
      }
    ])
  }, [])

  useEffect(() => {
    if (publicaciones.length <= 1) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % publicaciones.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [publicaciones])

  if (publicaciones.length === 0) {
    return (
      <div className="w-full mt-8 flex-1 flex flex-col justify-center items-center min-h-[260px]">
        <span className="text-blue-900 font-semibold">Cargando publicaciones destacadas...</span>
      </div>
    )
  }

  const pub = publicaciones[current]

  return (
    <div className="w-full mt-8 flex-1 flex flex-col">
      <h2 className="text-xl font-bold text-blue-900 mb-4">Publicación destacada</h2>
      <div className="flex justify-center flex-1">
        <div
          key={pub.id}
          className="flex flex-col bg-white/90 rounded-lg shadow p-6 items-center w-full max-w-xl transition-all duration-700 ease-in-out animate-fade-in h-full min-h-[320px]"
          style={{ minHeight: "320px" }}
        >
          <div className="flex items-center w-full mb-4">
            <img
              src={pub.artesano.fotoPerfil}
              alt={pub.artesano.nombre}
              className="h-16 w-16 rounded-full object-cover border-2 border-blue-200"
            />
            <div className="ml-4 flex-1">
              <div className="font-semibold text-blue-900">{pub.artesano.nombre}</div>
              <div className="text-sm text-blue-700">{pub.artesano.categoria}</div>
            </div>
          </div>
          <img
            src={pub.fotoArtesania}
            alt="Artesanía"
            className="w-full max-h-64 object-cover rounded-lg mb-4"
            style={{ height: "200px" }}
          />
          <div className="flex items-center text-blue-800 font-bold justify-center w-full">
            <FaHeart className="mr-2 text-red-500" />
            {pub.likes}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(40px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 0.7s;
        }
      `}</style>
    </div>
  )
}
          