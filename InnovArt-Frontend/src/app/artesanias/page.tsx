'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/services/api';

export default function Artesanias() {
  const [resenas, setResenas] = useState<any[]>([]);
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState('');
  const [productoId, setProductoId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchResenas = async () => {
    try {
      const res = await axios.get(`${API_URL}/reviews`);
      // Mapear campos del backend
      const resenasMapeadas = res.data.map((r: any) => ({
        ...r,
        comentario: r.comment || r.comentario,
        calificacion: r.rating || r.calificacion,
        clienteId: r.userId || r.clienteId,
        productoId: r.productId || r.productoId
      }));
      setResenas(resenasMapeadas);
      setError(null);
    } catch (err: any) {
      console.error('Error loading reviews:', err);
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        setError('Error de conexión. Verifica que el backend esté corriendo.');
      } else {
        setError('Error al cargar reseñas.');
      }
    }
  };

  const handleCrear = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión para crear reseñas');
        return;
      }
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!productoId || !calificacion) {
        alert('Completa todos los campos requeridos');
        return;
      }
      await axios.post(`${API_URL}/reviews`, {
        productId: parseInt(productoId),
        userId: user.id || 1,
        rating: parseInt(calificacion),
        comment: comentario
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComentario('');
      setCalificacion('');
      setProductoId('');
      fetchResenas();
    } catch (err: any) {
      console.error('Error creating review:', err);
      alert('Error al crear reseña. Verifica que el backend esté corriendo.');
    }
  };

  useEffect(() => { fetchResenas(); }, []);

  return (
    <div className="p-5">
      <h2>Reseñas</h2>
      <div>
        <input placeholder="Producto ID" value={productoId} onChange={e => setProductoId(e.target.value)} required />
        <input placeholder="Calificación (1-5)" type="number" min="1" max="5" value={calificacion} onChange={e => setCalificacion(e.target.value)} required />
        <input placeholder="Comentario" value={comentario} onChange={e => setComentario(e.target.value)} />
        <button onClick={handleCrear}>Crear reseña</button>
      </div>
      {error && <div className="text-red-700 mb-4">{error}</div>}
      <ul>
        {resenas.map(r => (
          <li key={r.id} className="mb-2">
            {r.comentario || r.comment} - {r.calificacion || r.rating} estrellas 
            {r.productoId && ` (Producto ${r.productoId || r.productId})`}
            {r.clienteId && ` (Usuario ${r.clienteId || r.userId})`}
          </li>
        ))}
      </ul>
    </div>
  );
}