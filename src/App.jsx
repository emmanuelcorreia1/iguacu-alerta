import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Home from './pages/Home'
import MeuBairro from './pages/MeuBairro'
import Abrigos from './pages/Abrigos'
import AbrigoDetalhe from './pages/AbrigoDetalhe'
import Alimentacao from './pages/Alimentacao'
import OferecerAbrigo from './pages/OferecerAbrigo'
import ElNino from './pages/ElNino'
import Menu from './pages/Menu'

function VoltarAoTopo() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <VoltarAoTopo />
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/meu-bairro" element={<MeuBairro />} />
          <Route path="/abrigos" element={<Abrigos />} />
          <Route path="/abrigos/:id" element={<AbrigoDetalhe />} />
          <Route path="/alimentacao" element={<Alimentacao />} />
          <Route path="/oferecer-abrigo" element={<OferecerAbrigo />} />
          <Route path="/el-nino" element={<ElNino />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  )
}
