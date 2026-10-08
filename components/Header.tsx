type Props = {
  pantalla: string
  setPantalla: (pantalla: string) => void
}

export default function Header({
  pantalla,
  setPantalla
}: Props) {

  const opciones = [
    'INTRODUCIR GASTO',
    'MOVIMIENTOS',
    'RESUMEN MENSUAL',
    'RESUMEN ANUAL',
    'RESERVA1',
    'RESERVA2_prueba'
  ]

  return (
    <div
      style={{
        backgroundColor: '#0f172a',
        borderRadius: '12px',
        padding: '15px',
        marginBottom: '25px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
      }}
    >
      {/* TITULO APP */}

      <div
        style={{
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '15px'
        }}
      >
        💰 Gastos Familiares
      </div>

      {/* BOTONES MENU */}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        {opciones.map((opcion) => (

          <button
            key={opcion}
            onClick={() => setPantalla(opcion)}
            style={{
              border: 'none',
              borderRadius: '8px',
              padding: '12px 18px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',

              backgroundColor:
                pantalla === opcion
                  ? '#2563eb'
                  : '#334155',

              color: 'white',

              transition: '0.2s'
            }}
          >
            {opcion}
          </button>

        ))}
      </div>
    </div>
  )
}