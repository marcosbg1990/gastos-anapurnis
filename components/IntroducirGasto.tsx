'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function IntroducirGasto() {

  const categorias: Record<string, string[]> = {

    INGRESO: [
      'Ana',
      'Marcos',
      'Otros'
    ],

    FIJOS: [
      'Hipoteca',
      'Comunidad',
      'Luz',
      'Agua',
      'Alarma',
      'Internet',
      'IBI',
      'S.Salud',
      'S.Hogar',
      'Apple',
      'Netflix',
      'Otros_FIJ'
    ],

    GENERAL: [
      'Farmacia',
      'Peluquería',
      'Gasolina',
      'Peajes',
      'Cafés',
      'Parking',
      'Cash',
      'Regalos',
      'Salud',
      'Otros_GEN'
    ],

    COMIDA: [
      'Supermercado',
      'Take_away'
    ],

    LARA_LUCA: [
      'Escuela',
      'Colegio',
      'Ingles',
      'Natación',
      'Baile',
      'Pañales',
      'Actividades',
      'Parques',
      'Ropa_LYL',
      'Juguetes',
      'Farmacia_LYL',
      'Otros_LYL'
    ],

    HOGAR: [
      'Mantenimiento_Hog',
      'Mejoras',
      'Limpieza'
    ],

    OCIO: [
      'Restaurante',
      'Cervezas',
      'Cultura'
    ],

    VIAJES: [
      'Grande',
      'Mediano',
      'Lisboa',
      'Cantabria',
      'Granada'
    ],

    VEHÍCULOS: [
      'Compra_grande',
      'Compra_pequeño',
      'Seg_CLA',
      'Seg_Ibiza',
      'Seg_Moto',
      'IVTM',
      'ITV',
      'Mantenimiento_Veh',
      'Multas'
    ],

    TECNOLOGÍA: [
      'Moviles',
      'Portatil',
      'Otros_Tecno'
    ],

    ROPA: [
      'Ropa_Ana',
      'Ropa_Marcos'
    ],

    CAPRICHOS: [
      'Ana_Capr',
      'Marcos_Capr',
      'Lara_Luca_Capr',
      'Todos_Capr',
      'Regalos_Capr'
    ],

    FUTURO_LYL: [
      'Ahorro_LYL',
      'Regalo_LYL',
      'Inversión'
    ],

    AHORRO: [
      'Ahorro'
    ]
  }

  const hoy =
    new Date()
      .toISOString()
      .split('T')[0]

  const [fecha, setFecha] =
    useState(hoy)

  const [importe, setImporte] =
    useState('')

  const [categoria, setCategoria] =
    useState('INGRESO')

  const [subcategoria, setSubcategoria] =
    useState('Ana')

  const [usuario, setUsuario] =
    useState('Marcos')

  const [descripcion, setDescripcion] =
    useState('')

  async function guardarGasto() {

    if (!importe) {

      alert(
        'Introduce un importe'
      )

      return
    }

    const { error } =
      await supabase
        .from('gastos')
        .insert([

          {
            Fecha: fecha,

            Importe:
              Number(
                importe.replace(
                  ',',
                  '.'
                )
              ),

            Categoria:
              categoria,

            Subcategoria:
              subcategoria,

            Descripcion:
              descripcion,

            Usuario:
              usuario
          }

        ])

    if (error) {

      console.error(error)

      alert(
        'Error al guardar'
      )

      return
    }

    alert(
      '✅ Gasto guardado'
    )

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

      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px'
        }}
      >

        <h2>
          ➕ Nuevo gasto
        </h2>

        <div
          style={{
            display: 'flex',
            flexDirection:
              'column',
            gap: '12px'
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
          />

          <input
            type="number"
            step="0.01"
            placeholder="Importe"
            value={importe}
            onChange={(e) =>
              setImporte(
                e.target.value
              )
            }
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
          >

            {Object.keys(
              categorias
            ).map((cat) => (

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
          >

            {categorias[
              categoria
            ].map((sub) => (

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
            placeholder="Comentario"
            value={descripcion}
            onChange={(e) =>
              setDescripcion(
                e.target.value
              )
            }
          />

          <button
            onClick={
              guardarGasto
            }
            style={{
              padding: '15px',
              border: 'none',
              borderRadius:
                '10px',
              background:
                '#2563eb',
              color: 'white',
              fontWeight:
                'bold',
              fontSize:
                '16px'
            }}
          >
            GUARDAR GASTO
          </button>

        </div>

      </div>

    </div>
  )
}