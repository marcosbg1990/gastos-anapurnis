'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { categorias } from '../lib/categorias'

export default function DashboardMensual() {

  const [mesSeleccionado, setMesSeleccionado] =
    useState(new Date().getMonth() + 1)

  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState('INGRESO')

  const [movimientos, setMovimientos] =
    useState<any[]>([])

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
  }, [
    mesSeleccionado,
    categoriaSeleccionada
  ])

  async function cargarDatos() {

    const { data, error } =
      await supabase
        .from('gastos')
        .select('*')

    if (error) {
      console.error(error)
      return
    }

    const filtrados =
      (data || []).filter((mov) => {

        const fecha =
          new Date(mov.Fecha)

        return (
          fecha.getMonth() + 1 ===
            mesSeleccionado
          &&
          mov.Categoria ===
            categoriaSeleccionada
        )

      })

    setMovimientos(
      filtrados
    )
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

  const resumenSubcategorias:
    Record<string, number> = {}

  movimientos.forEach((mov) => {

    const importe =
      Math.abs(
        Number(mov.Importe)
      )

    resumenSubcategorias[
      mov.Subcategoria
    ] =
      (
        resumenSubcategorias[
          mov.Subcategoria
        ] || 0
      ) + importe

  })

  const datosSubcategorias =
    Object.entries(
      resumenSubcategorias
    )
      .map(
        ([nombre, total]) => ({
          nombre,
          total
        })
      )
      .sort(
        (a, b) =>
          b.total - a.total
      )

  const totalCategoria =
    datosSubcategorias.reduce(
      (acc, item) =>
        acc + item.total,
      0
    )

  return (

    <div>

      {/* FILTROS */}

      <div
        style={{
          backgroundColor:
            'white',

          borderRadius:
            '20px',

          padding: '15px',

          marginBottom:
            '20px'
        }}
      >

        <h2>
          📊 Resumen Mensual
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
              (mes, index) => (

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

            {
              Object.keys(
                categorias
              ).map((cat) => (

                <option
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>

              ))
            }

          </select>

        </div>

      </div>

      {/* TOTAL */}

      <div
        style={{
          background:
            'linear-gradient(135deg,#2563eb,#60a5fa)',

          borderRadius:
            '20px',

          color:
            'white',

          padding:
            '20px',

          marginBottom:
            '20px'
        }}
      >

        <div
          style={{
            fontSize:
              '14px'
          }}
        >
          TOTAL CATEGORÍA
        </div>

        <div
          style={{
            fontSize:
              '34px',

            fontWeight:
              'bold',

            marginTop:
              '5px'
          }}
        >
          {
            formatearImporte(
              totalCategoria
            )
          }
          €
        </div>

      </div>

      {/* SUBCATEGORIAS */}

      <div
        style={{
          display:
            'flex',

          flexDirection:
            'column',

          gap:
            '12px'
        }}
      >

        {
          datosSubcategorias.map(
            (sub) => {

              const porcentaje =
                totalCategoria > 0
                  ? (
                      sub.total
                      /
                      totalCategoria
                    ) * 100
                  : 0

              return (

                <div
                  key={
                    sub.nombre
                  }

                  style={{
                    backgroundColor:
                      'white',

                    borderRadius:
                      '18px',

                    padding:
                      '15px',

                    boxShadow:
                      '0 4px 10px rgba(0,0,0,.08)'
                  }}
                >

                  <div
                    style={{
                      display:
                        'flex',

                      justifyContent:
                        'space-between',

                      fontWeight:
                        'bold'
                    }}
                  >

                    <span>
                      {
                        sub.nombre
                      }
                    </span>

                    <span>
                      {
                        formatearImporte(
                          sub.total
                        )
                      }
                      €
                    </span>

                  </div>

                  <div
                    style={{
                      marginTop:
                        '10px',

                      height:
                        '10px',

                      background:
                        '#e2e8f0',

                      borderRadius:
                        '10px',

                      overflow:
                        'hidden'
                    }}
                  >

                    <div
                      style={{
                        width:
                          `${porcentaje}%`,

                        height:
                          '100%',

                        background:
                          '#2563eb'
                      }}
                    />

                  </div>

                  <div
                    style={{
                      textAlign:
                        'right',

                      fontSize:
                        '12px',

                      marginTop:
                        '5px',

                      color:
                        '#64748b'
                    }}
                  >
                    {
                      porcentaje.toFixed(
                        1
                      )
                    }
                    %
                  </div>

                </div>

              )

            }
          )
        }

      </div>

    </div>

  )
}

const selectorStyle = {

  padding: '12px',

  borderRadius: '12px',

  border:
    '1px solid #dbe4ee',

  backgroundColor:
    '#f8fafc',

  fontSize:
    '15px'

} as const