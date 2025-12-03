'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { API_URL } from '@/services/api'

const CATEGORIES = ['Ceramica', 'Textiles', 'Madera', 'Joyeria', 'Pintura', 'Cuero', 'Otros']

export default function EditarPerfil() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUser(res.data)
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      })
  }, [])

  const handleChange = (e: any) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      setUser({ ...user, foto_perfil: file, foto_preview: preview });
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const foto = user.foto_perfil;
    const payload: any = {
      name: user.nombre_completo || user.name,
      email: user.correo || user.email,
      role: user.rol || user.role,
      especialidades: user.especialidades || '',
      telefono: user.telefono || user.Telefono,
      ciudad: user.ciudad || user.Ciudad,
      pais: user.pais || user.Pais,
      descripcion: user.descripcion || user.Descripcion
    };
    // El backend espera string en fotoPerfil; si es File/Blob no lo enviamos
    if (foto && typeof foto === 'string') {
      payload.fotoPerfil = foto;
    }
    await axios.put(`${API_URL}/users/${user.id}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // refresca datos desde backend para que el perfil los muestre actualizados
    const refreshed = await axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(refreshed.data);
    localStorage.setItem('user', JSON.stringify(refreshed.data));
    setMsg('Perfil actualizado correctamente');
    // redirige al perfil
    router.push('/perfil');
  }

  if (loading) return <div className="p-8">Cargando...</div>
  if (!user) return null

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Editar Perfil</h2>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="w-24 h-24 rounded-full border border-blue-200 overflow-hidden bg-white shadow">
            <img src={user.foto_preview || user.foto_perfil || '/default-avatar.png'} alt="Foto perfil" className="w-full h-full object-cover" />
          </div>
          <input type="file" name="foto_perfil" accept="image/*" onChange={handleFileChange} />
        </div>
        <input name="nombre_completo" value={user.nombre_completo || ''} onChange={handleChange} placeholder="Nombre completo" className="border px-2 py-1" />
        <input name="correo" value={user.correo || ''} onChange={handleChange} placeholder="Correo" className="border px-2 py-1" />
        <input name="telefono" value={user.telefono || ''} onChange={handleChange} placeholder="Teléfono" className="border px-2 py-1" />
        <input name="ciudad" value={user.ciudad || ''} onChange={handleChange} placeholder="Ciudad" className="border px-2 py-1" />
        <input name="pais" value={user.pais || ''} onChange={handleChange} placeholder="País" className="border px-2 py-1" />
        <label className="text-blue-800 font-semibold">Rol</label>
        <select name="rol" value={user.rol || ''} onChange={handleChange} className="border px-2 py-1">
          <option value="cliente">Cliente</option>
          <option value="artesano">Artesano</option>
        </select>
        {user.rol === 'artesano' && (
          <>
            <textarea name="descripcion" value={user.descripcion || ''} onChange={handleChange} placeholder="Descripción" className="border px-2 py-1" />
            <label className="text-blue-800 font-semibold">Especialidad principal</label>
            <select name="especialidades" value={user.especialidades || ''} onChange={handleChange} className="border px-2 py-1">
              <option value="">Selecciona categoría</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </>
        )}
        <button onClick={handleSave} className="bg-blue-700 text-white px-4 py-2 rounded">Guardar cambios</button>
        {msg && <div className="text-green-700 mt-2">{msg}</div>}
      </div>
    </div>
  )
}
