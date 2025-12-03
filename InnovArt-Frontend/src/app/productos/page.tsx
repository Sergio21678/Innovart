'use client';

// 1. IMPORTAR SUSPENSE
import { useEffect, useMemo, useState, Suspense } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FaSearch, FaPlus, FaBoxOpen, FaTag, FaMapMarkerAlt } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';
import { API_URL } from '../../services/api';
import StatusMessage from '../../components/StatusMessage';

const CATEGORIES = ['Ceramica', 'Textiles', 'Madera', 'Joyeria', 'Pintura', 'Cuero', 'Otros'];
const normalize = (s: string | null | undefined) => (s || '').toString().trim().toLowerCase();

// 2. CAMBIAMOS EL NOMBRE Y QUITAMOS "export default"
function ContenidoProductos() {
  const [productos, setProductos] = useState<any[]>([]);
  const [categoria, setCategoria] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Aquí es donde ocurría el error antes
  const searchParams = useSearchParams();

  const fetchProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/products`);
      const productosMapeados = res.data.map((p: any) => ({
        id: p.id,
        titulo: p.title || p.titulo,
        descripcion: p.description || p.descripcion,
        precio: p.price ?? p.precio ?? 0,
        imagen: p.imageUrl || p.image || p.imagen || '/default-artesania.png',
        categoria: p.category || p.categoria || 'Sin categoria',
        ubicacion: p.location || p.ubicacion || '',
        usuarioId: p.usuarioId || p.userId
      }));
      setProductos(productosMapeados);
    } catch (err: any) {
      console.error('Error loading products:', err);
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        setError('Error de conexion. Verifica que el backend este corriendo en http://localhost:5000');
      } else {
        setError(err.response?.data?.error || 'Error al cargar productos. Verifica que el backend este corriendo.');
      }
    }
    setLoading(false);
  };

  useEffect(() => { 
    const catFromUrl = searchParams.get('categoria');
    if (catFromUrl) setCategoria(catFromUrl);
    fetchProductos(); 
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      const matchCat = categoria ? normalize(p.categoria) === normalize(categoria) : true;
      const matchUbi = ubicacion ? normalize(p.ubicacion).includes(normalize(ubicacion)) : true;
      return matchCat && matchUbi;
    });
  }, [productos, categoria, ubicacion]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-100 to-blue-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-900 flex items-center gap-3">
            <FaBoxOpen className="text-blue-700" /> Productos disponibles
          </h2>
          <Link href="/productos/crear" className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded font-semibold flex items-center gap-2">
            <FaPlus /> Nuevo producto
          </Link>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
          <div className="flex gap-2 items-center">
            <FaTag className="text-blue-400" />
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="border rounded px-2 py-1">
              <option value="">Todas las categorias</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <FaMapMarkerAlt className="text-blue-400" />
            <input
              type="text"
              placeholder="Ubicacion"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <button onClick={fetchProductos} className="bg-blue-700 text-white px-4 py-1 rounded flex items-center gap-2">
            <FaSearch /> Actualizar
          </button>
          <Link href="/categorias" className="text-blue-700 underline text-sm">Ver catalogo de categorias</Link>
        </div>

        <StatusMessage loading={loading} error={error}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {productosFiltrados.length === 0 ? (
              <div className="col-span-full text-blue-700 text-center py-8">No hay productos para mostrar.</div>
            ) : (
              <>
                {productosFiltrados.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center transition-transform transform hover:scale-105">
                    <img src={p.imagen || '/default-artesania.png'} alt={p.titulo} className="h-32 w-full object-cover rounded mb-2" />
                    <div className="font-bold text-blue-900 text-lg">{p.titulo}</div>
                    <div className="text-blue-800 text-sm mb-1">{p.descripcion}</div>
                    <div className="flex items-center gap-2 text-blue-700 mb-1">
                      <FaTag /> <span>{p.categoria || 'Sin categoria'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-700 mb-1">
                      <FaMapMarkerAlt /> <span>{p.ubicacion || 'Sin ubicacion'}</span>
                    </div>
                    <div className="text-blue-900 font-bold text-lg mb-2">${p.precio}</div>
                    <Link href={`/productos/${p.id}`} className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-1 rounded font-semibold transition">Ver mas</Link>
                  </div>
                ))}
              </>
            )}
          </div>
        </StatusMessage>
      </div>
    </div>
  );
}

// 3. NUEVO COMPONENTE QUE ENVUELVE (ESTE SE EXPORTA)
export default function ProductosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-blue-700 text-xl font-bold">Cargando productos...</div>}>
      <ContenidoProductos />
    </Suspense>
  );
}