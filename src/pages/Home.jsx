import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  CheckCheck,
  ChevronRight,
  House,
  HeartHandshake,
  MapPin,
  RefreshCw,
  UtensilsCrossed,
  Warehouse,
} from 'lucide-react'
import Button from '../components/ui/Button'
import IconSquare from '../components/ui/IconSquare'
import RiskBadge from '../components/ui/RiskBadge'
import RiverLevelGauge from '../components/ui/RiverLevelGauge'
import useOffline from '../hooks/useOffline'
import nivelRio from '../data/nivelRio.json'
import abrigos from '../data/abrigos.json'
import { faixaDoNivel, metros } from '../lib/formato'
import { CHECKLIST, lerChecklist } from '../lib/checklist'

const ATALHOS = [
  {
    para: '/abrigos',
    titulo: 'Abrigos',
    sub: 'Mapa, vagas e rota',
    Icone: Warehouse,
    cor: 'azul',
  },
  {
    para: '/alimentacao',
    titulo: 'Alimentação',
    sub: 'Pontos e horários',
    Icone: UtensilsCrossed,
    cor: 'laranja',
  },
  {
    para: '/oferecer-abrigo',
    titulo: 'Oferecer abrigo',
    sub: 'Cadastre um espaço seguro',
    Icone: HeartHandshake,
    cor: 'verde',
  },
]

const TELEFONES = [
  { nome: 'Defesa Civil', numero: '199' },
  { nome: 'Bombeiros', numero: '193' },
  { nome: 'SAMU', numero: '192' },
]

export default function Home() {
  const navigate = useNavigate()
  const { online } = useOffline()
  const faixa = faixaDoNivel(nivelRio.atual, nivelRio.cotas)

  return (
    <div className="mx-auto w-full max-w-5xl px-5 md:px-8">
      {/* Topo: localização + sino */}
      <div className="pt-safe flex items-center justify-between pt-4 md:pt-8">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-acao" strokeWidth={2.4} />
          <span className="text-[15px] font-bold">União da Vitória, PR</span>
        </div>
        <button
          aria-label="Notificações"
          className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-card transition-colors hover:bg-fundo"
        >
          <Bell size={19} />
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-emergencia" />
        </button>
      </div>

      {online ? (
        <>
          {/* Card do rio + ações lado a lado no desktop */}
          <div className="mt-4 grid items-stretch gap-4 md:mt-6 md:grid-cols-2 md:gap-6">
            <section className="rounded-3.5xl bg-verde-claro p-5 md:p-7">
              <div className="flex items-center justify-between">
                <span className="text-corpo font-semibold text-texto">Rio Iguaçu</span>
                <RiskBadge tom="branco">{faixa.rotulo}</RiskBadge>
              </div>
              <p className="mt-2 text-[44px] font-extrabold leading-none text-pressionado md:text-[52px]">
                {metros(nivelRio.atual)}
              </p>
              <RiverLevelGauge nivel={nivelRio.atual} className="mt-5" />
              <div className="mt-4 flex items-center justify-between border-t border-[#D3EBDF] pt-3 text-legenda text-texto-sec">
                <span>{nivelRio.atualizadoTexto}</span>
                <span>Atenção a partir de {nivelRio.cotas.atencao} m</span>
              </div>
            </section>

            <div className="flex flex-col justify-center gap-3">
              <Button
                variante="emergencia"
                className="min-h-[60px] w-full text-[16px] tracking-wide md:min-h-[64px]"
                onClick={() => navigate('/abrigos')}
              >
                <House size={19} strokeWidth={2.4} />
                PRECISO DE ABRIGO AGORA
              </Button>
              <Button
                variante="secundario"
                className="min-h-[56px] w-full"
                onClick={() => navigate('/meu-bairro')}
              >
                <MapPin size={17} className="text-acao" />
                Ver o risco do meu bairro
              </Button>
              <p className="hidden text-center text-legenda text-texto-sec md:block">
                O botão vermelho abre o mapa com todos os abrigos e as vagas de cada um.
              </p>
            </div>
          </div>
        </>
      ) : (
        <OfflineHome />
      )}

      {/* Atalhos */}
      <h2 className="mt-9 text-titulo md:text-titulo-lg">Como podemos ajudar?</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3 md:gap-4">
        {ATALHOS.map(({ para, titulo, sub, Icone, cor }) => (
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
    </div>
  )
}

/** Variante da Início quando o aparelho está sem conexão (tela 13 do protótipo) */
function OfflineHome() {
  const abertos = abrigos.filter((a) => a.status === 'aberto')
  const marcados = lerChecklist().length

  return (
    <>
      <div className="mt-4 grid items-start gap-4 md:mt-6 md:grid-cols-2 md:gap-6">
        <section className="rounded-3.5xl bg-[#EDF0EE] p-5 md:p-7">
          <div className="flex items-center justify-between gap-2">
            <span className="text-legenda text-texto-sec">Rio Iguaçu · última leitura salva</span>
            <RiskBadge tom="branco" className="!text-texto-sec">
              Desatualizado
            </RiskBadge>
          </div>
          <p className="mt-2 text-[44px] font-extrabold leading-none text-[#8B9491]">
            {metros(nivelRio.atual)}
          </p>
          <RiverLevelGauge nivel={nivelRio.atual} cinza className="mt-5" />
          <p className="mt-4 text-corpo text-texto-sec">
            O nível é atualizado assim que o aparelho voltar a ter internet.
          </p>
        </section>

        <div className="flex flex-col gap-3">
          <Button
            variante="primario"
            className="w-full"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={17} />
            Tentar atualizar
          </Button>

          <h2 className="mt-3 text-secao">Salvo no seu aparelho</h2>
          <Link
            to="/abrigos"
            className="flex items-center gap-4 rounded-3xl border border-borda/70 bg-white p-4 shadow-card"
          >
            <IconSquare Icone={Warehouse} cor="azul" />
            <span>
              <span className="block text-card">{abertos.length} abrigos e rotas</span>
              <span className="block text-corpo text-texto-sec">
                Endereços e telefones funcionam offline
              </span>
            </span>
          </Link>
          <Link
            to="/meu-bairro"
            className="flex items-center gap-4 rounded-3xl border border-borda/70 bg-white p-4 shadow-card"
          >
            <IconSquare Icone={CheckCheck} cor="verde" />
            <span>
              <span className="block text-card">Sua lista de saída</span>
              <span className="block text-corpo text-texto-sec">
                {marcados} de {CHECKLIST.length} itens marcados
              </span>
            </span>
          </Link>
        </div>
      </div>

      {/* Ligações de emergência sempre disponíveis */}
      <section className="mt-5 rounded-3xl bg-[#FBEAE8] p-5">
        <h3 className="text-card font-bold text-emergencia">
          As ligações de emergência continuam funcionando
        </h3>
        <div className="mt-3 grid grid-cols-3 gap-3">
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
    </>
  )
}
