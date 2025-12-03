'use client'

import { FaFacebook, FaInstagram, FaWhatsapp, FaUserCircle, FaSearch, FaStar, FaMapMarkerAlt } from 'react-icons/fa'
import Link from 'next/link'
import PublicacionesDestacadas from '../components/PublicacionesDestacadas'
import { useEffect, useState } from 'react'
import AyudaBurbuja from '../components/AyudaBurbuja'
import { useRouter, usePathname } from 'next/navigation'
import axios from 'axios'
import AutoCompleteSearch from './components/AutoCompleteSearch'
import { API_URL } from '../services/api'

export default function Home() {
  const [loggedUser, setLoggedUser] = useState<any>(null);
  const [busqueda, setBusqueda] = useState('');
  const [productosDestacados, setProductosDestacados] = useState<any[]>([]);
  const [artesanosRecomendados, setArtesanosRecomendados] = useState<any[]>([]);
  const [artesanosDestacados, setArtesanosDestacados] = useState<any[]>([]);
  const [resenasDestacadas, setResenasDestacadas] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      setLoggedUser(user ? JSON.parse(user) : null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoggedUser(null);
    window.location.href = '/login';
  };

  // Búsqueda rápida
  const handleBusqueda = (valor?: string) => {
    const texto = valor ?? busqueda;
    if (texto.trim()) {
      router.push(`/galeria?busqueda=${encodeURIComponent(texto)}`);
    }
  };

  // Cargar productos destacados, artesanos recomendados y reseñas destacadas
  useEffect(() => {
    // Cargar productos (sin filtro destacados por ahora, el backend no lo soporta)
    axios.get(`${API_URL}/products`)
      .then(res => {
        const productos = res.data.map((p: any) => ({
          ...p,
          titulo: p.title || p.titulo,
          descripcion: p.description || p.descripcion,
          precio: p.price || p.precio,
          imagen: p.image || p.imagen || '/default-artesania.png'
        }));
        setProductosDestacados(productos.slice(0, 8));
      })
      .catch((err: any) => {
        console.error('Error loading products:', err);
        setProductosDestacados([]);
      });
    
    // Cargar artesanos
    axios.get(`${API_URL}/users`)
      .then(res => {
        const artesanos = res.data
          .filter((u: any) => u.role === 'artesano' || u.rol === 'artesano')
          .map((a: any) => ({
            ...a,
            nombre_completo: a.name || a.nombre_completo || a.Name
          }));
        setArtesanosRecomendados(artesanos.slice(0, 4));
        setArtesanosDestacados(artesanos.slice(0, 8));
      })
      .catch((err: any) => {
        console.error('Error loading users:', err);
        setArtesanosRecomendados([]);
        setArtesanosDestacados([]);
      });
    
    // Cargar reseñas
    axios.get(`${API_URL}/reviews`)
      .then(res => setResenasDestacadas(res.data.slice(0, 3)))
      .catch((err: any) => {
        console.error('Error loading reviews:', err);
        setResenasDestacadas([]);
      });
  }, []);

  // Búsqueda rápida
  // Internamente decide si es producto o artesano según la ruta
  const pathname = usePathname();
  const tipoBusqueda: 'productos' | 'artesanos' = pathname?.includes('artesano') ? 'artesanos' : 'productos';

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-br from-white via-sky-100 to-blue-200">
      {/* Barra superior con contacto y redes */}
      <header className="w-full bg-blue-800 text-white text-sm px-6 py-3 flex justify-between items-center shadow-md z-20 relative">
        <div className="flex gap-6">
          <a href="mailto:contacto@innovart.com" className="hover:underline">contacto@innovart.com</a>
          <a href="tel:+51987654321" className="hover:underline">+51 987 654 321</a>
        </div>
        <div className="flex gap-4">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-300 transition-colors">
            <FaFacebook size={20} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-300 transition-colors">
            <FaInstagram size={20} />
          </a>
          <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="hover:text-green-300 transition-colors">
            <FaWhatsapp size={20} />
          </a>
        </div>
      </header>

      {/* Sección principal con multimedia de fondo */}
      <main className="relative flex-grow flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Imagen de fondo solo en el main */}
        <div className="absolute inset-0 -z-10">
          <img
            src="/diseno-fondo-abstracto-azul.jpg"
            alt="Fondo InnovArt"
            className="w-full h-full object-cover animate-fadein"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Cards divididos */}
        <div className="flex flex-col md:flex-row gap-8 w-full px-8 py-8 animate-fadein-slow">
          {/* Card Izquierdo */}
          <div className="flex-1 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-10 flex flex-col justify-start items-start text-left min-h-[400px] hover:shadow-blue-200 transition-shadow duration-300 animate-slidein-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-900 mb-4 drop-shadow-lg tracking-tight">
              Red digital de Artesanos
            </h1>
            <p className="text-lg sm:text-xl text-blue-800 font-medium mb-6">
              Plataforma para descubrir, conectar y apoyar a los mejores artesanos peruanos. Explora talento local, encuentra productos únicos y forma parte de nuestra comunidad creativa.
            </p>
            <Link href="/artesanos">
              <button className="mt-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full shadow-md transition-all duration-200 hover:scale-105">
                Explorar
              </button>
            </Link>
            <PublicacionesDestacadas />
          </div>
          {/* Card Derecho */}
          <div className="flex-1 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-10 flex flex-col justify-center items-center min-h-[400px] hover:shadow-blue-200 transition-shadow duration-300 animate-slidein-right">
            <div className="flex w-full h-full gap-6">
              {/* Imágenes a la izquierda */}
              <div className="flex flex-col gap-4 w-1/2 h-full">
                <img
                  src="/imagen_art1.jpeg"
                  alt="Imagen local 1"
                  className="w-full h-1/2 object-cover rounded-xl shadow hover:scale-105 transition-transform duration-200"
                  style={{ minHeight: "120px" }}
                />
                <img
                  src="/imagen_art2.jpeg"
                  alt="Imagen local 2"
                  className="w-full h-1/2 object-cover rounded-xl shadow hover:scale-105 transition-transform duration-200"
                  style={{ minHeight: "120px" }}
                />
              </div>
              {/* Novedades a la derecha */}
              <div className="flex flex-col w-1/2 h-full justify-start">
                <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <span className="inline-block w-2 h-6 bg-blue-400 rounded-full mr-2"></span>
                  Novedades
                </h3>
                <div className="flex flex-col gap-4">
                  {/* Simulación de noticia destacada */}
                  <div className="bg-blue-50 rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full font-semibold">06/06/2025</span>
                      <span className="text-sm text-blue-700 font-bold">Feria Artesanal</span>
                    </div>
                    <div className="text-blue-900 font-medium">¡No te pierdas la gran feria artesanal en Lima este fin de semana! Más de 50 expositores y talleres en vivo.</div>
                  </div>
                  {/* Simulación de noticia con imagen */}
                  <div className="bg-yellow-50 rounded-lg p-4 shadow hover:shadow-md transition-shadow flex gap-3">
                    <img src="/logo_innovart_white.png" alt="Premio" className="h-10 w-10 rounded-full object-cover border-2 border-yellow-300" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-yellow-200 text-yellow-900 px-2 py-0.5 rounded-full font-semibold">05/06/2025</span>
                        <span className="text-sm text-yellow-700 font-bold">Premio Nacional</span>
                      </div>
                      <div className="text-yellow-900 font-medium">El artesano Juan Pérez fue galardonado como el mejor ceramista del año.</div>
                    </div>
                  </div>
                  {/* Simulación de noticia simple */}
                  <div className="bg-green-50 rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-green-200 text-green-900 px-2 py-0.5 rounded-full font-semibold">04/06/2025</span>
                      <span className="text-sm text-green-700 font-bold">Nueva Categoría</span>
                    </div>
                    <div className="text-green-900 font-medium">¡Ahora puedes explorar la nueva sección de Joyería artesanal!</div>
                  </div>
                  {/* Simulación de noticia futura */}
                  <div className="bg-gray-50 rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-gray-200 text-gray-900 px-2 py-0.5 rounded-full font-semibold">Próximamente</span>
                      <span className="text-sm text-gray-700 font-bold">Actualización</span>
                    </div>
                    <div className="text-gray-900 font-medium">Pronto lanzaremos la app móvil de InnovArt para Android y iOS.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Productos destacados */}
        <section className="w-full max-w-7xl mx-auto mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-blue-900">Productos destacados</h2>
            <Link href="/productos" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-full font-semibold transition">
              Ver más productos
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {productosDestacados.map(p => (
              <div
                key={p.id}
                className="bg-white rounded-xl shadow p-4 flex flex-col items-center cursor-pointer hover:shadow-blue-200 transition-shadow"
                onClick={() => router.push(`/productos/${p.id}`)}
              >
                <img src={p.imagen || '/default-artesania.png'} alt={p.titulo} className="h-32 w-full object-cover rounded mb-2" />
                <div className="font-bold text-blue-900">{p.titulo}</div>
                <div className="text-blue-800 font-semibold mt-1">${p.precio}</div>
                {/* Nombre del artesano con enlace */}
                {p.artesano && (
                  <Link
                    href={`/artesanos/${p.artesano.id}`}
                    className="text-blue-700 underline text-sm mt-1"
                    onClick={e => { e.stopPropagation(); }}
                  >
                    {p.artesano.nombre_completo}
                  </Link>
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
              </div>
            ))}
          </div>
        </section>

        {/* Artesanos recomendados */}
        <section className="w-full max-w-7xl mx-auto mt-12">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Conoce a nuestros artesanos destacados</h2>
          {artesanosDestacados.length === 0 ? (
            <div className="text-blue-700 text-center py-8">Próximamente más contenido.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {artesanosDestacados.map(a => (
                <div key={a.id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center hover:shadow-blue-200 transition-shadow">
                  <img src={a.foto_perfil || '/default-profile.png'} alt={a.nombre_completo} className="h-20 w-20 rounded-full object-cover mb-2 border-2 border-blue-200" />
                  <div className="font-bold text-blue-900">{a.nombre_completo}</div>
                  <div className="flex items-center gap-2 text-blue-700 mt-1">
                    <FaMapMarkerAlt className="text-blue-400" />
                    <span>{a.ciudad}{a.pais ? `, ${a.pais}` : ''}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < Math.round(a.calificacion_promedio || 0) ? 'text-yellow-500' : 'text-gray-300'}
                      />
                    ))}
                    <span className="text-blue-700 text-xs ml-1">
                      {typeof a.calificacion_promedio === 'number'
                        ? a.calificacion_promedio.toFixed(1)
                        : '0.0'}
                    </span>
                  </div>
                  <Link href={`/artesanos/${a.id}`} className="mt-3 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-full font-semibold transition">Ver perfil</Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Reseñas destacadas */}
        <section className="w-full max-w-7xl mx-auto mt-12">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Lo que dicen nuestros clientes</h2>
          {resenasDestacadas.length === 0 ? (
            <div className="text-blue-700 text-center py-8">Próximamente más contenido.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {resenasDestacadas.map(r => (
                <div key={r.id} className="bg-blue-50 rounded-xl shadow p-4 flex flex-col items-center">
                  {/* Foto pequeña opcional */}
                  {r.cliente_foto && (
                    <img src={r.cliente_foto} alt={r.cliente_nombre} className="h-10 w-10 rounded-full object-cover mb-1" />
                  )}
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
                  {/* Enlace al producto o artesano */}
                  {r.productoId && (
                    <Link href={`/productos/${r.productoId}`} className="text-blue-700 underline text-xs">Ver producto</Link>
                  )}
                  {r.artesanoId && (
                    <Link href={`/artesanos/${r.artesanoId}`} className="text-blue-700 underline text-xs">Ver artesano</Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="w-full flex justify-center mt-16 mb-12">
          <div className="bg-blue-700 rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8 max-w-4xl w-full">
            <div className="flex-1 text-white text-xl font-bold">
              Únete a nuestra comunidad y apoya el talento local.
            </div>
            <div className="flex gap-4">
              <Link href="/productos">
                <button className="bg-white hover:bg-blue-100 text-blue-900 font-bold py-2 px-6 rounded-full shadow transition">Quiero Comprar</button>
              </Link>
              <Link href="/registro?rol=artesano">
                <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-full shadow transition">Soy Artesano, quiero registrarme</button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Banner debajo del main y antes del pie de página */}
      {/* <div className="w-full flex justify-center py-8">
        <div className="w-[95vw] max-w-7xl bg-white/90 rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center">
          <img
            src="/img_banner.png"
            alt="Banner InnovArt"
            className="w-full h-auto object-cover"
            style={{ maxHeight: '480px', minHeight: '220px' }}
          />
        </div>
      </div> */}
      {/* Animaciones globales */}
      <style jsx global>{`
        @keyframes fadein {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadein {
          animation: fadein 1s;
        }
        .animate-fadein-slow {
          animation: fadein 1.5s;
        }
        @keyframes slidein-left {
          from { opacity: 0; transform: translateX(-40px);}
          to { opacity: 1; transform: translateX(0);}
        }
        .animate-slidein-left {
          animation: slidein-left 1s;
        }
        @keyframes slidein-right {
          from { opacity: 0; transform: translateX(40px);}
          to { opacity: 1; transform: translateX(0);}
        }
        .animate-slidein-right {
          animation: slidein-right 1s;
        }
      `}</style>
      <AyudaBurbuja />
    </div>
  )
}