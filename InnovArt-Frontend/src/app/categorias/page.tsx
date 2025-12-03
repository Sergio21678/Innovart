'use client'
import Link from 'next/link'

const CATEGORIES = ['Ceramica', 'Textiles', 'Madera', 'Joyeria', 'Pintura', 'Cuero', 'Otros']

export default function CategoriasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-100 to-blue-200">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Categorias disponibles</h1>
        <p className="text-blue-800 mb-4">Elige una categoria para filtrar productos. Luego vuelve a la pagina de productos.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map(cat => (
            <div key={cat} className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
              <div className="text-xl font-semibold text-blue-900">{cat}</div>
              <div className="text-sm text-blue-700">Explora artesanias de la categoria {cat}.</div>
              <Link href={`/productos?categoria=${encodeURIComponent(cat)}`} className="text-blue-700 underline font-semibold">Ver productos</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
