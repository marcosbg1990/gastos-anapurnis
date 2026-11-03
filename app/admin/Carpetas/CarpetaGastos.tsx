'use client'

import {
  Movimiento
} from './types'

import {
  useState
} from 'react'

type Props = {

  movimientos:
    Movimiento[]

}

export default function CarpetaGastos({
  movimientos
}: Props) {

  const [orden,
    setOrden] =
      useState('Fecha')

  const movimientosOrdenados =
    [...movimientos]
      .sort((a, b) => {

        if (
          orden === 'Importe'
        ) {

          return (
            Math.abs(
              b.Importe
            )
            -
            Math.abs(
              a.Importe
            )
          )

        }

        if (
          orden === 'Subcategoria'
        ) {

          return a.Subcategoria
            .localeCompare(
              b.Subcategoria
            )

        }

        return (
          new Date(
            b.Fecha
          ).getTime()
          -
          new Date(
            a.Fecha
          ).getTime()
        )

      })

  return (

    <div>

      <h3>
        Gastos del mes
      </h3>

      <div
        style={{
          maxHeight:
            '350px',

          overflowY:
            'auto'
        }}
      >

        <table
          style={{
            width: '100%'
          }}
        >

          <thead>

            <tr>

              <th
                onClick={() =>
                  setOrden(
                    'Fecha'
                  )
                }
              >
                Fecha
              </th>

              <th
                onClick={() =>
                  setOrden(
                    'Subcategoria'
                  )
                }
              >
                Subcategoría
              </th>

              <th>
                Descripción
              </th>

              <th
                onClick={() =>
                  setOrden(
                    'Importe'
                  )
                }
              >
                Importe
              </th>

            </tr>

          </thead>

          <tbody>

            {movimientosOrdenados.map(

              (mov) => (

                <tr
                  key={
                    mov.id
                  }
                >

                  <td>
                    {
                      mov.Fecha
                    }
                  </td>

                  <td>
                    {
                      mov.Subcategoria
                    }
                  </td>

                  <td>
                    {
                      mov.Descripcion
                    }
                  </td>

                  <td>
                    {
                      mov.Importe.toLocaleString(
                        'es-ES',
                        {
                          minimumFractionDigits:
                            2
                        }
                      )
                    }
                  </td>

                </tr>

              )

            )}

          </tbody>

        </table>

      </div>

    </div>

  )

}