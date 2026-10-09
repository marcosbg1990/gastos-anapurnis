'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

import { useEffect, useState } from 'react'

import { supabase } from '../lib/supabase'

import { categorias } from '../lib/categorias'

export default function DashboardAnual() {

  const [categoriaSeleccionada,
    setCategoriaSeleccionada] =
      useState('COMIDA')

  const [subcategoriaSeleccionada,
    setSubcategoriaSeleccionada] =
      useState('TOTAL')

  const [datosGrafica,
    setDatosGrafica] =
      useState<any[]>([])

  const [totalAnual,
    setTotalAnual] =
      useState(0)

  const meses = [
    'ENE',
    'FEB',
    'MAR',
    'ABR',
    'MAY',
    'JUN',
    'JUL',
    'AGO',
    'SEP',
    'OCT',
    'NOV',
    'DIC'
  ]

  useEffect(() => {

    cargarDatos()

  }, [
    categoriaSeleccionada,
    subcategoriaSeleccionada
  ])

  async function cargarDatos() {

    const { data } =
      await supabase
        .from('gastos')
        .select('*')

    if (!data) return

    const resultado: any[] = []

    let total = 0

    for (
      let mes = 1;
      mes <= 12;
      mes++
    ) {

      const movimientosMes =
        data.filter((mov) => {

          const fecha =
            new Date(
              mov.Fecha
            )

          const mismoMes =
            fecha.getMonth() + 1
            === mes

          const mismaCategoria =
            mov.Categoria
            ===
            categoriaSeleccionada

          const mismaSubcategoria =
            subcategoriaSeleccionada
            === 'TOTAL'
            ||
            mov.Subcategoria
            ===
            subcategoriaSeleccionada

          return (
            mismoMes
            &&
            mismaCategoria
            &&
            mismaSubcategoria
          )

        })

      const totalMes =
        movimientosMes.reduce(

          (
            acc,
            mov
          ) =>

            acc +
            Math.abs(
              Number(
                mov.Importe
              )
            ),

          0

        )

      total += totalMes

      resultado.push({

        mes:
          meses[mes - 1],

        total:
          Number(
            totalMes.toFixed(2)
          )

      })

    }

    setDatosGrafica(
      resultado
    )

    setTotalAnual(
      total
    )
  }

  function formatearImporte(
    valor: number
  ) {

    return valor.toLocaleString(
      'es-ES',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    )
  }

  return (

    <div>

      <div
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '15px',
          marginBottom: '20px'
        }}
      >

        <h2>
          📈 Resumen Anual
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
            value={
              categoriaSeleccionada
            }
            onChange={(e) => {

              setCategoriaSeleccionada(
                e.target.value
              )

              setSubcategoriaSeleccionada(
                'TOTAL'
              )

            }}
            style={selectorStyle}
          >

            {
              Object.keys(
                categorias
              ).map((cat) => (

                <option
                  key={cat}
                >
                  {cat}
                </option>

              ))
            }

          </select>

          <select
            value={
              subcategoriaSeleccionada
            }
            onChange={(e) =>
              setSubcategoriaSeleccionada(
                e.target.value
              )
            }
            style={selectorStyle}
          >

            <option>
              TOTAL
            </option>

            {
              categorias[
                categoriaSeleccionada
              ].map((sub) => (

                <option
                  key={sub}
                >
                  {sub}
                </option>

              ))
            }

          </select>

        </div>

      </div>

      <div
        style={{
          background:
            'linear-gradient(135deg,#2563eb,#60a5fa)',

          color:
            'white',

          borderRadius:
            '20px',

          padding:
            '20px',

          marginBottom:
            '20px'
        }}
      >

        <div>
          TOTAL AÑO
        </div>

        <div
          style={{
            fontSize:
              '34px',

            fontWeight:
              'bold'
          }}
        >
          {
            formatearImporte(
              totalAnual
            )
          }
          €
        </div>

      </div>

      <div
        style={{
          background:
            'white',

          borderRadius:
            '20px',

          padding:
            '20px'
        }}
      >

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <BarChart
            data={
              datosGrafica
            }
          >

            <XAxis
              dataKey="mes"
            />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="total"
              fill="#2563eb"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  )
}

const selectorStyle = {

  padding: '12px',

  borderRadius: '12px',

  border:
    '1px solid #dbe4ee',

  background:
    '#f8fafc',

  fontSize:
    '15px'

} as const