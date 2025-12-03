'use client'
import { useState } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { FaPlus, FaBoxOpen, FaTag, FaDollarSign, FaImage, FaMapMarkerAlt } from 'react-icons/fa'
import { API_URL } from '@/services/api'

const CATEGORIES = ['Ceramica', 'Textiles', 'Madera', 'Joyeria', 'Pintura', 'Cuero', 'Otros']

export default function CrearProductoPage() {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [categoria, setCategoria] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()

  const handleCrear = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setMsg(null)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Debes iniciar sesion para crear productos')
        return
      }
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      await axios.post(`${API_URL}/products`, {
        title: nombre,
        description: descripcion,
        price: parseFloat(precio) || 0,
        category: categoria,
        location: ubicacion,
        usuarioId: user.id || user.Id || 1
      }, { headers: { Authorization: `Bearer ${token}` } })
      setMsg('Producto creado correctamente')
      setTimeout(() => router.push('/productos'), 800)
    } catch (err: any) {
      console.error('Error creating product:', err)
      if (err.response?.status === 401) {
        setError('Sesión expirada o no autorizada. Inicia sesión nuevamente.')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.dispatchEvent(new Event('auth-changed'))
        router.push('/login')
        return
      }
      setError(err.response?.data?.error || 'Error al crear producto')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-100 to-blue-200">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 flex items-center gap-3">
          <FaPlus className="text-blue-700" /> Crear nuevo producto
        </h2>
        <div className="bg-white/95 rounded-xl shadow p-6">
          <form className="flex flex-col gap-3" onSubmit={handleCrear}>
            <div className="flex gap-2 items-center">
              <FaBoxOpen className="text-blue-400" />
              <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="border rounded px-2 py-1 flex-1" required />
            </div>
            <div className="flex gap-2 items-center">
              <FaImage className="text-blue-400" />
              <input
                type="file"
                accept="image/*"
                onChange={e => setFile((e.target.files && e.target.files[0]) || null)}
                className="border rounded px-2 py-1 flex-1"
              />
            </div>
            <div className="flex gap-2 items-center">
              <FaTag className="text-blue-400" />
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="border rounded px-2 py-1 flex-1" required>
                <option value="">Selecciona una categoria</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <FaMapMarkerAlt className="text-blue-400" />
              <input placeholder="Ubicacion" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} className="border rounded px-2 py-1 flex-1" />
            </div>
            <div className="flex gap-2 items-center">
              <FaDollarSign className="text-blue-400" />
              <input placeholder="Precio" type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} className="border rounded px-2 py-1 flex-1" min={0} required />
            </div>
            <textarea placeholder="Descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="border rounded px-2 py-1" rows={3} required />
            <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded font-semibold flex items-center gap-2 mt-2">
              <FaPlus /> Crear producto
            </button>
          </form>
          {error && <div className="text-red-600 mt-3">{error}</div>}
          {msg && <div className="text-green-700 mt-3">{msg}</div>}
        </div>
      </div>
    </div>
  )
}
