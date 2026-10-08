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
          'linear-gradient(135deg,#0f172a,#1e293b)',
        borderRadius: '16px',
        padding: '15px',
        marginBottom: '20px',
        boxShadow:
          '0 4px 15px rgba(0,0,0,0.15)'
      }}
    >

      {/* TITULO */}

      <div
        style={{
          color: 'white',
          fontSize: '22px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '15px'
        }}
      >
        💰 Gastos Familiares
      </div>

      {/* MENU */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit,minmax(120px,1fr))',
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

              borderRadius: '12px',

              padding: '14px 10px',

              cursor: 'pointer',

              fontWeight: 'bold',

              fontSize: '13px',

              minHeight: '70px',

              display: 'flex',

              flexDirection: 'column',

              justifyContent: 'center',

              alignItems: 'center',

              gap: '5px',

              backgroundColor:
                pantalla === opcion.nombre
                  ? '#2563eb'
                  : '#334155',

              color: 'white',

              transition: 'all 0.2s'
            }}
          >

            <div
              style={{
                fontSize: '22px'
              }}
            >
              {opcion.icono}
            </div>

            <div>
              {opcion.nombre}
            </div>

          </button>

        ))}

      </div>

    </div>

  )
}