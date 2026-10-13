'use client'

import { useState } from 'react'

type Props = {
  onLogin: (
    usuario: string
  ) => void
}

export default function Login({
  onLogin
}: Props) {

  const [usuario, setUsuario] =
    useState('Ana')

  const [password, setPassword] =
    useState('')

  function entrar() {

    if (
      password !== 'Anapurnis22'
    ) {

      alert(
        'Contraseña incorrecta'
      )

      return
    }

    localStorage.setItem(
      'usuario',
      usuario
    )

    onLogin(usuario)
  }

  return (

    <div
      style={{
        maxWidth: '400px',
        margin: '50px auto'
      }}
    >

      <div
        style={{
          background:
            'white',

          padding:
            '20px',

          borderRadius:
            '20px'
        }}
      >

        <h2>
          💰 Gastos Familiares
        </h2>

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
            Ana
          </option>

          <option>
            Marcos
          </option>
        </select>

        <input
          type="password"

          placeholder="Contraseña"

          value={password}

          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }

          style={inputStyle}
        />

        <button
          onClick={entrar}
          style={botonStyle}
        >
          Entrar
        </button>

      </div>

    </div>

  )
}

const inputStyle = {

  width: '100%',

  padding: '12px',

  marginBottom: '10px',

  borderRadius: '10px',

  border:
    '1px solid #dbe4ee'

} as const

const botonStyle = {

  width: '100%',

  padding: '12px',

  border: 'none',

  borderRadius: '10px',

  background:
    '#2563eb',

  color:
    'white',

  fontWeight:
    'bold'

} as const