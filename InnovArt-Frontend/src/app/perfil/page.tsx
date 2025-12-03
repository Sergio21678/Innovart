'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { API_URL } from '../../services/api'

export default function PerfilPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (!token || !storedUser) {
      router.replace('/login')
      return
    }
    // asegura que axios use el token por defecto
    import('axios').then(ax => ax.default.defaults.headers.common['Authorization'] = `Bearer ${token}`)
    axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const user = res.data
      const normalized = {
        id: user.id ?? user.Id,
        email: user.email ?? user.Email,
        name: user.name ?? user.Name,
        role: user.role ?? user.Role
      }
      localStorage.setItem('user', JSON.stringify(normalized))
      window.dispatchEvent(new Event('auth-changed'))
      if (normalized.role === 'admin') router.replace('/perfil/admin')
      else if (normalized.role === 'artesano') router.replace('/perfil/artesano')
      else router.replace('/perfil/cliente')
    }).catch(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.dispatchEvent(new Event('auth-changed'))
      router.replace('/login')
    })
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      Cargando perfil...
    </div>
  )
}
