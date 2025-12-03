import './globals.css'
import Navbar from '../components/Navbar'

export const metadata = {
  title: 'InnovArt',
  description: 'Red Social y Marketplace de Artesanos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-gradient-to-br from-white via-sky-100 to-blue-200 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="w-full bg-blue-900 text-white text-sm py-3 px-6 flex justify-between items-center mt-auto">
          <span>&copy; 2025 InnovArt. Todos los derechos reservados.</span>
          <span className="underline hover:text-gray-300 cursor-pointer">Política de privacidad</span>
        </footer>
      </body>
    </html>
  )
}
