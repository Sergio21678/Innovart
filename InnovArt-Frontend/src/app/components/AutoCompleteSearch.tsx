import { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../../services/api'

export default function AutoCompleteSearch({ tipo, onSelect }: { tipo: 'productos' | 'artesanos', onSelect: (item: any) => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [show, setShow] = useState(false)

  const handleChange = async (e: any) => {
    const value = e.target.value
    setQuery(value)
    if (value.length > 1) {
      const url = tipo === 'productos'
        ? `${API_URL}/products/search?q=${encodeURIComponent(value)}`
        : `${API_URL}/users/search?q=${encodeURIComponent(value)}`
      const res = await axios.get(url)
      setResults(res.data)
      setShow(true)
    } else {
      setShow(false)
      setResults([])
    }
  }

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Buscar productos o artesanos..."
        className="w-full border rounded px-3 py-2"
        onBlur={() => setTimeout(() => setShow(false), 200)}
        onFocus={() => query.length > 1 && setShow(true)}
      />
      {show && results.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border rounded shadow z-10 max-h-48 overflow-y-auto">
          {results.map(item => (
            <li
              key={item.id}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => { onSelect(item); setShow(false); setQuery('') }}
            >
              {item.nombre_completo || item.nombre || item.titulo}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
