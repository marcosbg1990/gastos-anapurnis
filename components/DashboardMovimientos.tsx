'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function DashboardMovimientos() {
  const [mesSeleccionado, setMesSeleccionado] =
    useState(new Date().getMonth() + 1)

  const [movimientos, setMovimientos] = useState<any[]>([])

  const [orden, setOrden] =
    useState('fecha')

function formatearImporte(valor: any) {

  const numero = Number(valor)

  return new Intl.NumberFormat(
    'es-ES',
    {
      style: 'decimal',
      useGrouping: true,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  ).format(numero)
}
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
    const { data, error } = await supabase
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

  const movimientosOrdenados =
    [...movimientos].sort((a, b) => {

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

    <div
      style={{
        display: 'flex',
        gap: '20px'
      }}
    >

      {/* MENU MESES */}

      <div
        style={{
          width: '220px',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow:
            '0px 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <h3>📅 Meses</h3>

        {meses.map((mes, index) => (

          <button
            key={mes}

            onClick={() =>
              setMesSeleccionado(
                index + 1
              )
            }

            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '5px',

              border: 'none',
              borderRadius: '8px',

              cursor: 'pointer',

              backgroundColor:
                mesSeleccionado ===
                index + 1
                  ? '#2563eb'
                  : '#e5e7eb',

              color:
                mesSeleccionado ===
                index + 1
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
            📋 Movimientos de {
              meses[
                mesSeleccionado - 1
              ]
            }
          </h2>

          <div
            style={{
              marginTop: '15px'
            }}
          >

            Ordenar por:

            <select
              value={orden}

              onChange={(e) =>
                setOrden(
                  e.target.value
                )
              }

              style={{
                marginLeft: '10px',
                padding: '5px'
              }}
            >

              <option value="fecha">
                Fecha
              </option>

              <option value="importe">
                Importe
              </option>

            </select>

          </div>

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
                      `8px solid ${categoriaInfo.color}`,

                    borderRadius:
                      '12px',

                    padding: '15px',

                    boxShadow:
                      '0px 2px 6px rgba(0,0,0,0.08)',

                    display:
                      'flex',

                    justifyContent:
                      'space-between',

                    alignItems:
                      'center'
                  }}
                >

                  <div>

                    <div
                      style={{
                        fontSize:
                          '18px',

                        fontWeight:
                          'bold'
                      }}
                    >
                      {categoriaInfo.icono}
                      {' '}
                      {mov.Categoria}
                    </div>

                    <div
                      style={{
                        color:
                          '#64748b'
                      }}
                    >
                      {mov.Subcategoria}
                    </div>

                    <div
                      style={{
                        marginTop:
                          '5px'
                      }}
                    >
                      {mov.Descripcion}
                    </div>

                    <div
                      style={{
                        fontSize:
                          '12px',

                        color:
                          '#94a3b8'
                      }}
                    >
                      {mov.Fecha}
                    </div>

                  </div>

                  <div
                    style={{
                      fontSize:
                        '24px',

                      fontWeight:
                        'bold',

                      color:
                        Number(
                          mov.Importe
                        ) >= 0
                          ? '#16a34a'
                          : '#dc2626'
                    }}
                  >
                    <div>
                      {formatearImporte(mov.Importe)} €
                    </div>

                  </div>

                </div>

              )
            }
          )}

        </div>

      </div>

    </div>

  )
}