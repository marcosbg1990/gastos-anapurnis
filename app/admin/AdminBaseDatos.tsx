'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { categorias } from '../../lib/categorias'
import * as XLSX from 'xlsx'

export default function AdminBaseDatos() {

  const [datos, setDatos] =
    useState<any[]>([])

  const [busqueda, setBusqueda] =
    useState('')

  const [categoria, setCategoria] =
    useState('TODAS')

  const [subcategoria, setSubcategoria] =
    useState('TODAS')

  const [usuario, setUsuario] =
    useState('TODOS')

  const [mes, setMes] =
    useState('TODOS')

  const [campoOrden, setCampoOrden] =
    useState('id')

  const [ascendente, setAscendente] =
    useState(false)

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {

    const { data, error } =
      await supabase
        .from('gastos')
        .select('*')

    if (error) {

      console.error(error)

      return
    }

    setDatos(data || [])

  }

  function ordenar(
    campo: string
  ) {

    if (campo === campoOrden) {

      setAscendente(
        !ascendente
      )

    } else {

      setCampoOrden(
        campo
      )

      setAscendente(
        true
      )

    }

  }

  function exportarExcel() {

    const ws =
      XLSX.utils.json_to_sheet(
        datosFiltrados
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
      'BaseDatosGastos.xlsx'
    )

  }

  function actualizarFila(
    id: number,
    campo: string,
    valor: any
  ) {

    setDatos(

      datos.map((fila) =>

        fila.id === id

          ? {
              ...fila,
              valor
            }

          : fila

      )

    )

  }

  async function guardarFilaBD(
    fila: any
  ) {

    const { error } =
      await supabase
        .from('gastos')
        .update({

          Fecha:
            fila.Fecha,

          Categoria:
            fila.Categoria,

          Subcategoria:
            fila.Subcategoria,

          Importe:
            Number(
              fila.Importe
            ),

          Usuario:
            fila.Usuario,

          Descripcion:
            fila.Descripcion

        })
        .eq(
          'id',
          fila.id
        )

    if (error) {

      console.error(error)

      alert(
        'Error guardando'
      )

      return

    }

    alert(
      '✅ Registro actualizado'
    )
  }

  const categoriasFiltro =
    [
      'TODAS',
      ...new Set(
        datos.map(
          d => d.Categoria
        )
      )
    ]

  const subcategorias =
    [
      'TODAS',
      ...new Set(
        datos.map(
          d => d.Subcategoria
        )
      )
    ]

  const usuarios =
    [
      'TODOS',
      ...new Set(
        datos.map(
          d => d.Usuario
        )
      )
    ]

  const meses = [

    { codigo:'TODOS', texto:'Todos' },

    { codigo:'01', texto:'Enero' },
    { codigo:'02', texto:'Febrero' },
    { codigo:'03', texto:'Marzo' },
    { codigo:'04', texto:'Abril' },
    { codigo:'05', texto:'Mayo' },
    { codigo:'06', texto:'Junio' },

    { codigo:'07', texto:'Julio' },
    { codigo:'08', texto:'Agosto' },
    { codigo:'09', texto:'Septiembre' },
    { codigo:'10', texto:'Octubre' },
    { codigo:'11', texto:'Noviembre' },
    { codigo:'12', texto:'Diciembre' }

  ]

  const datosFiltrados =
    [...datos]

      .filter((fila) => {

        const texto =

          `${fila.id}
           ${fila.Fecha}
           ${fila.Categoria}
           ${fila.Subcategoria}
           ${fila.Usuario}
           ${fila.Descripcion}`

          .toLowerCase()

        if (
          busqueda &&
          !texto.includes(
            busqueda.toLowerCase()
          )
        ) {
          return false
        }

        if (
          categoria !== 'TODAS'
          &&
          fila.Categoria !== categoria
        ) {
          return false
        }

        if (
          subcategoria !== 'TODAS'
          &&
          fila.Subcategoria !== subcategoria
        ) {
          return false
        }

        if (
          usuario !== 'TODOS'
          &&
          fila.Usuario !== usuario
        ) {
          return false
        }
        if (
          mes !== 'TODOS'
        ) {

          const mesFila =

            String(
              fila.Fecha
            )
            .split('-')[1]

          if (
            mesFila !== mes
          ) {
            return false
          }

        }
        return true

      })

      .sort((a, b) => {

        const valorA =
          a[campoOrden]

        const valorB =
          b[campoOrden]

        if (
          valorA < valorB
        ) {
          return ascendente
            ? -1
            : 1
        }

        if (
          valorA > valorB
        ) {
          return ascendente
            ? 1
            : -1
        }

        return 0

      })

  return (

    <div>

      <h1>
        🗄️ Base de Datos
      </h1>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}
      >

        <input
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) =>
            setBusqueda(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <select
          value={categoria}
          onChange={(e) =>
            setCategoria(
              e.target.value
            )
          }
          style={inputStyle}
        >

          {categoriasFiltro.map((c) => (

            <option
              key={c}
            >
              {c}
            </option>

          ))}

        </select>

        <select
          value={subcategoria}
          onChange={(e) =>
            setSubcategoria(
              e.target.value
            )
          }
          style={inputStyle}
        >

          {subcategorias.map(
            (s) => (

              <option
                key={s}
              >
                {s}
              </option>

            )
          )}

        </select>

        <select
          value={usuario}
          onChange={(e) =>
            setUsuario(
              e.target.value
            )
          }
          style={inputStyle}
        >

          {usuarios.map((u) => (

            <option
              key={u}
            >
              {u}
            </option>

          ))}

        </select>
        <select
          value={mes}
          onChange={(e) =>
            setMes(
              e.target.value
            )
          }
          style={inputStyle}
        >

          {meses.map((m) => (

            <option
              key={m.codigo}
              value={m.codigo}
            >
              {m.texto}
            </option>

          ))}

        </select>
        <button
          onClick={
            exportarExcel
          }
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            background: '#2563eb',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          📤 Exportar Excel
        </button>

      </div>

      <div
        style={{
          overflow: 'auto',
          background:
            'white',
          borderRadius:
            '12px'
        }}
      >

        <table
          style={{
            width: '100%',
            minWidth:
              '1600px',
            borderCollapse:
              'collapse'
          }}
        >

          <thead>

            <tr>
              <th style={thStyle}>
                💾
              </th>
              <th
                style={thStyle}
                onClick={() =>
                  ordenar('id')
                }
              >
                ID
              </th>

              <th
                style={{
                  ...thStyle,
                  width: '180px'
                }}
              >
                Fecha
              </th>

              <th
                style={thStyle}
                onClick={() =>
                  ordenar('Categoria')
                }
              >
                Categoría
              </th>

              <th
                style={thStyle}
                onClick={() =>
                  ordenar(
                    'Subcategoria'
                  )
                }
              >
                Subcategoría
              </th>

              <th
                style={thStyle}
                onClick={() =>
                  ordenar('Importe')
                }
              >
                Importe
              </th>

              <th
                style={thStyle}
                onClick={() =>
                  ordenar('Usuario')
                }
              >
                Usuario
              </th>

              <th
                style={thStyle}
              >
                Descripción
              </th>

            </tr>

          </thead>

          <tbody>

            {datosFiltrados.map(
              (fila, index) => (

                <tr
                  key={fila.id}
                >
                  <td style={tdStyle}>

                    <button
                      onClick={() =>
                        guardarFilaBD(
                          fila
                        )
                      }
                    >
                      💾
                    </button>

                  </td>
                  <td style={tdStyle}>
                    {fila.id}
                  </td>

                  <td style={tdStyle}>

                    <input
                      value={
                        fila.Fecha || ''
                      }

                      onChange={(e) =>
                        actualizarFila(

                          fila.id,

                          'Fecha',

                          e.target.value

                        )
                      }

                      style={{
                        width: '160px'
                      }}
                    />

                  </td>


                  <td style={tdStyle}>

                    <select

                      value={
                        fila.Categoria || ''
                      }

                      onChange={(e) => {

                        actualizarFila(
                          fila.id,
                          'Categoria',
                          e.target.value
                        )

                        actualizarFila(
                          fila.id,
                          'Subcategoria',
                          categorias[
                            e.target.value
                          ]?.[0] || ''
                        )

                      }}

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

                  </td>
                  <td style={tdStyle}>

                    <select

                      value={
                        fila.Subcategoria || ''
                      }

                      onChange={(e) =>

                        actualizarFila(

                          fila.id,

                          'Subcategoria',

                          e.target.value

                        )

                      }

                    >

                      {

                        (
                          categorias[
                            fila.Categoria
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

                  </td>
                  <td style={tdStyle}>

                    <input

                      value={
                        fila.Importe
                      }

                      onChange={(e) =>
                        actualizarFila(

                          fila.id,

                          'Importe',

                          e.target.value

                        )
                      }

                      style={{
                        width: '120px',
                        textAlign: 'right'
                      }}

                    />

                  </td>

                  <td style={tdStyle}>

                    <select

                      value={
                        fila.Usuario || ''
                      }

                      onChange={(e) =>
                        actualizarFila(

                          fila.id,

                          'Usuario',

                          e.target.value

                        )
                      }

                    >

                      <option>
                        Ana
                      </option>

                      <option>
                        Marcos
                      </option>

                      <option>
                        Auto
                      </option>

                    </select>

                  </td>

                  <td style={tdStyle}>

                    <input

                      value={
                        fila.Descripcion || ''
                      }

                      onChange={(e) =>
                        actualizarFila(

                          fila.id,

                          'Descripcion',

                          e.target.value

                        )
                      }

                      style={{
                        width: '100%'
                      }}

                    />

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

      <div
        style={{
          marginTop: '15px',
          fontWeight: 'bold'
        }}
      >
        Registros:
        {' '}
        {datosFiltrados.length}
      </div>

    </div>

  )

}

const inputStyle = {

  padding: '10px',

  border:
    '1px solid #dbe4ee',

  borderRadius:
    '8px'

} as const

const thStyle = {

  padding: '12px',

  borderBottom:
    '2px solid #cbd5e1',

  background:
    '#f8fafc',

  cursor:
    'pointer',

  textAlign:
    'left'

} as const

const tdStyle = {

  padding: '10px',

  borderBottom:
    '1px solid #e5e7eb'

} as const
