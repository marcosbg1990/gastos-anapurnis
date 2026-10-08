'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function DashboardMovimientos() {
  const [mesSeleccionado, setMesSeleccionado] =
    useState(new Date().getMonth() + 1)

  const [movimientos, setMovimientos] =
    useState<any[]>([])

  const [orden, setOrden] =
    useState('fecha')

  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState('TODAS')

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
    cargarMovimientos()
  }, [mesSeleccionado])

  async function cargarMovimientos() {
    const { data, error } =
      await supabase
        .from('gastos')
        .select('*')

    if (error) {
      console.error(error)
      return
    }

    const movimientosMes =
      (data || []).filter((mov) => {

        const fecha =
          new Date(mov.Fecha)

        return (
          fecha.getMonth() + 1 ===
          mesSeleccionado
        )
      })

    setMovimientos(movimientosMes)
  }

  function formatearImporte(
    valor: number
  ) {

    return Number(valor)
      .toLocaleString(
        'es-ES',
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      )
  }

  function obtenerCategoriaInfo(
    categoria: string
  ) {

    switch (categoria) {

      case 'INGRESO':
        return {
          color: '#16a34a',
          icono: '💰'
        }

      case 'FIJOS':
        return {
          color: '#4ea5ec',
          icono: '🏠'
        }

      case 'COMIDA':
        return {
          color: '#ffbf0f',
          icono: '🛒'
        }

      case 'LARA_LUCA':
        return {
          color: '#9333ea',
          icono: '👶'
        }

      case 'VEHÍCULOS':
        return {
          color: '#1b52e9',
          icono: '🚗'
        }

      case 'OCIO':
        return {
          color: '#eb68a9',
          icono: '🎉'
        }
      case 'DUDA':
        return {
          color: '#ff1100',
          icono: '⁉️'
        }

      default:
        return {
          color: '#64748b',
          icono: '📦'
        }
    }
  }

  const categoriasDisponibles = [
    'TODAS',
    ...Array.from(
      new Set(
        movimientos.map(
          (m) => m.Categoria
        )
      )
    )
  ]

  const movimientosFiltrados =
    movimientos.filter((mov) => {

      if (
        categoriaSeleccionada === 'TODAS'
      ) {
        return true
      }

      return (
        mov.Categoria ===
        categoriaSeleccionada
      )
    })

const movimientosOrdenados =
  [...movimientosFiltrados]
    .sort((a, b) => {

      if (orden === 'importe') {

        return (
          Math.abs(Number(b.Importe))
          -
          Math.abs(Number(a.Importe))
        )
      }

      const fechaA =
        new Date(a.Fecha).getTime()

      const fechaB =
        new Date(b.Fecha).getTime()

      // Primero fecha descendente
      if (fechaA !== fechaB) {

        return fechaB - fechaA

      }

      // Si la fecha es igual,
      // ordenar por id descendente
      return b.id - a.id

    })


  return (

    <div>

      {/* FILTROS */}

      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '15px',
          marginBottom: '20px'
        }}
      >

        <h2>
          📋 Movimientos
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '1fr 1fr',
            gap: '10px'
          }}
        >

          <select
            value={mesSeleccionado}
            onChange={(e) =>
              setMesSeleccionado(
                Number(
                  e.target.value
                )
              )
            }
            style={selectorStyle}
          >

            {meses.map(
              (
                mes,
                index
              ) => (

                <option
                  key={mes}
                  value={index + 1}
                >
                  {mes}
                </option>

              )
            )}

          </select>

          <select
            value={
              categoriaSeleccionada
            }
            onChange={(e) =>
              setCategoriaSeleccionada(
                e.target.value
              )
            }
            style={selectorStyle}
          >

            {categoriasDisponibles.map(
              (
                categoria
              ) => (

                <option
                  key={
                    categoria
                  }
                  value={
                    categoria
                  }
                >
                  {categoria}
                </option>

              )
            )}

          </select>

        </div>

        <select
          value={orden}
          onChange={(e) =>
            setOrden(
              e.target.value
            )
          }
          style={{
            ...selectorStyle,
            width: '100%',
            marginTop: '10px'
          }}
        >

          <option value="fecha">
            Ordenar por fecha
          </option>

          <option value="importe">
            Ordenar por importe
          </option>

        </select>

      </div>

      {/* MOVIMIENTOS */}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >

        {movimientosOrdenados.map(
          (mov) => {

            const categoriaInfo =
              obtenerCategoriaInfo(
                mov.Categoria
              )

            return (

              <div
                key={mov.id}
                style={{
                  backgroundColor:
                    'white',

                  borderLeft:
                    `6px solid ${categoriaInfo.color}`,

                  borderRadius:
                    '18px',

                  padding: '14px',

                  boxShadow:
                    '0 4px 10px rgba(0,0,0,.08)'
                }}
              >

                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    alignItems:
                      'center'
                  }}
                >

                  <div>

                    <div
                      style={{
                        fontWeight:
                          'bold',
                        fontSize:
                          '18px'
                      }}
                    >
                      {
                        categoriaInfo.icono
                      }{' '}
                      {
                        mov.Categoria
                      }
                    </div>

                    <div
                      style={{
                        color:
                          '#64748b',
                        fontSize:
                          '13px'
                      }}
                    >
                      {
                        mov.Subcategoria
                      }
                    </div>

                  </div>

                  <div
                    style={{
                      fontWeight:
                        'bold',
                      fontSize:
                        '24px',

                      color:
                        Number(
                          mov.Importe
                        ) >= 0
                          ? '#16a34a'
                          : '#dc2626'
                    }}
                  >
                    {formatearImporte(
                      mov.Importe
                    )}{' '}
                    €
                  </div>

                </div>

                <div
                  style={{
                    marginTop:
                      '10px',

                    paddingTop:
                      '8px',

                    borderTop:
                      '1px solid #e5e7eb'
                  }}
                >
                  {mov.Descripcion}
                </div>

                <div
                  style={{
                    marginTop:
                      '8px',

                    color:
                      '#94a3b8',

                    fontSize:
                      '12px'
                  }}
                >
                  📅 {mov.Fecha}
                </div>

              </div>

            )
          }
        )}

      </div>

    </div>
  )
}

const selectorStyle = {
  padding: '12px',
  borderRadius: '12px',
  border: '1px solid #dbe4ee',
  backgroundColor: '#f8fafc',
  fontSize: '15px'
} as const