'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { API_URL } from '@/services/api';
import { FaMapMarkerAlt, FaStar, FaBoxOpen } from 'react-icons/fa';
import Link from 'next/link';

type Artesano = {
  id: number;
  name?: string;
  descripcion?: string;
  especialidades?: string;
  ciudad?: string;
  pais?: string;
  fotoPerfil?: string;
};

type Producto = {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  price: number;
  category?: string;
  location?: string;
};

export default function ArtesanoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const artesanoId = params?.id ? Number(params.id) : null;

  const [artesano, setArtesano] = useState<Artesano | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!artesanoId || Number.isNaN(artesanoId)) {
      router.replace('/artesanos');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [userRes, prodRes] = await Promise.all([
          axios.get(`${API_URL}/users/${artesanoId}`),
          axios.get(`${API_URL}/products?usuarioId=${artesanoId}`)
        ]);

        setArtesano({
          id: userRes.data.id ?? userRes.data.Id,
          name: userRes.data.name ?? userRes.data.Nombre ?? userRes.data.nombre_completo,
          descripcion: userRes.data.descripcion ?? userRes.data.Descripcion,
          especialidades: userRes.data.especialidades,
          ciudad: userRes.data.ciudad,
          pais: userRes.data.pais,
          fotoPerfil: userRes.data.fotoPerfil ?? userRes.data.foto_perfil
        });

        const mapped = (prodRes.data || []).map((p: any) => ({
          id: p.id,
          title: p.title || p.titulo,
          description: p.description || p.descripcion,
          imageUrl: p.imageUrl || p.imagen || '/default-artesania.png',
          price: p.price ?? 0,
          category: p.category || p.categoria,
          location: p.location || p.ubicacion
        }));
        setProductos(mapped);
      } catch (err: any) {
        console.error('Error loading artesano:', err);
        setError('No se pudo cargar la información del artesano.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [artesanoId, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-blue-800">Cargando artesano...</div>;
  if (error || !artesano) return <div className="min-h-screen flex items-center justify-center text-red-600">{error || 'Artesano no encontrado'}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-100 to-blue-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/95 rounded-2xl shadow-xl p-6 flex flex-col lg:flex-row gap-6">
          <div className="flex flex-col items-center lg:items-start gap-3 w-full lg:w-1/3">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow">
              <img
                src={artesano.fotoPerfil || '/default-profile.png'}
                alt={artesano.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold text-blue-900 text-center lg:text-left">{artesano.name}</h1>
            <div className="flex items-center gap-2 text-blue-700">
              <FaMapMarkerAlt />
              <span>{[artesano.ciudad, artesano.pais].filter(Boolean).join(', ') || 'Sin ubicación'}</span>
            </div>
            {artesano.especialidades && (
              <div className="flex flex-wrap gap-2 text-sm text-blue-800">
                {artesano.especialidades.split(',').map((e, i) => (
                  <span key={i} className="bg-blue-100 px-3 py-1 rounded-full">{e.trim()}</span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 text-yellow-500">
              <FaStar /> <span className="text-blue-900">Calificaciones próximamente</span>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold text-blue-900 mb-2">Sobre el artesano</h2>
            <p className="text-blue-800 mb-4 whitespace-pre-line">
              {artesano.descripcion || 'Sin descripción disponible.'}
            </p>
            <h2 className="text-xl font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <FaBoxOpen className="text-blue-600" /> Productos publicados
            </h2>
            {productos.length === 0 ? (
              <div className="text-blue-700">Aún no tiene productos publicados.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {productos.map(p => (
                  <div key={p.id} className="bg-white rounded-xl shadow p-4 flex flex-col">
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100 mb-3">
                      <img src={p.imageUrl || '/default-artesania.png'} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="font-bold text-blue-900 text-lg mb-1">{p.title}</div>
                    <div className="text-blue-800 text-sm line-clamp-2 mb-2">{p.description}</div>
                    <div className="text-blue-700 text-sm mb-1">{p.category || 'Sin categoría'}</div>
                    <div className="text-blue-700 text-sm mb-2">{p.location || 'Sin ubicación'}</div>
                    <div className="text-blue-900 font-bold mb-3">${p.price}</div>
                    <Link href={`/productos/${p.id}`} className="mt-auto bg-blue-700 hover:bg-blue-800 text-white text-center py-2 rounded">Ver producto</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

