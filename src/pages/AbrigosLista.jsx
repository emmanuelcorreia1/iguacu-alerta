import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, BellRing, House, MapPin } from 'lucide-react'
import Button from '../components/ui/Button'
import RiskBadge from '../components/ui/RiskBadge'
import ShelterCard from '../components/ui/ShelterCard'
import nivelRio from '../data/nivelRio.json'
import { metros } from '../lib/formato'

/** Lista de cards de abrigos (coluna no mobile, grid no desktop via prop) */
export default function AbrigosLista({ abrigos, comVagas, colunas = false }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-corpo text-texto-sec">
        {abrigos.length} abrigo{abrigos.length !== 1 && 's'} aberto
        {abrigos.length !== 1 && 's'} · mais próximos primeiro
        {comVagas && <RiskBadge tom="seguro">Com vagas</RiskBadge>}
      </p>
      <div className={`mt-4 grid gap-4 ${colunas ? 'md:grid-cols-2' : ''}`}>
        {abrigos.map((a) => (
          <ShelterCard key={a.id} abrigo={a} />
        ))}
      </div>
    </div>
  )
}

/** Estado vazio: nenhum abrigo ativado pela Defesa Civil (tela 05) */
export function AbrigosVazio() {
  const navigate = useNavigate()
  const [avisar, setAvisar] = useState(
    () => localStorage.getItem('iguacu-alerta:avisar-abrigos') === '1',
  )

  function alternarAviso() {
    setAvisar((v) => {
      localStorage.setItem('iguacu-alerta:avisar-abrigos', v ? '' : '1')
      return !v
    })
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-2 pb-10 pt-10 text-center md:pt-16">
      <span className="grid h-24 w-24 place-items-center rounded-3.5xl bg-[#EDF0EE] text-[#9AA5A1]">
        <House size={44} strokeWidth={1.8} />
      </span>
      <h2 className="mt-6 text-secao">Nenhum abrigo aberto no momento</h2>
      <p className="mt-3 text-corpo text-texto-sec">
        Os abrigos são ativados pela Defesa Civil quando o rio atinge{' '}
        {nivelRio.cotas.atencao} m. Hoje o Rio Iguaçu está em {metros(nivelRio.atual)}.
      </p>

      <div className="mt-6 flex w-full items-center gap-3 rounded-3xl bg-fundo p-4 text-left">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-acao shadow-card">
          <MapPin size={19} />
        </span>
        <p className="text-corpo font-semibold text-texto-sec">
          Enquanto isso, confira a cota do seu bairro e prepare a mochila de saída.
        </p>
      </div>

      <Button
        variante={avisar ? 'neutro' : 'primario'}
        className={`mt-6 w-full ${avisar ? '!bg-verde-claro !text-pressionado' : ''}`}
        onClick={alternarAviso}
      >
        {avisar ? <BellRing size={18} /> : <Bell size={18} />}
        {avisar ? 'Você será avisado quando abrirem' : 'Avisar-me quando abrirem'}
      </Button>
      <Button
        variante="secundario"
        className="mt-3 w-full"
        onClick={() => navigate('/meu-bairro')}
      >
        Ver o risco do meu bairro
      </Button>
    </div>
  )
}
