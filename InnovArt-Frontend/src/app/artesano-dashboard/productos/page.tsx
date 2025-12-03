'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '@/services/api'

const CATEGORIES = ['Ceramica', 'Textiles', 'Madera', 'Joyeria', 'Pintura', 'Cuero', 'Otros']

export default function MisProductos() {
  const [productos, setProductos] = useState<any[]>([])
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [categoria, setCategoria] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [editId, setEditId] = useState<number | null>(null)

  const fetchProductos = async () => {
    try {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const res = await axios.get(`${API_URL}/products`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: user.id ? { usuarioId: user.id } : {}
      })
      const productosMapeados = res.data.map((p: any) => ({
        ...p,
        titulo: p.title || p.titulo,
        descripcion: p.description || p.descripcion,
        precio: p.price || p.precio,
        categoria: p.category || p.categoria || '',
        ubicacion: p.location || p.ubicacion || ''
      }))
      setProductos(productosMapeados)
    } catch (err: any) {
      console.error('Error loading products:', err)
      alert('Error al cargar productos. Verifica que el backend este corriendo.')
    }
  }

  useEffect(() => { fetchProductos() }, [])

  const handleCrear = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Debes iniciar sesion para crear productos')
      return
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    await axios.post(`${API_URL}/products`, {
      title: titulo,
      description: descripcion,
      price: parseFloat(precio) || 0,
      category: categoria,
      location: ubicacion,
      usuarioId: user.id || user.Id || 0
    }, { headers: { Authorization: `Bearer ${token}` } })
    setTitulo('')
    setDescripcion('')
    setPrecio('')
    setCategoria('')
    setUbicacion('')
    fetchProductos()
  }

  const handleEditar = (p: any) => {
    setEditId(p.id)
    setTitulo(p.titulo)
    setDescripcion(p.descripcion)
    setPrecio(p.precio)
    setCategoria(p.categoria || '')
    setUbicacion(p.ubicacion || '')
  }

  const handleActualizar = async () => {
    const token = localStorage.getItem('token')
    if (!token || !editId) return
    await axios.put(`${API_URL}/products/${editId}`, {
      title: titulo,
      description: descripcion,
      price: parseFloat(precio) || 0,
      category: categoria,
      location: ubicacion
    }, { headers: { Authorization: `Bearer ${token}` } })
    setEditId(null)
    setTitulo('')
    setDescripcion('')
    setPrecio('')
    setCategoria('')
    setUbicacion('')
    fetchProductos()
  }

  const handleEliminar = async (id: number) => {
    const token = localStorage.getItem('token')
    await axios.delete(`${API_URL}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchProductos()
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Mis Productos</h2>
      <div className="mb-4 flex flex-col gap-2">
        <input placeholder="Titulo" value={titulo} onChange={e => setTitulo(e.target.value)} className="border px-2 py-1" />
        <input placeholder="Descripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)} className="border px-2 py-1" />
        <input placeholder="Precio" type="number" value={precio} onChange={e => setPrecio(e.target.value)} className="border px-2 py-1" />
        <select value={categoria} onChange={e => setCategoria(e.target.value)} className="border px-2 py-1">
          <option value="">Selecciona categoria</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input placeholder="Ubicacion" value={ubicacion} onChange={e => setUbicacion(e.target.value)} className="border px-2 py-1" />
        {editId ? (
          <button onClick={handleActualizar} className="bg-blue-700 text-white px-4 py-2 rounded">Actualizar</button>
        ) : (
          <button onClick={handleCrear} className="bg-blue-700 text-white px-4 py-2 rounded">Crear producto</button>
        )}
      </div>
      <ul>
        {productos.map(p => (
          <li key={p.id} className="mb-2 flex justify-between items-center">
            <span>{p.titulo} - ${p.precio} ({p.categoria || 'Sin categoria'})</span>
            <span>
              <button onClick={() => handleEditar(p)} className="text-blue-700 mr-2">Editar</button>
              <button onClick={() => handleEliminar(p.id)} className="text-red-600">Eliminar</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
