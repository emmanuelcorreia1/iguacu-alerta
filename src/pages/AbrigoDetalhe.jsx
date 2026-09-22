import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Check, ChevronLeft, Image, MapPin, Share2 } from 'lucide-react'
import ProgressBar from '../components/ui/ProgressBar'
import RiskBadge from '../components/ui/RiskBadge'
import abrigos from '../data/abrigos.json'
import { ESTRUTURA } from '../lib/estrutura'
import { FOTO_ABRIGO } from '../lib/fotos'
import { ocupacaoDoAbrigo } from '../lib/formato'

export default function AbrigoDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [expandir, setExpandir] = useState(false)
  const [indo, setIndo] = useState(false)

  const abrigo = abrigos.find((a) => a.id === id)
  if (!abrigo) return <Navigate to="/abrigos" replace />

  const ocupacao = ocupacaoDoAbrigo(abrigo)
  const descricaoCurta =
    abrigo.descricao.length > 150 && !expandir
      ? `${abrigo.descricao.slice(0, 150).trimEnd()}… `
      : abrigo.descricao

  return (
    <div className="mx-auto w-full max-w-3xl pb-32 md:px-8 md:pb-16">
      {/* Foto de capa */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-b from-[#C6CDCA] to-[#EDF0EE] md:mt-8 md:h-72 md:rounded-3.5xl">
        {FOTO_ABRIGO[abrigo.id] ? (
          <img
            src={FOTO_ABRIGO[abrigo.id]}
            alt={`Foto do abrigo ${abrigo.nome}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-texto-sec">
            <span className="flex flex-col items-center gap-2">
              <Image size={28} />
              <span className="text-legenda">Foto do abrigo</span>
            </span>
          </div>
        )}
        <div className="pt-safe absolute inset-x-4 top-4 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-flutuante"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            aria-label="Compartilhar"
            className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-flutuante"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="relative -mt-6 rounded-t-3.5xl bg-fundo px-5 pt-6 md:mt-6 md:rounded-none md:bg-transparent md:px-0 md:pt-0">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-titulo md:text-titulo-lg">{abrigo.nome}</h1>
          <RiskBadge tom={ocupacao.vagas > 0 ? 'seguro' : 'emergencia'} className="mt-1">
            {ocupacao.vagas > 0 ? 'Disponível' : 'Lotado'}
          </RiskBadge>
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-corpo text-texto-sec">
          <MapPin size={15} className="shrink-0 text-acao" />
          {abrigo.endereco} · {String(abrigo.distanciaKm).replace('.', ',')} km
        </p>

        <p className="mt-3 text-corpo text-texto-sec">
          {descricaoCurta}
          {abrigo.descricao.length > 150 && (
            <button
              onClick={() => setExpandir((v) => !v)}
              className="font-bold text-acao"
            >
              {expandir ? 'Menos' : 'Mais'}
            </button>
          )}
        </p>

        {/* Vagas */}
        <div className="mt-5 rounded-2xl bg-white p-4 shadow-card md:bg-fundo md:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-card">
              {ocupacao.vagas > 0 ? `${ocupacao.vagas} vagas livres` : 'Sem vagas livres'}
            </span>
            <span className="text-legenda text-texto-sec">
              {abrigo.vagasOcupadas} de {abrigo.vagasTotais} ocupados
            </span>
          </div>
          <ProgressBar valor={ocupacao.pct} tom={ocupacao.tom} className="mt-3 h-2" />
        </div>

        {/* Estrutura */}
        <h2 className="mt-7 text-secao">Estrutura do abrigo</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          {abrigo.estrutura.map((id) => {
            const { rotulo, Icone } = ESTRUTURA[id]
            return (
              <div
                key={id}
                className="flex min-h-[56px] items-center gap-2.5 rounded-2xl border border-borda bg-white px-3.5"
              >
                <Icone size={19} className="shrink-0 text-acao" strokeWidth={2.2} />
                <span className="text-[13px] font-bold leading-tight">{rotulo}</span>
              </div>
            )
          })}
        </div>

        {/* CTA no fluxo do desktop */}
        <div className="mt-8 hidden md:block">
          <BotaoEstouIndo indo={indo} aoClicar={() => setIndo(true)} />
        </div>
      </div>

      {/* CTA fixo no mobile */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-fundo via-fundo/95 to-transparent px-5 pb-4 pt-6 md:hidden">
        <BotaoEstouIndo indo={indo} aoClicar={() => setIndo(true)} />
      </div>
    </div>
  )
}

function BotaoEstouIndo({ indo, aoClicar }) {
  return (
    <button
      onClick={aoClicar}
      disabled={indo}
      className={`flex min-h-[58px] w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-bold transition-colors md:max-w-md ${
        indo
          ? 'bg-verde-claro text-pressionado'
          : 'bg-acao text-white shadow-[0_10px_28px_rgba(15,157,107,0.35)] hover:bg-pressionado'
      }`}
    >
      <Check size={19} strokeWidth={2.6} />
      {indo ? 'Presença sinalizada ao abrigo' : 'Estou indo para este abrigo'}
    </button>
  )
}
