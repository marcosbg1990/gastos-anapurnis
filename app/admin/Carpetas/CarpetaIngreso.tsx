'use client'

type Props = {

  valor: number

  recomendado: number
  existeMesSiguiente: boolean
  categoria: string
  onGuardar: (
    valor: number
  ) => void

}

export default function CarpetaIngreso({
  valor,
  recomendado,
  existeMesSiguiente,
  categoria,
  onGuardar,
  
}: Props) {

  return (

    <div>

    <div
      style={{
        position: 'relative',
        width: '140px'
      }}
    >

      <input
        type="text"
        defaultValue={valor}
        id={`ingreso-${categoria}`}
        style={{
          width: '100%',
          height: '50px',
          textAlign: 'center',
          fontSize: '28px',
          fontWeight: 'bold',
          borderRadius: '10px',
          border:
            existeMesSiguiente
            ? '1px solid #ccc'
            : '2px solid red',

          color:
            existeMesSiguiente
            ? '#000'
            : 'red'
        }}
      />

      <span
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#64748b'
        }}
      >
        €
      </span>

    </div>


      <div
        style={{

          color: '#64748b',

          marginBottom: '20px'

        }}
      >

        Recomendado:

        {' '}

        {Number(
          recomendado
        ).toLocaleString(
          'es-ES'
        )}

        €

      </div>

      <button

        onClick={() => {

          const input =
            document.getElementById(
              `ingreso-${categoria}`
            ) as HTMLInputElement

          onGuardar(
            Number(
              input.value
                .replace(',', '.')
            )
          )

        }}

        style={{

          width: '110px',

          background: '#2563eb',

          color: 'white',

          border: 'none',

          borderRadius: '10px',

          padding: '12px',

          cursor: 'pointer',

          fontWeight: 'bold'

        }}

      >

        Guardar

      </button>

    </div>

  )

}