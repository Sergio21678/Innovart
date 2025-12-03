'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { FaUserTie, FaStar, FaBoxOpen, FaEdit, FaSignOutAlt, FaPlus, FaStore, FaKey } from 'react-icons/fa'
import { API_URL } from '@/services/api'

export default function PerfilArtesano() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [productos, setProductos] = useState<any[]>([])
  const [resenas, setResenas] = useState<any[]>([])
  const [tab, setTab] = useState('profesional')
  const [mensajes, setMensajes] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      setUser(null)
      router.replace('/login')
      return
    }
    axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const role = res.data.role ?? res.data.rol
      if (role !== 'artesano') {
        router.replace('/perfil')
        return
      }
      setUser({
        ...res.data,
        telefono: res.data.telefono || res.data.Telefono,
        ciudad: res.data.ciudad || res.data.Ciudad,
        pais: res.data.pais || res.data.Pais,
        descripcion: res.data.descripcion || res.data.Descripcion,
        especialidades: res.data.especialidades || res.data.Especialidades,
        correo: res.data.correo || res.data.email,
        nombre_completo: res.data.nombre_completo || res.data.name,
        fotoPerfil: res.data.fotoPerfil || res.data.foto_perfil
      })
      setLoading(false)
    }).catch(() => {
      setLoading(false)
      setUser(null)
      router.replace('/login')
    })
  }, [router])

  useEffect(() => {
    if (user?.id) {
      axios.get(`${API_URL}/products?usuarioId=${user.id}`)
        .then(res => setProductos(res.data || []))
      axios.get(`${API_URL}/reviews?artesanoId=${user.id}`)
        .then(res => setResenas(res.data))
        .catch(() => setResenas([]))
    }
  }, [user])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (user?.id) {
      axios.get(`${API_URL}/mensajes?destinatarioId=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setMensajes(res.data))
    }
  }, [user])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.replace('/login')
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]">Cargando perfil...</div>
  if (!user) return null

  let especialidades: string[] = []
  try { especialidades = user.especialidades ? user.especialidades.split(',') : [] } catch {}

  return (
    <div className="flex flex-col items-center py-8 bg-gradient-to-br from-white via-sky-100 to-blue-200 min-h-[60vh]">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Perfil de Artesano</h1>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center mb-6 w-full max-w-xl">
          <img src={user.fotoPerfil || '/default-profile.png'} alt={user.nombre_completo || user.email} className="h-32 w-32 rounded-full object-cover border-4 border-blue-200 shadow-lg mb-2" />
          <h2 className="text-2xl font-bold text-blue-900 mb-1 flex items-center gap-2">
            {user.nombre_completo || user.email}
            <FaUserTie className="text-blue-700" title="Artesano" />
          </h2>
          <div className="text-blue-700 mb-1">{user.correo || user.email}</div>
          <div className="text-blue-700 mb-1">{user.telefono || <span className="italic text-gray-400">Sin teléfono</span>}</div>
          <div className="text-blue-700 mb-1">{(user.ciudad || '')} {user.pais || ''}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <button className={`px-4 py-2 rounded-full font-semibold ${tab === 'profesional' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-900'}`} onClick={() => setTab('profesional')}>Profesional</button>
            <button className={`px-4 py-2 rounded-full font-semibold ${tab === 'productos' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-900'}`} onClick={() => setTab('productos')}>Mis Productos</button>
            <button className={`px-4 py-2 rounded-full font-semibold ${tab === 'resenas' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-900'}`} onClick={() => setTab('resenas')}>Reseñas</button>
            <button className={`px-4 py-2 rounded-full font-semibold ${tab === 'config' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-900'}`} onClick={() => setTab('config')}>Configuración</button>
          </div>
          {tab === 'profesional' && (
            <div>
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><FaUserTie /> Información Profesional</h3>
              <div className="mb-2 text-blue-800">{user.descripcion}</div>
              <div className="mb-2 flex flex-wrap gap-2">
                {especialidades.map((e, i) => (
                  <span key={i} className="bg-blue-100 px-3 py-1 rounded-full text-blue-900 text-sm">{e.trim()}</span>
                ))}
              </div>
              <div className="mb-2 flex items-center gap-2">
                <FaStar className="text-yellow-500" /> <span className="font-bold">{user.calificacion_promedio?.toFixed?.(1) || '0.0'}</span>
                <span className="text-blue-700">({user.total_reseñas || user.total_reseñas || 0} reseñas)</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <FaBoxOpen /> <span className="text-blue-700">{productos.length} productos publicados</span>
              </div>
            </div>
          )}
          {tab === 'productos' && (
            <div>
              <Link href="/productos/crear" className="inline-flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-full font-semibold mb-3">
                <FaPlus /> Publicar producto
              </Link>
              <Link href="/artesano-dashboard/productos" className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 px-4 py-2 rounded-full font-semibold mb-4 ml-2">
                <FaStore /> Gestionar mis productos
              </Link>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {productos.map(p => (
                  <div key={p.id} className="bg-white border border-blue-100 rounded-xl p-3 shadow-sm">
                    <img src={p.imageUrl || '/default-artesania.png'} alt={p.title} className="h-24 w-full object-cover rounded mb-2" />
                    <div className="font-bold text-blue-900">{p.title || p.titulo}</div>
                    <div className="text-blue-700 text-sm">{p.description}</div>
                    <div className="text-blue-800 font-semibold mt-1">${p.price}</div>
                  </div>
                ))}
                {productos.length === 0 && <div className="text-blue-700">No hay productos.</div>}
              </div>
            </div>
          )}
          {tab === 'resenas' && (
            <div className="text-blue-700">
              {resenas.length === 0 && <div>No hay reseñas.</div>}
              {resenas.map(r => (
                <div key={r.id} className="border-b border-blue-100 py-2">
                  <div className="font-bold text-blue-900">Producto {r.productId}</div>
                  <div>Calificación: {r.rating}</div>
                  <div>{r.comment}</div>
                </div>
              ))}
            </div>
          )}
          {tab === 'config' && (
            <div className="flex flex-col gap-2 text-blue-800">
              <Link href="/perfil/editar" className="text-blue-700 underline inline-flex items-center gap-2"><FaEdit /> Editar perfil</Link>
              <Link href="/perfil/cambiar-clave" className="text-blue-700 underline inline-flex items-center gap-2"><FaKey /> Cambiar contraseña</Link>
              <button onClick={handleLogout} className="text-red-600 underline inline-flex items-center gap-2"><FaSignOutAlt /> Cerrar sesión</button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-bold text-blue-900 mb-2">Mensajes recibidos</h3>
          {mensajes.length === 0 && <div className="text-blue-700">No tienes mensajes nuevos.</div>}
          {mensajes.map(m => (
            <div key={m.id} className="border-b border-blue-100 py-2">
              <div className="font-bold text-blue-900">De: {m.fromUserId}</div>
              <div>{m.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
