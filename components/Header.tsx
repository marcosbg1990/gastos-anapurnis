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

        padding: '12px',

        marginBottom: '20px',

        boxShadow:
          '0 8px 25px rgba(0,0,0,0.20)'
      }}
    >

      <div
        style={{
          color: 'white',
          textAlign: 'center',
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '10px'
        }}
      >
        💰 Gastos Familiares
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px'
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

              minHeight: '65px',

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
                fontSize: '20px'
              }}
            >
              {opcion.icono}
            </div>



          </button>

        ))}

      </div>

    </div>

  )
}