'use client'

import { Carpeta, Movimiento } from './types'
import CarpetaPieChart from './CarpetaPieChart'
import CarpetaEvolucion from './CarpetaEvolucion'
import CarpetaTanque from './CarpetaTanque'
import CarpetaGastos from './CarpetaGastos'
import CarpetaIngreso from './CarpetaIngreso'

type Props = {

  carpeta: Carpeta
  movimientos: Movimiento[]
  pieData: any[]
  evolucionData: any[]
  presupuestoSiguiente:
    number | null
  existeMesSiguiente: boolean
  onGuardarIngreso: ( valor: number  ) => void
}

    const MENSUALES = {

      FIJOS: 1239,
      GENERAL: 510,
      COMIDA: 500,
      LARA_LUCA: 600,
      HOGAR: 550,
      OCIO: 160,
      VIAJES: 170,
      VEHÍCULOS: 620,
      TECNOLOGÍA: 70,
      ROPA: 30,
      CAPRICHOS: 65,
      FUTURO_LYL: 70,
      AHORRO: 200

    }

    function obtenerMensual(
      categoria: string
    ) {

      return MENSUALES[
        categoria as keyof typeof MENSUALES
      ] || 0

    }
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

  return MAXIMOS[
    categoria as keyof typeof MAXIMOS
  ] || 1000

}
export default function CarpetaCard({
  carpeta,
  movimientos,
  pieData,
  evolucionData,
  presupuestoSiguiente,
  existeMesSiguiente,
  onGuardarIngreso
}: Props) {

  const formatoMoneda = (
    valor: number
  ) => {

    return Number(
      valor
    ).toLocaleString(
      'es-ES',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    )

  }

  const nombresMeses = [
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

  const fechaSiguiente =
    new Date(
      Number(carpeta.anio),
      Number(carpeta.mes),
      1
    )
  const cashTanque =
    Number(carpeta.cash) +
    Number(presupuestoSiguiente || 0)
  const textoIngreso =
    `Presupuesto ${
      nombresMeses[
        fechaSiguiente.getMonth()
      ]
    } ${
      fechaSiguiente.getFullYear()
    }`

  return (

    <div
      style={{

        backgroundColor: '#ffffff',

        borderRadius: '20px',

        padding: '24px',

        marginBottom: '25px',

        boxShadow:
          '0 8px 20px rgba(0,0,0,0.08)',

        width: '100%',
        boxSizing: 'border-box'

      }}
    >

      {/* CABECERA */}

      <div
        style={{

          display: 'flex',

          justifyContent:
            'space-between',

          alignItems:
            'center',

          marginBottom:
            '20px'

        }}
      >

        <h2
          style={{
            margin: 0
          }}
        >
          📁 {carpeta.categoria}
        </h2>

        <div
          style={{

            background:
              '#f1f5f9',

            padding:
              '10px 16px',

            borderRadius:
              '12px',

            fontWeight:
              'bold'

          }}
        >

          CASH

          {' '}

          {formatoMoneda(
            carpeta.cash
          )}

          €

        </div>

      </div>

      {/* RESUMEN */}

      <div
        style={{

          display: 'grid',

          gridTemplateColumns:
            'repeat(3, 1.2fr)',

          gap: '12px',

          marginBottom:
            '20px'

        }}
      >

        <div
          style={{
            background:
              '#dcfce7',
            padding:
              '16px',
            borderRadius:
              '12px'
          }}
        >

          <div>
            IN
          </div>

          <div
            style={{
              fontSize:
                '24px',
              fontWeight:
                'bold'
            }}
          >

            {formatoMoneda(
              carpeta.in_amount
            )}
            €

          </div>

        </div>

        <div
          style={{
            background:
              '#fee2e2',
            padding:
              '16px',
            borderRadius:
              '12px'
          }}
        >

          <div>
            OUT
          </div>

          <div
            style={{
              fontSize:
                '24px',
              fontWeight:
                'bold'
            }}
          >

            {formatoMoneda(
              carpeta.out_amount
            )}
            €

          </div>

        </div>

        <div
          style={{
            background:
              '#dbeafe',
            padding:
              '16px',
            borderRadius:
              '12px'
          }}
        >

          <div>
            CASH
          </div>

          <div
            style={{
              fontSize:
                '24px',
              fontWeight:
                'bold'
            }}
          >

            {formatoMoneda(
              carpeta.cash
            )}
            €

          </div>

        </div>

      </div>

      {/* CUERPO */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.5fr',
          gap: '20px'
        }}
      >

        {/* IZQUIERDA */}

        <div
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '15px',
            minHeight: '500px'
          }}
        >

          <CarpetaGastos
            movimientos={movimientos}
          />

        </div>

        {/* DERECHA */}

        <div
          style={{
            display: 'grid',
            gridTemplateRows: 'auto 1fr',
            gap: '20px'
          }}
        >

          {/* Tanque + Ingreso */}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px'
            }}
          >

            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '15px'
              }}
            >


            <CarpetaTanque
                categoria={carpeta.categoria}
                cash={cashTanque}
                maximo={
                  obtenerMaximo(
                    carpeta.categoria
                  )
                }
              />

            </div>

            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '15px'
              }}
            >
            <h4
              style={{
                marginTop: 0,
                marginBottom: '10px'
              }}
            >
              {textoIngreso}
            </h4>
            <CarpetaIngreso

              valor={
                presupuestoSiguiente ?? 0
              }

              recomendado={
                obtenerMensual(
                  carpeta.categoria
                )
              }

              existeMesSiguiente={
                existeMesSiguiente
              }
              
              categoria={carpeta.categoria}

              onGuardar={
                onGuardarIngreso
              }

            />

            </div>

          </div>

          {/* PIE CHART */}

          <div
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '15px'
            }}
          >

            <CarpetaPieChart
              data={pieData}
            />

          </div>

        </div>

      </div>

      {/* EVOLUCION */}

      <div
        style={{
          marginTop: '20px',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '15px'
        }}
      >

        <CarpetaEvolucion
          data={evolucionData}
        />

      </div>

    </div> 

  )

}