'use client'

import { useState, useEffect } from 'react'

import Header from '../components/Header'
import DashboardMensual from '../components/DashboardMensual'
import DashboardAnual from '../components/DashboardAnual'
import IntroducirGasto from '../components/IntroducirGasto'
import DashboardMovimientos from '../components/DashboardMovimientos'
import Login from '../components/Login'

export default function Home() {

  const [pantalla, setPantalla] =
    useState('RESUMEN MENSUAL')

  const [usuario, setUsuario] =
    useState('')

  const [cargado, setCargado] =
    useState(false)
        
    useEffect(() => {

      const usuarioGuardado =
        localStorage.getItem(
          'usuario'
        )

      if (
        usuarioGuardado
      ) {

        setUsuario(
          usuarioGuardado
        )

      }

      setCargado(true)

    }, [])

    if (!cargado) {
      return null
    }

    if (!usuario) {
      return (
        <Login
          onLogin={setUsuario}
        />
      )
    }

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
        setPantalla={
          setPantalla
        }
        usuario={usuario}
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