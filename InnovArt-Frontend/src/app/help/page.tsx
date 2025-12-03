'use client'
export default function HelpPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-900 mb-4">Ayuda y Preguntas Frecuentes</h2>
      <div className="mb-4">
        <b>¿Cómo me registro?</b>
        <p>Haz clic en "Registrarse" en la barra superior y completa el formulario.</p>
      </div>
      <div className="mb-4">
        <b>¿Cómo contacto a un artesano?</b>
        <p>Busca un artesano en la sección "Artesanos" y usa los datos de contacto de su perfil.</p>
      </div>
      <div className="mb-4">
        <b>¿Cómo publico mis productos?</b>
        <p>Debes registrarte como artesano y luego acceder a tu perfil para gestionar tu portafolio.</p>
      </div>
      {/* Agrega más preguntas frecuentes según tu plataforma */}
    </div>
  )
}
