'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

import { useEffect, useState } from 'react'

import { supabase } from '../lib/supabase'

const MAXIMOS = {
  FIJOS: 1500,
  GENERAL: 1000,
  COMIDA: 700,
  LARA_LUCA: 1000,
  HOGAR: 7000,
  OCIO: 300,
  VIAJES: 5000,
  VEHÍCULOS: 40000,
  TECNOLOGÍA: 1500,
  ROPA: 300,
  CAPRICHOS: 200,
  FUTURO_LYL: 5000,
  AHORRO: 10000
}

function obtenerMaximo(
  categoria: string
) {
  return (
    MAXIMOS[
      categoria as keyof typeof MAXIMOS
    ] || 1000
  )
}

export default function DashboardAnual() {

  const hoy = new Date()

  const [mes,
    setMes] =
    useState(
      hoy.getMonth() + 1
    )

  const [anio,
    setAnio] =
    useState(
      hoy.getFullYear()
    )

  const [carpetas,
    setCarpetas] =
    useState<any[]>([])

  const [historico,
    setHistorico] =
    useState<any[]>([])

  const [gastos,
    setGastos] =
    useState<any[]>([])

  const [
    categoriaSeleccionada,
    setCategoriaSeleccionada
  ] = useState('COMIDA')

  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ]

  useEffect(() => {
    cargarDatos()
  }, [mes, anio])

  async function cargarDatos() {

    const {
      data: carpetasData
    } =
      await supabase
        .from('carpetas')
        .select('*')
        .eq('anio', anio)
        .eq('mes', mes)

    const {
      data: historicoData
    } =
      await supabase
        .from('carpetas')
        .select('*')

    const {
      data: gastosData
    } =
      await supabase
        .from('gastos')
        .select('*')

    setCarpetas(
      carpetasData || []
    )

    setHistorico(
      historicoData || []
    )

    setGastos(
      gastosData || []
    )

    if (
      carpetasData &&
      carpetasData.length > 0 &&
      !carpetasData.find(
        c =>
          c.categoria ===
          categoriaSeleccionada
      )
    ) {
      setCategoriaSeleccionada(
        carpetasData[0].categoria
      )
    }
  }

  function formato(
    valor: number
  ) {
    return Number(
      valor || 0
    ).toLocaleString(
      'es-ES',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    )
  }

  const carpetaActual =
    carpetas.find(
      c =>
        c.categoria ===
        categoriaSeleccionada
    )

  function obtenerEvolucion() {

    return historico
      .filter(
        c =>
          c.categoria ===
          categoriaSeleccionada
      )
      .sort(
        (a, b) =>
          (a.anio * 100 + a.mes)
          -
          (b.anio * 100 + b.mes)
      )
      .slice(-12)
      .map(c => ({
        mes:
          `${String(c.mes)
            .padStart(2, '0')}/${String(
              c.anio
            ).slice(-2)}`,
        in_amount:
          Number(c.in_amount),
        out_amount:
          Math.abs(
            Number(
              c.out_amount
            )
          ),
        cash:
          Number(c.cash)
      }))
  }

  const gastosMes =
    gastos.filter(g => {

      const fecha =
        new Date(g.Fecha)

      return (
        fecha.getFullYear()
          === anio
        &&
        fecha.getMonth() + 1
          === mes
        &&
        g.Categoria
          ===
        categoriaSeleccionada
      )
    })

  const resumenSubcategorias:
    Record<
      string,
      number
    > = {}

  gastosMes.forEach(g => {

    resumenSubcategorias[
      g.Subcategoria
    ] =
      (
        resumenSubcategorias[
          g.Subcategoria
        ] || 0
      ) +
      Math.abs(
        Number(g.Importe)
      )
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
          background: 'white',
          borderRadius: 20,
          padding: 15,
          marginBottom: 20
        }}
      >

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '1fr 1fr',
            gap: 10
          }}
        >

          <select
            value={mes}
            onChange={(e) =>
              setMes(
                Number(
                  e.target.value
                )
              )
            }
          >
            {meses.map(
              (
                nombre,
                index
              ) => (
                <option
                  key={nombre}
                  value={index + 1}
                >
                  {nombre}
                </option>
              )
            )}
          </select>

          <select
            value={anio}
            onChange={(e) =>
              setAnio(
                Number(
                  e.target.value
                )
              )
            }
          >
            <option>
              2024
            </option>
            <option>
              2025
            </option>
            <option>
              2026
            </option>
            <option>
              2027
            </option>
          </select>

        </div>

      </div>

      {/* BARRAS CARPETAS */}

      <div
        style={{
          display: 'flex',
          flexDirection:
            'column',
          gap: 12,
          marginBottom: 20
        }}
      >

        {carpetas.map(
          carpeta => {

            const maximo =
              obtenerMaximo(
                carpeta.categoria
              )

            const porcentaje =
              Math.min(
                100,
                (
                  Number(
                    carpeta.cash
                  ) /
                  maximo
                ) * 100
              )

            return (

              <div
                key={
                  carpeta.id
                }
                onClick={() =>
                  setCategoriaSeleccionada(
                    carpeta.categoria
                  )
                }
                style={{
                  background:
                    categoriaSeleccionada ===
                    carpeta.categoria
                      ? '#dbeafe'
                      : 'white',
                  borderRadius: 15,
                  padding: 15,
                  cursor: 'pointer'
                }}
              >

                <div
                  style={{
                    display:
                      'flex',
                    justifyContent:
                      'space-between',
                    marginBottom: 8
                  }}
                >

                  <b>
                    {
                      carpeta.categoria
                    }
                  </b>

                  <b>
                    {
                      formato(
                        carpeta.cash
                      )
                    }
                    €
                  </b>

                </div>

                <div
                  style={{
                    height: 12,
                    background:
                      '#e2e8f0',
                    borderRadius:
                      12,
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

              </div>

            )
          }
        )}

      </div>

      {carpetaActual && (

        <>

          {/* IN OUT CASH */}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr 1fr',
              gap: 10,
              marginBottom: 20
            }}
          >

            <div
              style={{
                background:
                  '#dcfce7',
                padding: 15,
                borderRadius:
                  15
              }}
            >
              <div>
                IN
              </div>
              <b>
                {
                  formato(
                    carpetaActual.in_amount
                  )
                }
                €
              </b>
            </div>

            <div
              style={{
                background:
                  '#fee2e2',
                padding: 15,
                borderRadius:
                  15
              }}
            >
              <div>
                OUT
              </div>
              <b>
                {
                  formato(
                    carpetaActual.out_amount
                  )
                }
                €
              </b>
            </div>

            <div
              style={{
                background:
                  '#dbeafe',
                padding: 15,
                borderRadius:
                  15
              }}
            >
              <div>
                CASH
              </div>
              <b>
                {
                  formato(
                    carpetaActual.cash
                  )
                }
                €
              </b>
            </div>

          </div>

          {/* EVOLUCION */}

          <div
            style={{
              background:
                'white',
              borderRadius:
                20,
              padding: 15,
              marginBottom:
                20
            }}
          >

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <LineChart
          data={obtenerEvolucion()}
        >
          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="mes"
          />

          <YAxis
            yAxisId="left"
            tickFormatter={
              (v) => `${v}€`
            }
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={
              (v) => `${v}€`
            }
          />

          <Tooltip
            formatter={(value: any) =>
              `${Number(value).toLocaleString(
                'es-ES',
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }
              )} €`
            }
          />

          <Legend />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="in_amount"
            name="IN"
            stroke="#16a34a"
            strokeWidth={3}
            dot={{ r: 4 }}
          />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="out_amount"
            name="OUT"
            stroke="#dc2626"
            strokeWidth={3}
            dot={{ r: 4 }}
          />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cash"
            name="CASH"
            stroke="#2563eb"
            strokeWidth={4}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>

          </div>

          {/* SUBCATEGORIAS */}

          <div>

            {datosSubcategorias.map(
              sub => {

                const porcentaje =
                  totalCategoria > 0
                    ? (
                        sub.total /
                        totalCategoria
                      ) * 100
                    : 0

                return (

                  <div
                    key={
                      sub.nombre
                    }
                    style={{
                      background:
                        'white',
                      borderRadius:
                        15,
                      padding:
                        15,
                      marginBottom:
                        10
                    }}
                  >

                    <div
                      style={{
                        display:
                          'flex',
                        justifyContent:
                          'space-between'
                      }}
                    >

                      <b>
                        {
                          sub.nombre
                        }
                      </b>

                      <b>
                        {
                          formato(
                            sub.total
                          )
                        }
                        €
                      </b>

                    </div>

                    <div
                      style={{
                        height: 10,
                        background:
                          '#e2e8f0',
                        marginTop: 10,
                        borderRadius:
                          10
                      }}
                    >

                      <div
                        style={{
                          width:
                            `${porcentaje}%`,
                          height:
                            '100%',
                          background:
                            '#2563eb',
                          borderRadius:
                            10
                        }}
                      />

                    </div>

                    <div
                      style={{
                        textAlign:
                          'right',
                        marginTop: 5,
                        fontSize: 12
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
            )}

          </div>

        </>

      )}

    </div>

  )
}