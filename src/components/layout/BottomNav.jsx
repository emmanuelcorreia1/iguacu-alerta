import { NavLink } from 'react-router-dom'
import { Home, LayoutGrid, UtensilsCrossed, Warehouse } from 'lucide-react'

const ITENS = [
  { para: '/', rotulo: 'Início', Icone: Home, fim: true },
  { para: '/abrigos', rotulo: 'Abrigos', Icone: Warehouse },
  { para: '/alimentacao', rotulo: 'Alimentação', Icone: UtensilsCrossed },
  { para: '/menu', rotulo: 'Menu', Icone: LayoutGrid },
]

/** Barra de abas fixa no rodapé - apenas no mobile */
export default function BottomNav() {
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-borda bg-white/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-4">
        {ITENS.map(({ para, rotulo, Icone, fim }) => (
          <NavLink
            key={para}
            to={para}
            end={fim}
            className={({ isActive }) =>
              `flex min-h-[60px] flex-col items-center justify-center gap-1 pt-1.5 text-[11px] ${
                isActive ? 'font-bold text-acao' : 'font-semibold text-texto-sec'
              }`
            }
          >
            <Icone size={21} strokeWidth={2.2} />
            {rotulo}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
