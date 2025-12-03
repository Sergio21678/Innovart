'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '@/services/api'

export default function PedidosArtesano() {
  const [pedidos, setPedidos] = useState<any[]>([])

  const fetchPedidos = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API_URL}/pedidos`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // Mapear campos del backend
      const pedidosMapeados = res.data.map((p: any) => ({
        ...p,
        estado: p.status || p.estado,
        clienteId: p.userId || p.clienteId,
        productoId: p.productId || p.productoId
      }))
      setPedidos(pedidosMapeados)
    } catch (err: any) {
      console.error('Error loading orders:', err)
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        alert('Error de conexión. Verifica que el backend esté corriendo.')
      }
    }
  }

  const actualizarEstado = async (id: number, estado: string) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${API_URL}/pedidos/${id}`, { status: estado }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchPedidos()
    } catch (err: any) {
      console.error('Error updating order:', err)
      alert('Error al actualizar el pedido')
    }
  }

  useEffect(() => { fetchPedidos() }, [])

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Pedidos Recibidos</h2>
      <ul>
        {pedidos.map(p => (
          <li key={p.id} className="mb-2 flex justify-between items-center">
            <span>Pedido #{p.id} - Cliente {p.clienteId || p.userId} - Estado: {p.estado || p.status || 'pendiente'}</span>
            <span>
              {p.estado !== 'completado' && (
                <>
                  <button onClick={() => actualizarEstado(p.id, 'enviado')} className="text-blue-700 mr-2">Marcar Enviado</button>
                  <button onClick={() => actualizarEstado(p.id, 'completado')} className="text-green-700">Finalizar</button>
                </>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
