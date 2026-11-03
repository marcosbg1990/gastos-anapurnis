'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'
import { supabase } from '../../lib/supabase'
import { categorias } from '../../lib/categorias'

export default function AdminImportar() {

  const [filas, setFilas] =
    useState<any[]>([])

  function formatearFecha(
    fecha: string
  ) {

    if (!fecha) return ''

    const partes =
      fecha.split('-')

    if (partes.length !== 3) {
      return fecha
    }

    return `${partes[0]}/${partes[1]}/${partes[2]}`
  }
  function fechaExcelASQL(
    fecha: string
  ) {

    const partes =
      fecha.split('-')

    if (
      partes.length !== 3
    ) {
      return fecha
    }

    return `${partes[2]}-${partes[1]}-${partes[0]}`
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
      ) + ' €'
  }

  async function cargarExcel(
    event: React.ChangeEvent<HTMLInputElement>
  ) {

    const fichero =
      event.target.files?.[0]

    if (!fichero) return

    const buffer =
      await fichero.arrayBuffer()

    const workbook =
      XLSX.read(buffer)

    const hoja =
      workbook.Sheets[
        workbook.SheetNames[0]
      ]

    const datos =
      XLSX.utils.sheet_to_json(
        hoja,
        {
          header: 1
        }
      )

    const filasExcel =
      datos.slice(6)

    const {
      data: gastos
    } = await supabase
      .from('gastos')
      .select('*')

    const resultado =
      filasExcel
        .filter(
          (fila: any) =>
            fila?.[2]
        )
        .map(
          (fila: any) => {

            const fechaBanco =
              String(
                fila[2]
              ).trim()

            const concepto =
              `${fila[3] || ''} - ${fila[4] || ''}`

            const importe =
              Number(fila[6])

            const saldo =
              Number(fila[7])

            let match =
              null

            for (
              const gasto of
              gastos || []
            ) {

              const fechaApp =
                new Date(
                  gasto.Fecha
                )

              const fechaExcel =
                new Date(
                  fechaBanco
                    .split('-')
                    .reverse()
                    .join('-')
                )

              const diferenciaDias =
                Math.abs(
                  (
                    fechaApp.getTime()
                    -
                    fechaExcel.getTime()
                  )
                  /
                  (
                    1000 *
                    60 *
                    60 *
                    24
                  )
                )

              if (

                diferenciaDias <= 5

                &&

                Number(
                  gasto.Importe
                ) === importe

              ) {

                match = gasto

                break

              }

            }

            return {

              fecha:
                fechaBanco,

              concepto,

              importe,

              saldo,

              match:
                !!match,

              idApp:
                match?.id || '',

              fechaApp:
                match?.Fecha || '',

              descripcionApp:
                match?.Descripcion || '',

              categoria:
                match?.Categoria || '',

              subcategoria:
                match?.Subcategoria || ''

            }

          }
        )

    setFilas(
      resultado
    )

  }
  function actualizarFila(
    index: number,
    campo: string,
    valor: any
  ) {

    const nuevasFilas =
      [...filas]

    nuevasFilas[index] = {

      ...nuevasFilas[index],

      [campo]: valor

    }

    setFilas(
    nuevasFilas
    )
  }

  function eliminarFila(
    index: number
  ) {

    const nuevasFilas =
      filas.filter(
        (_, i) =>
          i !== index
      )

    setFilas(
      nuevasFilas
    )

  }

  async function guardarFila(
    fila: any,
    index: number
  ) {

    const { data, error } =
      await supabase
        .from('gastos')
        .insert([
          {
            Fecha:
              fechaExcelASQL(
                fila.fecha
              ),

            Descripcion:
              fila.concepto,

            Importe:
              fila.importe,

            Categoria:
              fila.categoria,

            Subcategoria:
              fila.subcategoria,

            Usuario:
              'Auto'
          }
        ])
        .select()
        .single()

    if (error) {

      console.error(error)

      alert(
        'Error guardando'
      )

      return
    }

    const nuevasFilas =
      [...filas]

    nuevasFilas[index] = {

      ...nuevasFilas[index],

      match: true,

      idApp:
        data.id,

      fechaApp:
        data.Fecha,

      descripcionApp:
        data.Descripcion,

      categoria:
        data.Categoria,

      subcategoria:
        data.Subcategoria

    }

    setFilas(
      nuevasFilas
    )

  }

  function exportarExcel() {

  const datosExportar =
    filas.map((fila) => ({

      ID: fila.idApp || '',

      Fecha: fila.fecha,

      Concepto: fila.concepto,

      Categoria: fila.categoria,

      Subcategoria: fila.subcategoria,

      Importe: fila.importe,

      Saldo: fila.saldo,

      Descripcion:
        fila.descripcionApp || ''

    }))

  const ws =
    XLSX.utils.json_to_sheet(
      datosExportar
    )

  const wb =
    XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(
    wb,
    ws,
    'Importacion'
  )

  XLSX.writeFile(
    wb,
    'Importacion_Bancaria.xlsx'
  )

}

  const total =
    filas.length

  const match =
    filas.filter(
      f => f.match
    ).length

  const pendientes =
    total - match

  return (

    <div>

      <h1>
        📥 Importar movimientos
      </h1>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={
          cargarExcel
        }
      />

      <div
        style={{
          marginTop: '20px',
          marginBottom: '20px',

          display: 'flex',

          justifyContent:
            'space-between',

          alignItems:
            'center'
        }}
      >

        <div
          style={{
            display: 'flex',
            gap: '30px'
          }}
        >

          <div>
            <b>Total:</b>
            {' '}
            {total}
          </div>

          <div>
            <b>✅ Match:</b>
            {' '}
            {match}
          </div>

          <div>
            <b>❌ Pendientes:</b>
            {' '}
            {pendientes}
          </div>

        </div>

        <button
          onClick={exportarExcel}
          style={{
            border: 'none',

            borderRadius:
              '10px',

            padding:
              '10px 20px',

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
          📤 Exportar Excel
        </button>

      </div>

      <div
        style={{
          backgroundColor:
            'white',

          borderRadius:
            '12px',

          overflow:
            'auto',

          border:
            '1px solid #e5e7eb'
        }}
      >

        <table
          style={{
            width: '100%',
            minWidth: '1900px',
            borderCollapse:
              'collapse'
          }}
        >

          <thead
            style={{
              position:
                'sticky',

              top: 0,

              background:
                '#f1f5f9',

              zIndex: 2
            }}
          >

            <tr>
              <th
                style={{
                  ...thStyle,
                  width: '100px'
                }}
              >
                Acciones
              </th>
              <th
                style={{
                  ...thStyle,
                  width: '90px'
                }}
              >
                ID App
              </th>

              <th
                style={{
                  ...thStyle,
                  width: '120px'
                }}
              >
                Fecha
              </th>

              <th
                style={{
                  ...thStyle,
                  width: '120px'
                }}
              >
                Fecha App
              </th>

              <th
                style={{
                  ...thStyle,
                  width: '350px'
                }}
              >
                Concepto
              </th>

              <th
                style={{
                  ...thStyle,
                  width: '350px'
                }}
              >
                Descripción App
              </th>

              <th
                style={{
                  ...thStyle,
                  width: '140px'
                }}
              >
                Importe
              </th>

              <th
                style={{
                  ...thStyle,
                  width: '180px'
                }}
              >
                Categoría
              </th>

              <th
                style={{
                  ...thStyle,
                  width: '180px'
                }}
              >
                Subcategoría
              </th>

              <th
                style={{
                  ...thStyle,
                  width: '140px'
                }}
              >
                Saldo
              </th>

            </tr>

          </thead>

          <tbody>

            {
              filas.map(
                (
                  fila,
                  index
                ) => (

                  <tr
                    key={index}
                    style={{
                      backgroundColor:
                        fila.match
                          ? '#dcfce7'
                          : 'white'
                    }}
                  >
                    <td style={tdStyle}>

                      {
                        !fila.match && (

                          <>

                            <button
                              onClick={() =>
                                guardarFila(
                                  fila,
                                  index
                                )
                              }
                              style={{
                                marginRight:
                                  '5px',
                                cursor:
                                  'pointer'
                              }}
                            >
                              💾
                            </button>

                            <button
                              onClick={() =>
                                eliminarFila(
                                  index
                                )
                              }
                              style={{
                                cursor:
                                  'pointer'
                              }}
                            >
                              🗑️
                            </button>

                          </>

                        )
                      }

                    </td>
                    <td style={tdStyle}>
                      {
                        fila.idApp
                      }
                    </td>

                    <td style={tdStyle}>
                      {
                        formatearFecha(
                          fila.fecha
                        )
                      }
                    </td>

                    <td style={tdStyle}>
                      {
                        formatearFecha(
                          fila.fechaApp
                        )
                      }
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        whiteSpace: 'normal',
                        wordBreak: 'break-word'
                      }}
                    >

                      {
                        fila.match

                          ? fila.concepto

                          : (

                            <input

                              value={
                                fila.concepto
                              }

                              onChange={(e) =>

                                actualizarFila(

                                  index,

                                  'concepto',

                                  e.target.value

                                )

                              }

                              style={{
                                width:
                                  '100%'
                              }}

                            />

                          )

                      }

                    </td>


                    <td style={tdStyle}>
                      {
                        fila.descripcionApp
                      }
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        textAlign:
                          'right'
                      }}
                    >
                      {
                        formatearImporte(
                          fila.importe
                        )
                      }
                    </td>

                    <td style={tdStyle}>

                      {
                        fila.match

                          ? fila.categoria

                          : (

                            <select

                              value={
                                fila.categoria
                              }

                              onChange={(e) => {

                              const nuevasFilas =
                                [...filas]

                              nuevasFilas[index] = {

                                ...nuevasFilas[index],

                                categoria:
                                  e.target.value,

                                subcategoria:
                                  (
                                    categorias[
                                      e.target.value
                                    ] || ['']
                                  )[0]

                              }

                              setFilas(
                                nuevasFilas
                              )

                            }}

                            >

                              <option value="">
                                Seleccionar
                              </option>

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

                          )

                      }

                    </td>

                    <td style={tdStyle}>

                      {
                        fila.match

                          ? fila.subcategoria

                          : (

                            <select

                              value={
                                fila.subcategoria
                              }

                              onChange={(e) =>

                                actualizarFila(

                                  index,

                                  'subcategoria',

                                  e.target.value

                                )

                              }

                            >

                              {

                                (
                                  categorias[
                                    fila.categoria
                                  ] || []

                                ).map((sub) => (

                                  <option
                                    key={sub}
                                    value={sub}
                                  >
                                    {sub}
                                  </option>

                                ))

                              }

                            </select>

                          )

                      }

                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        textAlign:
                          'right'
                      }}
                    >
                      {
                        formatearImporte(
                          fila.saldo
                        )
                      }
                    </td>

                  </tr>

                )
              )
            }

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
    '2px solid #cbd5e1',

  fontSize: '14px'

} as const

const tdStyle = {

  padding: '10px',

  borderBottom:
    '1px solid #e5e7eb',

  verticalAlign:
    'top'

} as const