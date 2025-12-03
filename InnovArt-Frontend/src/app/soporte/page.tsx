'use client'
import { useState } from 'react'

export default function SoportePage() {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [tipo, setTipo] = useState('problema')
  const [mensaje, setMensaje] = useState('')
  const [enviado, setEnviado] = useState(false)

  const handleEnviar = () => {
    setEnviado(true)
    setNombre('')
    setCorreo('')
    setTipo('problema')
    setMensaje('')
    // Aquí deberías enviar el mensaje al backend
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Soporte y Reportes</h2>
      <p className="mb-4 text-blue-800">¿Tienes un problema, sugerencia o deseas reportar algo? Completa el formulario y nuestro equipo te contactará.</p>
      <input
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        placeholder="Tu nombre"
        className="border rounded px-3 py-2 w-full mb-2 focus:ring-2 focus:ring-blue-600 transition"
      />
      <input
        value={correo}
        onChange={e => setCorreo(e.target.value)}
        placeholder="Tu correo"
        className="border rounded px-3 py-2 w-full mb-2 focus:ring-2 focus:ring-blue-600 transition"
        type="email"
      />
      <select value={tipo} onChange={e => setTipo(e.target.value)} className="border rounded px-3 py-2 w-full mb-2 focus:ring-2 focus:ring-blue-600 transition">
        <option value="problema">Problema técnico</option>
        <option value="reporte">Reporte de usuario/producto</option>
        <option value="sugerencia">Sugerencia</option>
        <option value="otro">Otro</option>
      </select>
      <textarea
        value={mensaje}
        onChange={e => setMensaje(e.target.value)}
        placeholder="Describe tu problema, reporte o sugerencia"
        className="border rounded px-3 py-2 w-full mb-2 focus:ring-2 focus:ring-blue-600 transition"
        rows={5}
      />
      <button onClick={handleEnviar} className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-full shadow transition">Enviar</button>
      {enviado && <div className="mt-4 text-green-700">¡Tu mensaje fue enviado! Te responderemos pronto.</div>}
      <div className="mt-8 text-blue-700">
        <b>¿Necesitas ayuda urgente?</b> También puedes escribirnos a <a href="mailto:soporte@innovart.com" className="underline text-blue-900">soporte@innovart.com</a>
      </div>
    </div>
  )
}
