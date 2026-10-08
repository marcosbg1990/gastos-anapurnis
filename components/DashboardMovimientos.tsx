'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { categorias } from '../lib/categorias'

export default function DashboardMovimientos() {

  const [mesSeleccionado, setMesSeleccionado] =
    useState(new Date().getMonth() + 1)

  const [movimientos, setMovimientos] =
    useState<any[]>([])

  const [orden, setOrden] =
    useState('fecha')

  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState('TODAS')

  const [movimientoEditando, setMovimientoEditando] =
    useState<any>(null)

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
async function borrarMovimiento(id: number) {

  const confirmar =
    window.confirm(
      '¿Seguro que quieres eliminar este movimiento?'
    )

  if (!confirmar) return

  const { error } =
    await supabase
      .from('gastos')
      .delete()
      .eq('id', id)

  if (error) {

    alert(
      'Error eliminando movimiento'
    )

    return
  }

  cargarMovimientos()
}

    async function guardarEdicion() {

      const { error } =
        await supabase
          .from('gastos')
          .update({

            Fecha:
              movimientoEditando.Fecha,

            Importe:
              Number(
                movimientoEditando.Importe
              ),

            Categoria:
              movimientoEditando.Categoria,

            Subcategoria:
              movimientoEditando.Subcategoria,

            Descripcion:
              movimientoEditando.Descripcion,

            Usuario:
              movimientoEditando.Usuario

          })
          .eq(
            'id',
            movimientoEditando.id
          )

      if (error) {

        alert(
          'Error guardando'
        )

        return
      }

      setMovimientoEditando(
        null
      )

      cargarMovimientos()
    }
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

    {/* MODAL EDITAR */}

          {
        movimientoEditando && (

          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',

              display: 'flex',

              justifyContent: 'center',

              alignItems: 'center',

              zIndex: 9999
            }}
          >

            <div
              style={{
                backgroundColor: 'white',

                padding: '20px',

                borderRadius: '20px',

                width: '90%',

                maxWidth: '450px'
              }}
            >



          <h2>
            ✏️ Editar movimiento
          </h2>

          <input
            type="date"
            value={movimientoEditando.Fecha}
            onChange={(e) =>
              setMovimientoEditando({
                ...movimientoEditando,
                Fecha: e.target.value
              })
            }
            style={inputStyle}
          />

          <input
            type="number"
            step="0.01"
            value={movimientoEditando.Importe}
            onChange={(e) =>
              setMovimientoEditando({
                ...movimientoEditando,
                Importe: e.target.value
              })
            }
            style={inputStyle}
          />

          <select
            value={movimientoEditando.Categoria}
            onChange={(e) =>

              setMovimientoEditando({

                ...movimientoEditando,

                Categoria:
                  e.target.value,

                Subcategoria:
                  categorias[
                    e.target.value
                  ][0]

              })

            }
            style={inputStyle}
          >
            {Object.keys(categorias)
              .map((categoria) => (

                <option
                  key={categoria}
                  value={categoria}
                >
                  {categoria}
                </option>

              ))}
          </select>

          <select
            value={
              movimientoEditando.Subcategoria
            }
            onChange={(e) =>
              setMovimientoEditando({

                ...movimientoEditando,

                Subcategoria:
                  e.target.value

              })
            }
            style={inputStyle}
          >
            {
              categorias[
                movimientoEditando.Categoria
              ]?.map((sub) => (

                <option
                  key={sub}
                  value={sub}
                >
                  {sub}
                </option>

              ))
            }
          </select>

          <select
            value={
              movimientoEditando.Usuario
            }
            onChange={(e) =>
              setMovimientoEditando({

                ...movimientoEditando,

                Usuario:
                  e.target.value

              })
            }
            style={inputStyle}
          >
            <option value="Marcos">
              Marcos
            </option>

            <option value="Ana">
              Ana
            </option>
          </select>

          <textarea
            value={
              movimientoEditando.Descripcion
            }

            onChange={(e) =>
              setMovimientoEditando({

                ...movimientoEditando,

                Descripcion:
                  e.target.value

              })
            }

            rows={4}

            style={inputStyle}
          />

          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginTop: '10px'
            }}
          >

            <button
              onClick={
                guardarEdicion
              }
              style={{
                flex: 1,
                padding: '12px',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '10px'
              }}
            >
              💾 Guardar
            </button>

            <button
              onClick={() =>
                setMovimientoEditando(
                  null
                )
              }
              style={{
                flex: 1,
                padding: '12px',
                background: '#64748b',
                color: 'white',
                border: 'none',
                borderRadius: '10px'
              }}
            >
              Cancelar
            </button>

          </div>



            </div>

          </div>

        )
      }
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
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >

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
                      )} €
                    </div>

                    <button
                      onClick={() =>
                        setMovimientoEditando(
                          mov
                        )
                      }

                      style={{
                        border: 'none',
                        background:
                          'none',
                        cursor: 'pointer',
                        fontSize:
                          '20px'
                      }}
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() =>
                        borrarMovimiento(
                          mov.id
                        )
                      }

                      style={{
                        border: 'none',
                        background:
                          'none',
                        cursor: 'pointer',
                        fontSize:
                          '20px'
                      }}
                    >
                      🗑️
                    </button>

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

const inputStyle = {

  width: '100%',

  padding: '12px',

  borderRadius: '10px',

  border:
    '1px solid #dbe4ee',

  marginBottom: '10px'

} as const