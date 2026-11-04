'use client'

import { useEffect, useState } from 'react'

import { supabase } from '../../../lib/supabase'

import CarpetaCard from './CarpetaCard'

import { Carpeta, Movimiento } from './types'


function guardarSaldoBanco(
  saldo: number
) {

  localStorage.setItem(
    'saldoBanco',
    saldo.toString()
  )

}

function obtenerSaldoBanco() {

  const saldo =
    localStorage.getItem(
      'saldoBanco'
    )

  return saldo
    ? Number(saldo)
    : 0

}

function obtenerSiguienteMes(
  anio: number,
  mes: number
) {

  if (mes === 12) {

    return {
      anio: anio + 1,
      mes: 1
    }

  }

  return {
    anio,
    mes: mes + 1
  }

}

export default function AdminCarpetas() {

  const hoy = new Date()

  const fechaAnterior =
    new Date(
      hoy.getFullYear(),
      hoy.getMonth() - 1,
      1
    )

  const [historicoCarpetas,
    setHistoricoCarpetas] =
      useState<any[]>([])

  const [gastos, setGastos] =
    useState<Movimiento[]>([])

  const [anio, setAnio] =
    useState(
      fechaAnterior.getFullYear()
    )

  const [mes, setMes] =
    useState(
      fechaAnterior.getMonth() + 1
    )

  const [carpetas, setCarpetas] =
    useState<Carpeta[]>([])

  const [loading, setLoading] =
    useState(true)

  const [saldoBanco,
    setSaldoBanco] =
      useState(0)
  const [
    ingresosMesSiguiente,
    setIngresosMesSiguiente
  ] = useState(0)

  useEffect(() => {

    cargarCarpetas()

    cargarGastos()

    cargarHistorico()

  }, [anio, mes])

  useEffect(() => {

    const saldo =
      obtenerSaldoBanco()

    setSaldoBanco(
      saldo
    )

  }, [])

  useEffect(() => {

    if (
      gastos.length > 0 ||
      carpetas.length > 0
    ) {

      calcularResumenMes()

    }

  }, [
    gastos,
    carpetas
  ])

  async function actualizarCarpetasMes() {

    for (const carpeta of carpetas) {

      const gastosCategoria =
        gastos.filter(
          g =>
            g.Categoria ===
            carpeta.categoria
        )

      const outReal =
        gastosCategoria.reduce(
          (acc, g) =>
            acc +
            Number(g.Importe),
          0
        )

      const cashAnterior =
        historicoCarpetas
          .filter(
            c =>
              c.categoria === carpeta.categoria &&
              (
                c.anio * 100 + c.mes
              ) <
              (
                anio * 100 + mes
              )
          )
          .sort(
            (a, b) =>
              (b.anio * 100 + b.mes)
              -
              (a.anio * 100 + a.mes)
          )[0]

      const cashBase =
        cashAnterior
          ? Number(
              cashAnterior.cash
            )
          : 0

      const cashNuevo =
        cashBase +
        Number(
          carpeta.in_amount
        ) +
        outReal

      const { error } =
        await supabase
          .from('carpetas')
          .update({
            out_amount:
              outReal,
            cash:
              cashNuevo
          })
          .eq(
            'id',
            carpeta.id
          )

    }

    await cargarCarpetas()

    await cargarHistorico()

    alert(
      'Carpetas actualizadas'
    )

  }
    async function cargarHistorico() {

    const { data, error } =
      await supabase
        .from('carpetas')
        .select('*')

    if (error) {

      console.error(error)

      return

    }

    setHistoricoCarpetas(
      data || []
    )

  }

  function obtenerEvolucionCategoria(
    categoria: string
  ) {

    const historico =

      historicoCarpetas

        .filter(
          c =>
            c.categoria ===
            categoria
        )

        .sort((a, b) => {

          const fechaA =
            a.anio * 100 + a.mes

          const fechaB =
            b.anio * 100 + b.mes

          return fechaA - fechaB

        })

    const indiceActual =
      historico.findIndex(
        c =>
          c.anio === anio &&
          c.mes === mes
      )

    if (indiceActual === -1) {

      return []

    }

    const inicio =
      Math.max(
        0,
        indiceActual - 11
      )

    const fin =
      Math.min(
        historico.length,
        indiceActual + 2
      )

    return historico

      .slice(
        inicio,
        fin
      )

      .map((c) => ({

        mes:
          `${String(
            c.mes
          ).padStart(
            2,
            '0'
          )}/${String(
            c.anio
          ).slice(-2)}`,

        in_amount:
          Number(
            c.in_amount || 0
          ),

        out_amount:
          Number(
            c.out_amount || 0
          ),

        cash:
          Number(
            c.cash || 0
          )

      }))

  }


  async function cargarGastos() {

const respuesta =
    await supabase
      .from('gastos')
      .select('*', { count: 'exact' })
      .order('id', {
        ascending: false
      })
      .range(0, 999)

      const {
        data,
        error,
        count
      } = respuesta

    if (error) {

      console.error(error)

      return

    }

    const gastosMes =
      (data || []).filter((g: any) => {

        const [y, m] =
          g.Fecha.split('-')

        return (
          Number(y) === anio &&
          Number(m) === mes
        )

      })

    setGastos(gastosMes)
    const siguiente =
      obtenerSiguienteMes(
        anio,
        mes
      )

    const ingresosSiguiente =
      (data || [])
        .filter((g: any) => {
          const [y, m] =
            g.Fecha.split('-')

          return (
            g.Categoria === 'INGRESO' &&
            Number(y) === siguiente.anio &&
            Number(m) === siguiente.mes
          )
        })
        .reduce(
          (acc, g) =>
            acc + Number(g.Importe),
          0
        )

    setIngresosMesSiguiente(
      ingresosSiguiente
    )
  }
  async function guardarPresupuestoMesSiguiente(
    categoria: string,
    nuevoInAmount: number
  ) {

    let siguienteMes = mes + 1
    let siguienteAnio = anio

    if (siguienteMes > 12) {

      siguienteMes = 1
      siguienteAnio++

    }

    const {
      data: existente,
      error: errorBusqueda
    } =
      await supabase
        .from('carpetas')
        .select('*')
        .eq(
          'anio',
          siguienteAnio
        )
        .eq(
          'mes',
          siguienteMes
        )
        .eq(
          'categoria',
          categoria
        )
        .maybeSingle()

    if (errorBusqueda) {

      console.error(errorBusqueda)

      return

    }

    if (existente) {

      const { error } =
        await supabase

          .from('carpetas')

          .update({

            in_amount:
              nuevoInAmount

          })

          .eq(
            'id',
            existente.id
          )

      if (error) {

        console.error(error)

        return

      }

    } else {

      const { error } =
        await supabase

          .from('carpetas')

          .insert({

            anio:
              siguienteAnio,

            mes:
              siguienteMes,

            categoria,

            in_amount:
              nuevoInAmount

          })

      if (error) {

        console.error(error)

        return

      }

    }

    await cargarHistorico()

    alert(
      `Presupuesto guardado para ${categoria}`
    )

  }
  async function cargarCarpetas() {

    const { data, error } =
      await supabase
        .from('carpetas')
        .select('*')
        .eq('anio', anio)
        .eq('mes', mes)

    if (error) {

      console.error(error)

      return

    }

    const ordenCategorias = [

      'FIJOS',
      'GENERAL',
      'COMIDA',
      'LARA_LUCA',
      'HOGAR',
      'OCIO',
      'VIAJES',
      'VEHÍCULOS',
      'TECNOLOGÍA',
      'ROPA',
      'CAPRICHOS',
      'FUTURO_LYL',
      'AHORRO'

    ]

    const carpetasOrdenadas =
      [...(data || [])]
        .sort(
          (a, b) =>
            ordenCategorias.indexOf(a.categoria)
            -
            ordenCategorias.indexOf(b.categoria)
        )

    setCarpetas(carpetasOrdenadas)

    setLoading(false)

  }

  const meses = [

    { id: 1, nombre: 'Enero' },
    { id: 2, nombre: 'Febrero' },
    { id: 3, nombre: 'Marzo' },
    { id: 4, nombre: 'Abril' },
    { id: 5, nombre: 'Mayo' },
    { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' },
    { id: 8, nombre: 'Agosto' },
    { id: 9, nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' },
    { id: 11, nombre: 'Noviembre' },
    { id: 12, nombre: 'Diciembre' }

  ]

  const [resumenMes, setResumenMes] =
    useState({
      gastos: 0,
      gastosCarpetas: 0,
      ingresos: 0,
      saldo: 0,
      ana: 0,
      marcos: 0,
      otros: 0
    })

    function calcularResumenMes() {

    const gastosTotales =
      gastos
        .filter(
          g =>
            g.Categoria !==
            'INGRESO'
        )
        .reduce(
          (acc, g) =>
            acc +
            Number(
              g.Importe
            ),
          0
        )


      const gastosCarpetasTotales =
        carpetas.reduce(
          (acc, c) =>
            acc +
            Number(c.out_amount),
          0
        )

      const ingresosTotales =
        carpetas.reduce(
          (acc, c) =>
            acc +
            Number(c.in_amount),
          0
        )

      const saldoTotal =
        carpetas.reduce(
          (acc, c) =>
            acc +
            Number(c.cash),
          0
        )

      const ana =
        gastos
          .filter(
            g =>
              g.Subcategoria === 'Ana'
          )
          .reduce(
            (acc, g) =>
              acc +
              Number(g.Importe),
            0
          )

      const marcos =
        gastos
          .filter(
            g =>
              g.Subcategoria === 'Marcos'
          )
          .reduce(
            (acc, g) =>
              acc +
              Number(g.Importe),
            0
          )

      const otros =
        gastos
          .filter(
            g =>
              g.Subcategoria === 'Otros'
          )
          .reduce(
            (acc, g) =>
              acc +
              Number(g.Importe),
            0
          )

      setResumenMes({

        gastos:
          Math.abs(
            gastosTotales
          ),
        gastosCarpetas:
          Math.abs(
            gastosCarpetasTotales
          ),

        ingresos:
          ingresosTotales,

        saldo:
          saldoTotal,

        ana:
          Math.abs(ana),

        marcos:
          Math.abs(marcos),

        otros:
          Math.abs(otros)

      })

    }

  const anios = [

    2023,
    2024,
    2025,
    2026,
    2027,
    2028

  ]
  const siguiente =
    obtenerSiguienteMes(
      anio,
      mes
    )

  const carpetasMesSiguiente =
    historicoCarpetas.filter(
      c =>
        c.anio === siguiente.anio &&
        c.mes === siguiente.mes
    )

  const saldoCarpetasMesSiguiente =
    carpetasMesSiguiente.reduce(
      (acc, c) =>
        acc +
        Number(c.cash || 0),
      0
    )

  const ingresosCarpetasMesSiguiente =
    carpetasMesSiguiente.reduce(
      (acc, c) =>
        acc +
        Number(c.in_amount || 0),
      0
    )
  const pendienteCarpetasMesSiguiente =
    ingresosMesSiguiente -
    ingresosCarpetasMesSiguiente
    
  const nombreMesSiguiente =
    meses.find(
      m => m.id === siguiente.mes
    )?.nombre
    
  return (

    <div
      style={{
        width: '100%',
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '25px'
        }}
      >

        <div
          style={{
            display: 'flex',
            gap: '10px'
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

            {meses.map((m) => (

              <option
                key={m.id}
                value={m.id}
              >
                {m.nombre}
              </option>

            ))}

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

            {anios.map((a) => (

              <option
                key={a}
                value={a}
              >
                {a}
              </option>

            ))}

          </select>

        </div>

        </div>

        <button
          onClick={actualizarCarpetasMes}
          style={{
            padding: '10px 20px',
            background: '#16a34a',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}
        >
          🔄 Actualizar carpetas
        </button>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '1.2fr 1.2fr 1fr',
            gap: '40px',
            marginBottom: '30px',
            alignItems: 'start'
          }}
        >

          {/* IZQUIERDA */}

          <div>

            <div
              style={{
                border: '3px solid #0ea5e9',
                padding: '6px 10px',
                marginBottom: '18px',
                display: 'flex',
                    gap: '12px',
                justifyContent:
                  'space-between'
              }}
            >
              <span>
                Saldo en carpetas
              </span>

              <b>
                {resumenMes.saldo
                  .toLocaleString(
                    'es-ES',
                    {
                      minimumFractionDigits: 2
                    }
                  )}
                €
              </b>
            </div>

            <div
              style={{
                border: '3px solid #22c55e',
                padding: '6px 10px',
                marginBottom: '18px',
                display: 'flex',
                justifyContent:
                  'space-between'
              }}
            >
              <span>
                Ingresos en carpetas
              </span>

              <b>
                {resumenMes.ingresos
                  .toLocaleString(
                    'es-ES',
                    {
                      minimumFractionDigits: 2
                    }
                  )}
                €
              </b>
            </div>

            <div
              style={{
                border: '3px solid #dc2626',
                padding: '6px 10px',
                display: 'flex',
                justifyContent:
                  'space-between'
              }}
            >
              <span>
                Gastos totales
              </span>

              <b>
                {resumenMes.gastos
                  .toLocaleString(
                    'es-ES',
                    {
                      minimumFractionDigits: 2
                    }
                  )}
                €
              </b>
              <span>
                Gastos Carpetas
              </span>

              <b>
                {resumenMes.gastosCarpetas
                  .toLocaleString(
                    'es-ES',
                    {
                      minimumFractionDigits: 2
                    }
                  )}
                €
              </b>

            </div>

          </div>

          {/* CENTRO */}

          <div>

            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                marginBottom: '8px'
              }}
            >
              <span>
                Ingreso Ana
              </span>

              <b>
                {resumenMes.ana.toFixed(2)} €
              </b>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                marginBottom: '8px'
              }}
            >
              <span>
                Ingreso Marcos
              </span>

              <b>
                {resumenMes.marcos.toFixed(2)} €
              </b>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                marginBottom: '8px'
              }}
            >
              <span>
                Ingreso Otros
              </span>

              <b>
                {resumenMes.otros.toFixed(2)} €
              </b>
            </div>

            <hr />

            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                fontWeight: 'bold'
              }}
            >
              <span>
                Ingreso Total
              </span>

              <span>
                {(
                  resumenMes.ana +
                  resumenMes.marcos +
                  resumenMes.otros
                ).toFixed(2)}
                €
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between'
              }}
            >
              <span>
                Pendiente de meter en carpetas
              </span>

              <span>
                {(
                  resumenMes.ana +
                  resumenMes.marcos +
                  resumenMes.otros - 
                  resumenMes.ingresos
                ).toFixed(2)}
                €
              </span>
            </div>
          </div>

          {/* DERECHA */}

          <div>

            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems:
                  'center',
                marginBottom: '25px'
              }}
            >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >

              </div>
              <span>
                Saldo del banco:
              </span>

              <input
                type="number"
                value={saldoBanco}
                onChange={(e) =>
                  setSaldoBanco(
                    Number(
                      e.target.value
                    )
                  )
                }

                style={{
                  width: '190px',
                  textAlign: 'right',
                  fontSize: 22,
                  fontWeight: 'bold',
                  border: '3px solid black',
                  padding: '4px'
                }}
                onBlur={() =>
                  guardarSaldoBanco(
                    saldoBanco
                  )
                }
              />
            <span
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontWeight: 'bold'
              }}
            >
              €
            </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between'
              }}
            >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
            flexDirection: 'column',
            gap: '12px'
              }}
            >


              <span>
                Saldo {nombreMesSiguiente}
              </span>

              <b>
                {saldoCarpetasMesSiguiente
                  .toLocaleString(
                    'es-ES',
                    {
                      minimumFractionDigits: 2
                    }
                  )}
                €
              </b>
            </div>

            <div
              style={{
                display: 'flex',
            flexDirection: 'column',
            gap: '12px'
              }}
            >


              <span>
                Ingresos {nombreMesSiguiente}
              </span>

              <b>
                {ingresosMesSiguiente
                  .toLocaleString(
                    'es-ES',
                    {
                      minimumFractionDigits: 2
                    }
                  )}
                €
              </b>
            </div>
            <div
              style={{
                display: 'flex',
            flexDirection: 'column',
            gap: '12px'
              }}
            >

              <span>
                Pte. Carpetas:
              </span>

              <b>
                {(
                  pendienteCarpetasMesSiguiente
                ).toLocaleString(
                  'es-ES',
                  {
                    minimumFractionDigits: 2
                  }
                )}
                €
              </b>
            </div>
            </div>

          </div>

        </div>

      {carpetas.map((carpeta) => {

      const siguiente =
        obtenerSiguienteMes(
          anio,
          mes
        )

      const presupuestoSiguiente =
        historicoCarpetas.find(

          c =>

            c.anio === siguiente.anio &&

            c.mes === siguiente.mes &&

            c.categoria === carpeta.categoria

        )
        const movimientosCategoria =
          gastos.filter(
            (g) =>
              g.Categoria ===
              carpeta.categoria
          )

          
        const pieData =
        
          Object.values(

            movimientosCategoria.reduce(

              (acc: any, mov) => {

                if (
                  !acc[
                    mov.Subcategoria
                  ]
                ) {

                  acc[
                    mov.Subcategoria
                  ] = {

                    nombre:
                      mov.Subcategoria,

                    importe: 0

                  }

                }

                acc[
                  mov.Subcategoria
                ].importe +=
                  Math.abs(
                    Number(
                      mov.Importe
                    )
                  )

                return acc

              },

              {}

            )

          )
        const evolucionData =
          obtenerEvolucionCategoria(
            carpeta.categoria
          )

        return (

        <CarpetaCard
          key={carpeta.id}
          carpeta={carpeta}
          movimientos={movimientosCategoria}
          pieData={pieData}
          evolucionData={evolucionData}
          presupuestoSiguiente={
            presupuestoSiguiente !== undefined
            ? Number(
                presupuestoSiguiente.in_amount
              )
            : null
          }
          existeMesSiguiente={
            !!presupuestoSiguiente
          }
          onGuardarIngreso={
            (valor) =>

              guardarPresupuestoMesSiguiente(
                carpeta.categoria,
                valor
              )
          }
        />

        )

      })}

    </div>

  )

}