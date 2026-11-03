'use client'

type Props = {

  categoria: string

  cash: number

  maximo: number

}

export default function CarpetaTanque({
  cash,
  maximo
}: Props) {

  const porcentaje =
    (cash / maximo) * 100

  let color = '#2563eb'

  if (cash < 0) {

    color = '#dc2626'

  } else if (porcentaje < 20) {

    color = '#f97316'

  } else if (porcentaje > 90) {

    color = '#16a34a'

  }

  return (

    <div>

      <h3
        style={{
          marginTop: 0
        }}
      >
        Estado carpeta
      </h3>

      <div
        style={{
          background: '#e5e7eb',
          height: '24px',
          borderRadius: '999px',
          overflow: 'hidden'
        }}
      >

        <div
          style={{
            width: `${Math.max(
              0,
              Math.min(
                porcentaje,
                100
              )
            )}%`,
            height: '100%',
            background: color,
            transition: '0.3s'
          }}
        />

      </div>

      <div
        style={{
          marginTop: '10px',
          fontWeight: 600
        }}
      >
        {porcentaje.toFixed(1)}%
      </div>

      <div
        style={{
          marginTop: '8px',
          color: '#475569'
        }}
      >
        Cash: {cash.toLocaleString('es-ES', {
          minimumFractionDigits: 2
        })} €
      </div>

      <div
        style={{
          color: '#475569'
        }}
      >
        Máximo: {maximo.toLocaleString('es-ES')} €
      </div>

    </div>

  )

}