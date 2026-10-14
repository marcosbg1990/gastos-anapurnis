'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import * as XLSX from 'xlsx'

export default function AdminExportar() {

  const hoy = new Date()

  const primerDiaMes =
    new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      1
    )

  const ultimoDiaMes =
    new Date(
      hoy.getFullYear(),
      hoy.getMonth() + 1,
      0
    )

  const [fechaInicial, setFechaInicial] =
    useState(
      primerDiaMes
        .toISOString()
        .split('T')[0]
    )

  const [fechaFinal, setFechaFinal] =
    useState(
      ultimoDiaMes
        .toISOString()
        .split('T')[0]
    )

  const [datos, setDatos] =
    useState<any[]>([])

  useEffect(() => {
    cargarDatos()
  }, [
    fechaInicial,
    fechaFinal
  ])

  async function cargarDatos() {

    const { data, error } =
      await supabase
        .from('gastos')
        .select('*')
        .order(
          'Fecha',
          {
            ascending: false
          }
        )

    if (error) {
      console.error(error)
      return
    }

    const filtrados =
      (data || []).filter(
        (mov) => {

          const fecha =
            mov.Fecha

          return (
            fecha >= fechaInicial
            &&
            fecha <= fechaFinal
          )
        }
      )

    setDatos(
      filtrados
    )
  }

  function exportarExcel() {

    const exportData =
      datos.map((mov) => ({

        ID: mov.id,

        Fecha: mov.Fecha,

        Categoria:
          mov.Categoria,

        Subcategoria:
          mov.Subcategoria,

        Importe:
          mov.Importe,

        Usuario:
          mov.Usuario

      }))

    const ws =
      XLSX.utils.json_to_sheet(
        exportData
      )

    const wb =
      XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      'Gastos'
    )

    XLSX.writeFile(
      wb,
      `Gastos_${fechaInicial}_${fechaFinal}.xlsx`
    )
  }

  return (

    <div>

      <h1>
        📤 Exportar Excel
      </h1>

      {/* FILTROS */}

      <div
        style={{
          background: 'white',

          padding: '20px',

          borderRadius: '12px',

          marginBottom: '20px',

          display: 'flex',

          gap: '20px',

          alignItems: 'end'
        }}
      >

        <div>

          <div>
            Fecha Inicial
          </div>

          <input
            type="date"
            value={fechaInicial}
            onChange={(e) =>
              setFechaInicial(
                e.target.value
              )
            }
          />

        </div>

        <div>

          <div>
            Fecha Final
          </div>

          <input
            type="date"
            value={fechaFinal}
            onChange={(e) =>
              setFechaFinal(
                e.target.value
              )
            }
          />

        </div>

        <button
          onClick={
            exportarExcel
          }
          style={{
            border: 'none',

            borderRadius:
              '10px',

            padding:
              '12px 20px',

            background:
              '#2563eb',

            color:
              'white',

            cursor:
              'pointer',

            fontWeight:
              'bold'
          }}
        >
          📤 EXPORTAR EXCEL
        </button>

      </div>

      {/* RESUMEN */}

      <div
        style={{
          marginBottom:
            '15px',

          fontWeight:
            'bold'
        }}
      >
        Registros:
        {' '}
        {datos.length}
      </div>

      {/* TABLA */}

      <div
        style={{
          background:
            'white',

          borderRadius:
            '12px',

          overflow:
            'auto'
        }}
      >

        <table
          style={{
            width: '100%',

            borderCollapse:
              'collapse'
          }}
        >

          <thead>

            <tr
              style={{
                background:
                  '#f1f5f9'
              }}
            >

              <th style={thStyle}>
                ID
              </th>

              <th style={thStyle}>
                Fecha
              </th>

              <th style={thStyle}>
                Categoria
              </th>

              <th style={thStyle}>
                Subcategoria
              </th>

              <th style={thStyle}>
                Importe
              </th>

              <th style={thStyle}>
                Usuario
              </th>

            </tr>

          </thead>

          <tbody>

            {datos.map((mov) => (

              <tr key={mov.id}>

                <td style={tdStyle}>
                  {mov.id}
                </td>

                <td style={tdStyle}>
                  {mov.Fecha}
                </td>

                <td style={tdStyle}>
                  {mov.Categoria}
                </td>

                <td style={tdStyle}>
                  {mov.Subcategoria}
                </td>

                <td style={tdStyle}>
                  {Number(
                    mov.Importe
                  ).toLocaleString(
                    'es-ES',
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }
                  )}
                </td>

                <td style={tdStyle}>
                  {mov.Usuario}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  )
}

const thStyle = {

  padding: '12px',

  textAlign: 'left',

  borderBottom:
    '1px solid #e2e8f0'

} as const

const tdStyle = {

  padding: '10px',

  borderBottom:
    '1px solid #f1f5f9'

} as const