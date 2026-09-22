import { NavLink } from 'react-router-dom'
import {
  CloudRainWind,
  HeartHandshake,
  Home,
  MapPin,
  Phone,
  UtensilsCrossed,
  Warehouse,
  Waves,
} from 'lucide-react'

const ITENS = [
  { para: '/', rotulo: 'Início', Icone: Home, fim: true },
  { para: '/meu-bairro', rotulo: 'Meu bairro', Icone: MapPin },
  { para: '/abrigos', rotulo: 'Abrigos', Icone: Warehouse },
  { para: '/alimentacao', rotulo: 'Alimentação', Icone: UtensilsCrossed },
  { para: '/el-nino', rotulo: 'El Niño', Icone: CloudRainWind },
  { para: '/oferecer-abrigo', rotulo: 'Oferecer abrigo', Icone: HeartHandshake },
]

const TELEFONES = [
  { nome: 'Defesa Civil', numero: '199' },
  { nome: 'Bombeiros', numero: '193' },
  { nome: 'SAMU', numero: '192' },
]

/** Navegação lateral fixa - apenas no desktop (≥ 768px) */
export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-borda bg-white md:flex">
      <div className="flex items-center gap-3 px-6 pb-4 pt-7">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-acao text-white">
          <Waves size={22} strokeWidth={2.4} />
        </span>
        <div>
          <p className="text-[17px] font-extrabold leading-tight">Iguaçu Alerta</p>
          <p className="text-legenda text-texto-sec">União da Vitória · PR</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 pt-2">
        {ITENS.map(({ para, rotulo, Icone, fim }) => (
          <NavLink
            key={para}
            to={para}
            end={fim}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-[14px] transition-colors ${
                isActive
                  ? 'bg-verde-claro font-bold text-pressionado'
                  : 'font-semibold text-texto-sec hover:bg-fundo hover:text-texto'
              }`
            }
          >
            <Icone size={19} strokeWidth={2.2} />
            {rotulo}
          </NavLink>
        ))}
      </nav>

      {/* Telefones de emergência sempre visíveis, mesmo offline */}
      <div className="m-4 rounded-2xl bg-[#FDF0EF] p-4">
        <p className="flex items-center gap-1.5 text-legenda font-bold text-emergencia">
          <Phone size={13} />
          Emergência 24h
        </p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {TELEFONES.map((t) => (
            <a
              key={t.numero}
              href={`tel:${t.numero}`}
              className="rounded-xl bg-white px-1 py-2 text-center transition-shadow hover:shadow-card"
            >
              <span className="block text-[10px] font-semibold text-texto-sec">{t.nome}</span>
              <span className="block text-[15px] font-extrabold text-texto">{t.numero}</span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  )
}
