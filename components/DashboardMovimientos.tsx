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
    valor: any
  ) {
    const numero = Number(valor)

    return numero.toLocaleString(
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

      case 'COMIDA':
        return {
          color: '#16a34a',
          icono: '🛒'
        }

      case 'FIJOS':
        return {
          color: '#2563eb',
          icono: '🏠'
        }

      case 'GENERAL':
        return {
          color: '#64748b',
          icono: '📦'
        }

      case 'INGRESO':
        return {
          color: '#059669',
          icono: '💰'
        }

      case 'OCIO':
        return {
          color: '#ec4899',
          icono: '🎉'
        }

      case 'HOGAR':
        return {
          color: '#d97706',
          icono: '🛠️'
        }

      case 'LARA_LUCA':
        return {
          color: '#9333ea',
          icono: '👶'
        }

      case 'VEHÍCULOS':
        return {
          color: '#dc2626',
          icono: '🚗'
        }

      default:
        return {
          color: '#475569',
          icono: '📄'
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

        return (
          new Date(b.Fecha).getTime()
          -
          new Date(a.Fecha).getTime()
        )
      })

  return (

    <div>

      {/* CABECERA */}

      <div
        style={{
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}
      >

        <h2>
          📋 Movimientos
        </h2>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginTop: '15px'
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
            style={{
              padding: '12px',
              borderRadius: '8px'
            }}
          >

            {meses.map((mes, index) => (

              <option
                key={mes}
                value={index + 1}
              >
                {mes}
              </option>

            ))}
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
            style={{
              padding: '12px',
              borderRadius: '8px'
            }}
          >

            {categoriasDisponibles.map(
              (categoria) => (

                <option
                  key={categoria}
                  value={categoria}
                >
                  {categoria}
                </option>

              )
            )}

          </select>

          <select
            value={orden}
            onChange={(e) =>
              setOrden(
                e.target.value
              )
            }
            style={{
              padding: '12px',
              borderRadius: '8px'
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

      </div>

      {/* TARJETAS */}

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
                    `8px solid ${categoriaInfo.color}`,

                  borderRadius:
                    '12px',

                  padding: '15px',

                  boxShadow:
                    '0 2px 6px rgba(0,0,0,0.08)'
                }}
              >

                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    alignItems: 'center'
                  }}
                >

                  <div
                    style={{
                      fontWeight:
                        'bold',
                      fontSize:
                        '18px'
                    }}
                  >
                    {categoriaInfo.icono}
                    {' '}
                    {mov.Categoria}
                  </div>

                  <div
                    style={{
                      fontWeight:
                        'bold',

                      fontSize:
                        '22px',

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
                    )}
                    {' '}€
                  </div>

                </div>

                <div
                  style={{
                    color:
                      '#64748b',
                    marginTop:
                      '4px'
                  }}
                >
                  {mov.Subcategoria}
                </div>

                <div
                  style={{
                    marginTop:
                      '6px'
                  }}
                >
                  {mov.Descripcion}
                </div>

                <div
                  style={{
                    marginTop:
                      '8px',

                    fontSize:
                      '12px',

                    color:
                      '#94a3b8'
                  }}
                >
                  {mov.Fecha}
                </div>

              </div>

            )
          }
        )}

      </div>

    </div>
  )
}