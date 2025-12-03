'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import { FaClipboardList, FaStar, FaComments, FaChevronRight, FaCog, FaEdit, FaKey, FaSignOutAlt } from 'react-icons/fa'
import { API_URL } from '@/services/api'

export default function PerfilCliente() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('actividad')
  const [pedidos, setPedidos] = useState<any[]>([])
  const [resenas, setResenas] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
      return
    }
    axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const role = res.data.role ?? res.data.rol
      if (role === 'cliente') {
        setUser({
          ...res.data,
          telefono: res.data.telefono || res.data.Telefono,
          ciudad: res.data.ciudad || res.data.Ciudad,
          pais: res.data.pais || res.data.Pais,
          descripcion: res.data.descripcion || res.data.Descripcion
        })
        setLoading(false)
      } else {
        router.replace('/perfil')
      }
    }).catch(() => {
      setLoading(false)
      setUser(null)
      router.replace('/login')
    })
  }, [router])

  useEffect(() => {
    if (user?.id) {
      const token = localStorage.getItem('token')
      axios.get(`${API_URL}/pedidos`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setPedidos(res.data || []))
      // Cambia esto:
      // axios.get('http://3.148.112.19:3001/api/resenas?clienteId=' + user.id)
      // Por esto:
      axios.get(`${API_URL}/reviews?clienteId=${user.id}`)
        .then(res => setResenas(res.data))
        .catch(() => setResenas([]))
    }
  }, [user])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.replace('/login')
  }

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]">Cargando perfil...</div>
  if (!user) return null

  return (
    <div className="flex flex-col items-center py-8 bg-gradient-to-br from-white via-sky-100 to-blue-200 min-h-[60vh]">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Mi Perfil</h1>
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center mb-6 w-full max-w-xl">
          <img
            src={
              user.foto_perfil
                ? user.foto_perfil.startsWith('http')
                  ? user.foto_perfil
                  : `${API_URL.replace('/api', '')}${user.foto_perfil}`
                : '/default-profile.png'
            }
            alt="Foto de perfil"
            className="h-32 w-32 rounded-full object-cover"
          />
          <h2 className="text-2xl font-bold text-blue-900 mb-1">{user.nombre_completo}</h2>
          <div className="text-blue-700 mb-1">{user.correo}</div>
          <div className="text-blue-700 mb-1">{user.telefono || <span className="italic text-gray-400">Sin teléfono</span>}</div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <button className={`px-4 py-2 rounded-full font-semibold ${tab === 'actividad' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-900'}`} onClick={() => setTab('actividad')}>Actividad</button>
            <button className={`px-4 py-2 rounded-full font-semibold ${tab === 'resenas' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-900'}`} onClick={() => setTab('resenas')}>Mis Reseñas</button>
            <button className={`px-4 py-2 rounded-full font-semibold ${tab === 'chat' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-900'}`} onClick={() => setTab('chat')}>Chats</button>
            <button className={`px-4 py-2 rounded-full font-semibold ${tab === 'config' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-900'}`} onClick={() => setTab('config')}>Configuración</button>
          </div>
          {tab === 'actividad' && (
            <div>
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><FaClipboardList /> Historial de Compras</h3>
              {pedidos.length === 0 ? (
                <div className="text-blue-700">No has realizado compras aún.</div>
              ) : (
                <ul>
                  {pedidos.map(p => (
                    <li key={p.id} className="mb-2 flex items-center gap-3">
                      <img src={p.producto?.imagen || '/default-artesania.png'} alt={p.producto?.titulo} className="h-10 w-10 rounded object-cover" />
                      <span className="font-semibold">{p.producto?.titulo}</span>
                      <span className="text-blue-700">x{p.cantidad}</span>
                      <span className="text-gray-700">{p.estado}</span>
                      <span className="text-xs text-gray-500">{new Date(p.fecha).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {tab === 'resenas' && (
            <div>
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><FaStar /> Reseñas que has dejado</h3>
              {resenas.length === 0 ? (
                <div className="text-blue-700">No has dejado reseñas aún.</div>
              ) : (
                <ul>
                  {resenas.map(r => (
                    <li key={r.id} className="mb-2">
                      <span className="font-semibold">{r.artesano?.nombre_completo || r.producto?.titulo}</span>
                      <span className="ml-2 text-yellow-600">{'★'.repeat(r.calificacion)}</span>
                      <span className="ml-2 text-blue-800 italic">"{r.comentario}"</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {tab === 'chat' && (
            <div>
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><FaComments /> Chats recientes</h3>
              <Link href="/mensajes" className="text-blue-700 underline flex items-center gap-2">Ir a mensajes <FaChevronRight /></Link>
            </div>
          )}
          {tab === 'config' && (
            <div>
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><FaCog /> Configuración</h3>
              <Link href="/perfil/editar" className="block mb-2 text-blue-700 underline flex items-center gap-2"><FaEdit /> Editar información</Link>
              <Link href="/recuperar-contrasena" className="block mb-2 text-blue-700 underline flex items-center gap-2"><FaKey /> Cambiar contraseña</Link>
              <button onClick={handleLogout} className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2"><FaSignOutAlt /> Cerrar sesión</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
