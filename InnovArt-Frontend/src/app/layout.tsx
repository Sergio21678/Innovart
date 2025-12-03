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
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {children}
          </div>
        </main>
        <footer className="w-full bg-blue-900 text-white text-sm py-4 px-6 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mt-auto">
          <span className="text-center sm:text-left">&copy; 2025 InnovArt. Todos los derechos reservados.</span>
          <span className="underline hover:text-gray-300 cursor-pointer text-center sm:text-left">Política de privacidad</span>
        </footer>
      </body>
    </html>
  )
}

