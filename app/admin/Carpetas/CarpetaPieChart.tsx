'use client'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

type Props = {

  data: {

    nombre: string

    importe: number

  }[]

}

const COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#06B6D4',
  '#F97316',
  '#EC4899',
  '#84CC16',
  '#6366F1'
]

export default function CarpetaPieChart({
  data
}: Props) {

  const datosLimpios =
    data.map((item) => ({

      nombre: item.nombre,

      importe:
        Number(item.importe) || 0

    }))

  const total =
    datosLimpios.reduce(
      (acc, item) =>
        acc + item.importe,
      0
    )

  return (

    <div
      style={{
        display: 'flex',
        gap: '20px',
        height: '100%'
      }}
    >

      {/* DONUT */}

      <div
        style={{
          width: '55%',
          height: '220px',
          position: 'relative'
        }}
      >

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={datosLimpios}
              dataKey="importe"
              nameKey="nombre"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
            >

              {datosLimpios.map(
                (_, index) => (

                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index %
                        COLORS.length
                      ]
                    }
                  />

                )
              )}

            </Pie>

            <Tooltip
              formatter={(value) =>

                `${Number(value)
                  .toLocaleString(
                    'es-ES',
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }
                  )} €`

              }
            />

          </PieChart>

        </ResponsiveContainer>

        {/* TOTAL CENTRO */}

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform:
              'translate(-50%, -50%)',
            textAlign: 'center'
          }}
        >

          <div
            style={{
              fontSize: '22px',
              fontWeight: 700
            }}
          >
            {total.toLocaleString(
              'es-ES',
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }
            )} €
          </div>

          <div
            style={{
              color: '#64748b',
              fontSize: '13px'
            }}
          >
            Total
          </div>

        </div>

      </div>

      {/* LEYENDA */}

      <div
        style={{
          width: '45%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '14px'
        }}
      >

        {datosLimpios
          .sort(
            (a, b) =>
              b.importe -
              a.importe
          )
          .map((item, index) => (

            <div
              key={item.nombre}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'space-between',
                gap: '10px'
              }}
            >

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >

                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background:
                      COLORS[
                        index %
                        COLORS.length
                      ]
                  }}
                />

                <span>
                  {item.nombre}
                </span>

              </div>

              <strong>
                {item.importe.toLocaleString(
                  'es-ES',
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }
                )} €
              </strong>

            </div>

          ))}

      </div>

    </div>

  )

}