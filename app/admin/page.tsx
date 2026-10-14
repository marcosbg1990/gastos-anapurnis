'use client'

import { useState } from 'react'

import AdminGastos from './AdminGastos'
import AdminImportar from './AdminImportar'
import AdminExportar from './AdminExportar'
import AdminCategorias from './AdminCategorias'
import AdminEstadisticas from './AdminEstadisticas'
import AdminBaseDatos from './AdminBaseDatos'
import AdminCarpetas from './AdminCarpetas'

export default function AdminPage() {

  const [pantalla, setPantalla] =
    useState('GASTOS')

  const menu = [

    {
      nombre: 'GASTOS',
      icono: '💰'
    },

    {
      nombre: 'IMPORTAR',
      icono: '📥'
    },

    {
      nombre: 'EXPORTAR',
      icono: '📤'
    },

    {
      nombre: 'CATEGORIAS',
      icono: '🏷️'
    },

    {
      nombre: 'ESTADISTICAS',
      icono: '📊'
    },

    {
      nombre: 'BASE DATOS',
      icono: '🗄️'
    },

    {
      nombre: 'CARPETAS',
      icono: '📁'
    }

  ]

  return (

    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}
    >

      {/* MENU LATERAL */}

      <div
        style={{
          width: '250px',

          backgroundColor: '#0f172a',

          color: 'white',

          padding: '20px',

          boxShadow:
            '2px 0px 10px rgba(0,0,0,0.1)'
        }}
      >

        <h2
          style={{
            marginBottom: '25px'
          }}
        >
          ⚙️ Anapurnis Admin
        </h2>

        {menu.map((item) => (

          <button
            key={item.nombre}

            onClick={() =>
              setPantalla(
                item.nombre
              )
            }

            style={{
              width: '100%',

              textAlign: 'left',

              padding: '14px',

              marginBottom: '8px',

              border: 'none',

              borderRadius: '10px',

              cursor: 'pointer',

              fontSize: '15px',

              backgroundColor:
                pantalla === item.nombre
                  ? '#2563eb'
                  : '#1e293b',

              color: 'white'
            }}
          >

            {item.icono}
            {' '}
            {item.nombre}

          </button>

        ))}

      </div>

      {/* CONTENIDO */}

      <div
        style={{
          flex: 1,
          padding: '30px'
        }}
      >

        {pantalla === 'GASTOS' && (
          <AdminGastos />
        )}

        {pantalla === 'IMPORTAR' && (
          <AdminImportar />
        )}

        {pantalla === 'EXPORTAR' && (
          <AdminExportar />
        )}

        {pantalla === 'CATEGORIAS' && (
          <AdminCategorias />
        )}

        {pantalla === 'ESTADISTICAS' && (
          <AdminEstadisticas />
        )}

        {pantalla === 'BASE DATOS' && (
          <AdminBaseDatos />
        )}

        {pantalla === 'CARPETAS' && (
          <AdminCarpetas />
        )}

      </div>

    </div>

  )

}