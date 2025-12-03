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
    if (!token) {
      router.replace('/login')
      return
    }
    axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const u = res.data
        setUser({
          id: u.id ?? u.Id,
          name: u.name ?? u.Nombre ?? u.nombre_completo,
          email: u.email ?? u.Email,
          role: (u.role ?? u.rol ?? '').toLowerCase(),
          especialidades: u.especialidades ?? '',
          telefono: u.telefono ?? u.Telefono ?? '',
          ciudad: u.ciudad ?? u.Ciudad ?? '',
          pais: u.pais ?? u.Pais ?? '',
          descripcion: u.descripcion ?? u.Descripcion ?? '',
          foto: u.fotoPerfil ?? u.foto_perfil ?? ''
        })
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          router.replace('/login')
        }
      })
  }, [router])

  const handleChange = (e: any) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      setUser({ ...user, foto: preview });
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    const payload: any = {
      name: user.name,
      especialidades: user.role === 'artesano' ? user.especialidades : '',
      telefono: user.telefono,
      ciudad: user.ciudad,
      pais: user.pais,
      descripcion: user.descripcion
    };
    if (user.foto && typeof user.foto === 'string') {
      payload.fotoPerfil = user.foto;
    }

    await axios.put(`${API_URL}/users/${user.id}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const refreshed = await axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    localStorage.setItem('user', JSON.stringify({
      id: refreshed.data.id ?? refreshed.data.Id,
      email: refreshed.data.email ?? refreshed.data.Email,
      name: refreshed.data.name ?? refreshed.data.Name,
      role: refreshed.data.role ?? refreshed.data.Role
    }));
    window.dispatchEvent(new Event('auth-changed'));
    setMsg('Perfil actualizado correctamente');
    router.push('/perfil');
  }

  if (loading) return <div className="p-8">Cargando...</div>
  if (!user) return null

  return (
    <div className="p-8 max-w-xl mx-auto bg-white/90 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Editar Perfil</h2>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="w-24 h-24 rounded-full border border-blue-200 overflow-hidden bg-white shadow">
            <img src={user.foto || '/default-avatar.png'} alt="Foto perfil" className="w-full h-full object-cover" />
          </div>
          <input type="file" name="foto_perfil" accept="image/*" onChange={handleFileChange} />
        </div>
        <input name="name" value={user.name || ''} onChange={handleChange} placeholder="Nombre completo" className="border px-2 py-2 rounded" />
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Correo (solo lectura)</label>
          <input
            value={user.email || ''}
            readOnly
            disabled
            className="border px-2 py-2 rounded bg-gray-100 cursor-not-allowed text-gray-600"
          />
        </div>
        <div className="flex items-center justify-between bg-blue-50 text-blue-900 px-3 py-2 rounded">
          <span className="font-semibold">Rol</span>
          <span className="px-3 py-1 rounded-full bg-blue-700 text-white text-sm capitalize">{user.role}</span>
        </div>
        <input name="telefono" value={user.telefono || ''} onChange={handleChange} placeholder="Teléfono" className="border px-2 py-2 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="ciudad" value={user.ciudad || ''} onChange={handleChange} placeholder="Ciudad" className="border px-2 py-2 rounded" />
          <input name="pais" value={user.pais || ''} onChange={handleChange} placeholder="País" className="border px-2 py-2 rounded" />
        </div>
        {user.role === 'artesano' && (
          <>
            <textarea name="descripcion" value={user.descripcion || ''} onChange={handleChange} placeholder="Descripción" className="border px-2 py-2 rounded" />
            <label className="text-blue-800 font-semibold">Especialidad principal</label>
            <select name="especialidades" value={user.especialidades || ''} onChange={handleChange} className="border px-2 py-2 rounded">
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
