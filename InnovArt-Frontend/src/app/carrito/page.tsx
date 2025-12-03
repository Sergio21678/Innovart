'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '@/services/api'

export default function CarritoPage() {
  const [carrito, setCarrito] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setCarrito([])
      setLoading(false)
      return
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) {
      setCarrito([])
      setLoading(false)
      return
    }
    
    // Obtener pedidos del usuario (carrito = pedidos pendientes)
    axios.get(`${API_URL}/pedidos?userId=${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        // Filtrar pedidos pendientes (carrito)
        const carritoItems = res.data
          .filter((p: any) => !p.status || p.status.toLowerCase() === 'pendiente')
          .map((p: any) => ({
            id: p.id,
            nombre: `Pedido #${p.id}`,
            precio: 0, // Necesitarías obtener el precio del producto asociado
            cantidad: 1
          }))
        setCarrito(carritoItems)
        setLoading(false)
      })
      .catch((err: any) => {
        console.error('Error loading carrito:', err)
        if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
          console.error('Error de conexión. Verifica que el backend esté corriendo.')
        }
        setCarrito([])
        setLoading(false)
      })
  }, [])

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

  const eliminar = async (id: number) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/pedidos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCarrito(carrito.filter(i => i.id !== id))
    } catch (err: any) {
      console.error('Error deleting item:', err)
      alert('Error al eliminar el item del carrito')
    }
  }

  if (loading) return <div className="p-8">Cargando...</div>

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Carrito de Compras</h2>
      {carrito.length === 0 ? (
        <div className="text-blue-700">Tu carrito está vacío.</div>
      ) : (
        <>
          <div className="grid gap-4">
            {carrito.map((item) => (
              <div key={item.id} className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center transition-transform transform hover:scale-105">
                <div>
                  <div className="font-semibold text-blue-900">{item.nombre}</div>
                  <div className="text-gray-700">Cantidad: {item.cantidad}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-900">${item.precio * item.cantidad}</div>
                  <button onClick={() => eliminar(item.id)} className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-lg font-bold text-blue-900">Total: ${total}</div>
          <button className="mt-6 bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition-colors">
            Proceder al pago
          </button>
        </>
      )}
      <div className="mt-8 text-blue-700">
        <b>¿Cómo funciona?</b> Agrega productos desde la galería o perfil de artesanos y vuelve aquí para finalizar tu compra.
      </div>
    </div>
  )
}
