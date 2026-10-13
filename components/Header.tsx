type Props = {
  pantalla: string
  setPantalla: (
    pantalla: string
  ) => void
  usuario: string
}

export default function Header({
  pantalla,
  setPantalla,
  usuario
}: Props) {

  const opciones = [
    {
      nombre: 'NUEVO GASTO',
      icono: '➕'
    },
    {
      nombre: 'MOVIMIENTOS',
      icono: '💰'
    },
    {
      nombre: 'INFO MENSUAL',
      icono: '📈'
    },
    {
      nombre: 'INFO ANUAL',
      icono: '📊'
    }
  ]

  function cerrarSesion() {

    localStorage.removeItem(
      'usuario'
    )

    window.location.reload()
  }

  return (

    <div
      style={{
        position: 'relative',

        background:
          'linear-gradient(180deg,#051634,#0b2345)',

        borderRadius: '24px',

        padding: '12px',

        marginBottom: '20px',

        boxShadow:
          '0 8px 25px rgba(0,0,0,0.20)'
      }}
    >

      {/* LOGOUT */}

      <button
        onClick={
          cerrarSesion
        }
        style={{
          position: 'absolute',

          top: '10px',

          right: '10px',

          border: 'none',

          background:
            'transparent',

          color:
            'white',

          cursor:
            'pointer',

          fontSize:
            '20px'
        }}
      >
        🚪
      </button>

      {/* TITULO */}

      <div
        style={{
          color: 'white',

          textAlign: 'center',

          fontSize: '20px',

          fontWeight: 'bold',

          marginBottom: '6px'
        }}
      >
        Anapurnis
      </div>

      {/* USUARIO */}

      <div
        style={{
          textAlign:
            'center',

          marginBottom:
            '12px',

          fontSize:
            '30px'
        }}
      >
        {
          usuario === 'Ana'
            ? '👩🏻'
            : '🧔🏻‍♂️'
        }
      </div>

      {/* MENU */}

      <div
        style={{
          display: 'grid',

          gridTemplateColumns:
            'repeat(4,1fr)',

          gap: '8px'
        }}
      >

        {opciones.map(
          (opcion) => (

            <button
              key={
                opcion.nombre
              }

              onClick={() =>
                setPantalla(
                  opcion.nombre
                )
              }

              style={{
                border:
                  'none',

                borderRadius:
                  '18px',

                minHeight:
                  '55px',

                cursor:
                  'pointer',

                color:
                  'white',

                background:
                  pantalla ===
                  opcion.nombre
                    ? 'linear-gradient(135deg,#2563eb,#60a5fa)'
                    : 'linear-gradient(135deg,#10203d,#162f57)',

                boxShadow:
                  pantalla ===
                  opcion.nombre
                    ? '0 0 15px rgba(96,165,250,.7)'
                    : '0 3px 10px rgba(0,0,0,.3)',

                display:
                  'flex',

                justifyContent:
                  'center',

                alignItems:
                  'center'
              }}
            >

              <div
                style={{
                  fontSize:
                    '20px'
                }}
              >
                {
                  opcion.icono
                }
              </div>

            </button>

          )
        )}

      </div>

    </div>

  )
}