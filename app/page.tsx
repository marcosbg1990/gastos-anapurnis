'use client'

import { useState } from 'react'

import Header from '../components/Header'
import DashboardMensual from '../components/DashboardMensual'
import DashboardAnual from '../components/DashboardAnual'
import IntroducirGasto from '../components/IntroducirGasto'
import DashboardMovimientos from '../components/DashboardMovimientos'

export default function Home() {

  const [pantalla, setPantalla] =
    useState('RESUMEN MENSUAL')

  return (
    <div
      style={{
        backgroundColor: '#f5f7fa',
        minHeight: '100vh',
        padding: '20px'
      }}
    >
      <Header
        pantalla={pantalla}
        setPantalla={setPantalla}
      />

      {pantalla === 'RESUMEN MENSUAL' && (
        <DashboardMensual />
      )}

      {pantalla === 'RESUMEN ANUAL' && (
        <DashboardAnual />
      )}

      {pantalla === 'INTRODUCIR GASTO' && (
        <IntroducirGasto />
      )}

      {pantalla === 'MOVIMIENTOS' && (
        <DashboardMovimientos />
      )}

      {pantalla === 'RESERVA1' && (
        <div>
          <h2>🚧 Reserva 1</h2>
        </div>
      )}

      {pantalla === 'RESERVA2' && (
        <div>
          <h2>🚧 Reserva 2</h2>
        </div>
      )}
    </div>
  )
}