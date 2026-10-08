'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function DashboardMensual() {
  const [mesSeleccionado, setMesSeleccionado] =
    useState(new Date().getMonth() + 1)

  const [movimientos, setMovimientos] = useState<any[]>([])

  const meses = [
    'ENERO',
    'FEBRERO',
    'MARZO',
    'ABRIL',
    'MAYO',
    'JUNIO',
    'JULIO',
    'AGOSTO',
    'SEPTIEMBRE',
    'OCTUBRE',
    'NOVIEMBRE',
    'DICIEMBRE'
  ]

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    const { data, error } = await supabase
      .from('gastos')
      .select('*')
      .limit(20)

    if (error) {
      console.error(error)
      return
    }

    setMovimientos(data || [])
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '20px'
      }}
    >
      {/* MENU DE MESES */}

      <div
        style={{
          width: '220px',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow:
            '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <h3>📅 Meses</h3>

        {meses.map((mes, index) => (
          <button
            key={mes}
            onClick={() =>
              setMesSeleccionado(index + 1)
            }
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '5px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',

              backgroundColor:
                mesSeleccionado === index + 1
                  ? '#2563eb'
                  : '#e5e7eb',

              color:
                mesSeleccionado === index + 1
                  ? 'white'
                  : 'black'
            }}
          >
            {mes}
          </button>
        ))}
      </div>

      {/* CONTENIDO */}

      <div
        style={{
          flex: 1
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}
        >
          <h2>
            📊 Resumen mensual -
            {' '}
            {meses[mesSeleccionado - 1]}
          </h2>
        </div>

        {/* TARJETAS */}

        <div
          style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap'
          }}
        >
          <div
            style={{
              backgroundColor: '#16a34a',
              color: 'white',
              padding: '20px',
              borderRadius: '12px',
              minWidth: '220px'
            }}
          >
            <h3>Ingresos</h3>
            <h2>0 €</h2>
          </div>

          <div
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '20px',
              borderRadius: '12px',
              minWidth: '220px'
            }}
          >
            <h3>Gastos</h3>
            <h2>0 €</h2>
          </div>

          <div
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '20px',
              borderRadius: '12px',
              minWidth: '220px'
            }}
          >
            <h3>Balance</h3>
            <h2>0 €</h2>
          </div>
        </div>

        {/* MOVIMIENTOS */}

        <div
          style={{
            marginTop: '20px',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px'
          }}
        >
          <h3>Últimos movimientos</h3>

          <table
            style={{
              width: '100%'
            }}
          >
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Categoría</th>
                <th>Importe</th>
              </tr>
            </thead>

            <tbody>
              {movimientos.map((mov) => (
                <tr key={mov.id}>
                  <td>{mov.Fecha}</td>
                  <td>{mov.Categoria}</td>
                  <td>{mov.Importe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}