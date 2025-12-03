"use client"
import axios from "axios"
import { useEffect, useState } from "react"
import { API_URL } from '@/services/api'

export default function CompradorResenasPage() {
  const [resenas, setResenas] = useState<any[]>([]);
  const [user, setUser] = useState<{ id: string }>({ id: "" }); // Replace with actual user fetching logic

  useEffect(() => {
    if (user.id) {
      axios.get(`${API_URL}/reviews?clienteId=${user.id}`)
        .then(res => setResenas(res.data))
        .catch(() => setResenas([]))
    }
  }, [user]);

  return <div className="p-8">Reseñas del comprador (en construcción)</div>
}

