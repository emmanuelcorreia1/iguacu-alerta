import { Link } from 'react-router-dom'
import {
  ChevronRight,
  CloudRainWind,
  HeartHandshake,
  MapPin,
  Phone,
} from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import IconSquare from '../components/ui/IconSquare'

const ITENS = [
  {
    para: '/meu-bairro',
    titulo: 'Meu bairro',
    sub: 'Cota de alagamento e lista de saída',
    Icone: MapPin,
    cor: 'verde',
  },
  {
    para: '/oferecer-abrigo',
    titulo: 'Oferecer abrigo',
    sub: 'Cadastre um espaço seguro',
    Icone: HeartHandshake,
    cor: 'azul',
  },
  {
    para: '/el-nino',
    titulo: 'Entenda o El Niño',
    sub: 'Por que chove tanto aqui',
    Icone: CloudRainWind,
    cor: 'roxo',
  },
]

const TELEFONES = [
  { nome: 'Defesa Civil', numero: '199' },
  { nome: 'Bombeiros', numero: '193' },
  { nome: 'SAMU', numero: '192' },
]

export default function Menu() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 md:px-8">
      <div className="pt-safe pt-4 md:pt-8">
        <PageHeader titulo="Menu" />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3 md:gap-4">
        {ITENS.map(({ para, titulo, sub, Icone, cor }) => (
          <Link
            key={para}
            to={para}
            className="flex items-center gap-4 rounded-3xl border border-borda/70 bg-white p-4 shadow-card transition-transform hover:-translate-y-0.5"
          >
            <IconSquare Icone={Icone} cor={cor} />
            <span className="flex-1">
              <span className="block text-card">{titulo}</span>
              <span className="block text-corpo text-texto-sec">{sub}</span>
            </span>
            <ChevronRight size={18} className="text-texto-sec" />
          </Link>
        ))}
      </div>

      {/* Telefones de emergência - disponíveis mesmo offline */}
      <section className="mt-6 rounded-3xl bg-[#FBEAE8] p-5">
        <h2 className="flex items-center gap-2 text-card font-bold text-emergencia">
          <Phone size={15} />
          Ligações de emergência
        </h2>
        <div className="mt-3 grid grid-cols-3 gap-3 md:max-w-md">
          {TELEFONES.map((t) => (
            <a
              key={t.numero}
              href={`tel:${t.numero}`}
              className="rounded-2xl bg-white px-2 py-3 text-center shadow-card"
            >
              <span className="block text-legenda text-texto-sec">{t.nome}</span>
              <span className="block text-[20px] font-extrabold">{t.numero}</span>
            </a>
          ))}
        </div>
      </section>

      <p className="mt-6 text-legenda text-texto-sec">
        Iguaçu Alerta · protótipo de hackathon. Níveis, vagas e horários são dados
        ilustrativos; locais são reais de União da Vitória (PR).
      </p>
    </div>
  )
}
