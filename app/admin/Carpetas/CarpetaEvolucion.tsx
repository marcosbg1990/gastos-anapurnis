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

type Props = {

  data: {

    mes: string

    in_amount: number

    out_amount: number

    cash: number

  }[]

}

export default function CarpetaEvolucion({
  data
}: Props) {

  const datos = data.map(
    item => ({

      ...item,

      in_amount:
        Number(
          item.in_amount
        ) || 0,

      out_amount:
        Math.abs(Number(
          item.out_amount
        )) || 0,

      cash:
        Number(
          item.cash
        ) || 0

    })
  )

  return (

    <div>

      <h3
        style={{
          marginTop: 0,
          marginBottom: '15px'
        }}
      >
        Evolución 12 meses
      </h3>

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <LineChart
          data={datos}
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
              (v) =>
                `${v}€`
            }
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={
              (v) =>
                `${v}€`
            }
          />

          <Tooltip
            formatter={(
              value: any
            ) =>
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

          <Legend />

          <Line

            yAxisId="left"

            type="monotone"

            dataKey="in_amount"

            name="IN"

            stroke="#16a34a"

            strokeWidth={3}

            dot={{
              r: 4
            }}

            activeDot={{
              r: 6
            }}

          />

          <Line

            yAxisId="left"

            type="monotone"

            dataKey="out_amount"

            name="OUT"

            stroke="#dc2626"

            strokeWidth={3}

            dot={{
              r: 4
            }}

            activeDot={{
              r: 6
            }}

          />

          <Line

            yAxisId="right"

            type="monotone"

            dataKey="cash"

            name="CASH"

            stroke="#2563eb"

            strokeWidth={4}

            dot={{
              r: 4
            }}

            activeDot={{
              r: 6
            }}

          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  )

}