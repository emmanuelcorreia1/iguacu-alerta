import { Outlet, useLocation } from 'react-router-dom'
import { WifiOff } from 'lucide-react'
import BottomNav from './BottomNav'
import Sidebar from './Sidebar'
import useOffline from '../../hooks/useOffline'

/**
 * Casca do app: sidebar no desktop, bottom tab bar no mobile,
 * banner de "Sem conexão" quando offline.
 */
export default function AppShell() {
  const { online, dataTexto, horaTexto } = useOffline()
  const { pathname } = useLocation()

  // Telas de fluxo (detalhe do abrigo e formulário) escondem a tab bar
  const esconderTabBar =
    /^\/abrigos\/[^/]+$/.test(pathname) || pathname === '/oferecer-abrigo'

  return (
    <div className="min-h-screen">
      <Sidebar />

      <div className="md:pl-72">
        {!online && (
          <div className="pt-safe sticky top-0 z-50 flex items-center justify-center gap-2 bg-[#E9EDEB] px-5 py-2.5 text-legenda font-bold text-texto-sec">
            <WifiOff size={14} />
            Sem conexão. Dados de {dataTexto} às {horaTexto}
          </div>
        )}

        <main className={esconderTabBar ? '' : 'pb-24 md:pb-12'}>
          <Outlet />
        </main>
      </div>

      {!esconderTabBar && <BottomNav />}
    </div>
  )
}
