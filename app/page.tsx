'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [gastos, setGastos] = useState<any[]>([])

  useEffect(() => {
    cargarGastos()
  }, [])

  async function cargarGastos() {
    const { data, error } = await supabase
      .from('gastos')
      .select('*')

    if (error) {
      console.error(error)
      return
    }

    setGastos(data || [])
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Mis Gastos</h1>

      {gastos.map((gasto) => (
        <div key={gasto.id}>
          <hr />
          <p>Categoría: {gasto.Categoria}</p>
          <p>Subcategoría: {gasto.Subcategoria}</p>
          <p>Importe: {gasto.Importe} €</p>
        </div>
      ))}
    </div>
  )
}