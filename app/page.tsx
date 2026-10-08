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

      {pantalla === 'INFO MENSUAL' && (
        <DashboardMensual />
      )}

      {pantalla === 'INFO ANUAL' && (
        <DashboardAnual />
      )}

      {pantalla === 'NUEVO GASTO' && (
        <IntroducirGasto />
      )}

      {pantalla === 'MOVIMIENTOS' && (
        <DashboardMovimientos />
      )}

    </div>
  )
}