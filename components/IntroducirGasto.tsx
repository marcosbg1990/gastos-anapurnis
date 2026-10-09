'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { categorias } from '../lib/categorias'

export default function IntroducirGasto() {



  const hoy =
    new Date()
      .toISOString()
      .split('T')[0]

  const [fecha, setFecha] =
    useState(hoy)

  const [importe, setImporte] =
    useState('')

  const [categoria, setCategoria] =
    useState('UNSELECTED')

  const [subcategoria, setSubcategoria] =
    useState('')

  const [usuario, setUsuario] =
    useState('Ana')

  const [descripcion, setDescripcion] =
    useState('')

  async function guardarGasto() {

    const { error } =
      await supabase
        .from('gastos')
        .insert([
          {
            Fecha: fecha,
            Importe: Number(
              importe.replace(',', '.')
            ),
            Categoria: categoria,
            Subcategoria: subcategoria,
            Descripcion: descripcion,
            Usuario: usuario
          }
        ])

    if (error) {

      alert(
        'Error al guardar'
      )

      console.error(error)

      return
    }

    alert('✅ Gasto guardado')

    setImporte('')
    setDescripcion('')
  }

  return (

    <div
      style={{
        maxWidth: '600px',
        margin: 'auto'
      }}
    >



      {/* FORMULARIO */}

      <div
        style={{
          backgroundColor:
            'white',

          borderRadius:
            '18px',

          padding: '20px',

          boxShadow:
            '0 4px 10px rgba(0,0,0,0.08)'
        }}
      >

        <div
          style={{
            display: 'flex',
            flexDirection:
              'column',
            gap: '15px'
          }}
        >

          <input
            type="date"
            value={fecha}
            onChange={(e) =>
              setFecha(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            type="number"
            inputMode="decimal"
            enterKeyHint="done"
            step="0.01"
            placeholder="💶 Importe"
            value={importe}
            onChange={(e) =>
              setImporte(
                e.target.value
              )
            }
            style={{
              ...inputStyle,

              fontSize: '32px',

              fontWeight: 'bold',

              textAlign: 'center'
            }}
          />

          <select
            value={categoria}
            onChange={(e) => {

              setCategoria(
                e.target.value
              )

              setSubcategoria(
                categorias[
                  e.target.value
                ][0]
              )

            }}
            style={inputStyle}
          >

            {Object
              .keys(categorias)
              .map((cat) => (

                <option
                  key={cat}
                >
                  {cat}
                </option>

              ))}

          </select>

          <select
            value={subcategoria}
            onChange={(e) =>
              setSubcategoria(
                e.target.value
              )
            }
            style={inputStyle}
          >

            {(categorias[categoria] || []).map((sub) => (

              <option
                key={sub}
              >
                {sub}
              </option>

            ))}

          </select>

          <select
            value={usuario}
            onChange={(e) =>
              setUsuario(
                e.target.value
              )
            }
            style={inputStyle}
          >

            <option>
              Marcos
            </option>

            <option>
              Ana
            </option>

          </select>

          <textarea
            rows={4}
            placeholder="📝 Comentario"
            value={descripcion}
            onChange={(e) =>
              setDescripcion(
                e.target.value
              )
            }
            style={{
              ...inputStyle,
              resize: 'none'
            }}
          />

          <button
            onClick={
              guardarGasto
            }
            style={{
              border: 'none',

              borderRadius:
                '14px',

              padding: '16px',

              fontSize:
                '18px',

              fontWeight:
                'bold',

              background:
                'linear-gradient(135deg,#0ea5e9,#1d4ed8)',

              color: 'white',

              cursor:
                'pointer'
            }}
          >
            💾 GUARDAR GASTO
          </button>

        </div>

      </div>

    </div>

  )
}

const inputStyle = {

  padding: '14px',

  borderRadius: '12px',

  border:
    '1px solid #dbe4ee',

  fontSize: '16px',

  width: '100%',

  backgroundColor:
    '#f8fafc'

} as const