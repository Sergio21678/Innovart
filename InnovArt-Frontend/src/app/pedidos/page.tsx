'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/services/api';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [clienteId, setClienteId] = useState('');
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState('');

  const fetchPedidos = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/pedidos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Mapear campos del backend
      const pedidosMapeados = res.data.map((p: any) => ({
        ...p,
        clienteId: p.userId || p.clienteId,
        estado: p.status || p.estado
      }));
      setPedidos(pedidosMapeados);
    } catch (err: any) {
      console.error('Error loading orders:', err);
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        alert('Error de conexión. Verifica que el backend esté corriendo.');
      }
    }
  };

  const handleCrear = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión para crear pedidos');
        return;
      }
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await axios.post(`${API_URL}/pedidos`, {
        userId: parseInt(clienteId) || user.id || 1,
        status: 'pendiente'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClienteId('');
      setProductoId('');
      setCantidad('');
      fetchPedidos();
    } catch (err: any) {
      console.error('Error creating order:', err);
      alert('Error al crear pedido. Verifica que el backend esté corriendo.');
    }
  };

  useEffect(() => { fetchPedidos(); }, []);

  return (
    <div className="p-5">
      <h2>Pedidos</h2>
      <div>
        <input placeholder="Cliente ID" value={clienteId} onChange={e => setClienteId(e.target.value)} />
        <input placeholder="Producto ID" value={productoId} onChange={e => setProductoId(e.target.value)} />
        <input placeholder="Cantidad" type="number" value={cantidad} onChange={e => setCantidad(e.target.value)} />
        <button onClick={handleCrear}>Crear pedido</button>
      </div>
      <ul>
        {pedidos.map(p => (
          <li key={p.id}>Pedido #{p.id} - Cliente {p.clienteId || p.userId} - Estado: {p.estado || p.status || 'pendiente'}</li>
        ))}
      </ul>
    </div>
  );
}
