type Props = {
  pantalla: string
  setPantalla: (pantalla: string) => void
}

export default function Header({
  pantalla,
  setPantalla
}: Props) {

  const opciones = [
    {
      nombre: 'NUEVO GASTO',
      icono: '➕'
    },
    {
      nombre: 'MOVIMIENTOS',
      icono: '📋'
    },
    {
      nombre: 'INFO MENSUAL',
      icono: '📊'
    },
    {
      nombre: 'INFO ANUAL',
      icono: '📈'
    }
  ]

  return (

    <div
      style={{
        background:
          'linear-gradient(180deg,#051634,#0b2345)',

        borderRadius: '24px',

        padding: '16px',

        marginBottom: '20px',

        boxShadow:
          '0 8px 25px rgba(0,0,0,0.20)'
      }}
    >

      <div
        style={{
          color: 'white',
          textAlign: 'center',
          fontSize: '26px',
          fontWeight: 'bold',
          marginBottom: '14px'
        }}
      >
        💰 Gastos Familiares
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px'
        }}
      >

        {opciones.map((opcion) => (

          <button
            key={opcion.nombre}

            onClick={() =>
              setPantalla(
                opcion.nombre
              )
            }

            style={{
              border: 'none',

              borderRadius: '18px',

              minHeight: '90px',

              cursor: 'pointer',

              color: 'white',

              background:
                pantalla === opcion.nombre
                  ? 'linear-gradient(135deg,#2563eb,#60a5fa)'
                  : 'linear-gradient(135deg,#10203d,#162f57)',

              boxShadow:
                pantalla === opcion.nombre
                  ? '0 0 20px rgba(96,165,250,.7)'
                  : '0 3px 10px rgba(0,0,0,.3)',

              display: 'flex',

              flexDirection: 'column',

              justifyContent: 'center',

              alignItems: 'center'
            }}
          >

            <div
              style={{
                fontSize: '30px'
              }}
            >
              {opcion.icono}
            </div>

            <div
              style={{
                marginTop: '6px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              {opcion.nombre}
            </div>

          </button>

        ))}

      </div>

    </div>

  )
}