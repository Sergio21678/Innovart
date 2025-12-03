'use client'
import { useState } from 'react'

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState([
    { id: 1, nombre: 'Jarrón de cerámica' },
    { id: 2, nombre: 'Artesano: María López' }
  ])

  const eliminar = (id: number) => setFavoritos(favoritos.filter(f => f.id !== id))

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Favoritos</h2>
      {favoritos.length === 0 ? (
        <div className="text-blue-700">No tienes productos ni artesanos favoritos.</div>
      ) : (
        <ul>
          {favoritos.map((item) => (
            <li key={item.id} className="mb-2 flex justify-between items-center">
              <div className="p-4 border rounded-lg shadow-sm transition-all duration-300 ease-in-out transform hover:scale-105">
                <span className="block text-lg font-semibold text-blue-800">{item.nombre}</span>
                <button onClick={() => eliminar(item.id)} className="mt-2 px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500 transition-all duration-300 ease-in-out">
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8 text-blue-700">
        <b>¿Cómo agregar favoritos?</b> Haz clic en el icono de corazón en productos o perfiles de artesanos.
      </div>
    </div>
  )
}
