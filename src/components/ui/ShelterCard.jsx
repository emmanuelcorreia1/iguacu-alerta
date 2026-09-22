import { Link } from 'react-router-dom'
import { Navigation } from 'lucide-react'
import RiskBadge from './RiskBadge'
import ProgressBar from './ProgressBar'
import { ESTRUTURA } from '../../lib/estrutura'
import { linkComoChegar, ocupacaoDoAbrigo } from '../../lib/formato'

const COR_ROTULO = {
  seguro: 'text-pressionado',
  atencao: 'text-[#8F6E04]',
  alerta: 'text-alerta',
  emergencia: 'text-emergencia',
}

const DESTAQUE_ESTRUTURA = ['acessivel', 'aceita-animais', 'chuveiro-quente', 'cozinha']

/** Card de abrigo com os 4 estados de ocupação do protótipo */
export default function ShelterCard({ abrigo, compacto = false }) {
  const ocupacao = ocupacaoDoAbrigo(abrigo)
  const itens = DESTAQUE_ESTRUTURA.filter((id) => abrigo.estrutura.includes(id)).slice(0, 3)

  return (
    <article className="rounded-3xl border border-borda/70 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[17px] font-bold leading-snug">{abrigo.nome}</h3>
        <RiskBadge tom={ocupacao.tom}>{ocupacao.badge}</RiskBadge>
      </div>
      <p className="mt-1 text-corpo text-texto-sec">
        {String(abrigo.distanciaKm).replace('.', ',')} km · {abrigo.endereco}
      </p>

      <ProgressBar valor={ocupacao.pct} tom={ocupacao.tom} className="mt-4" />
      <p className="mt-2 text-corpo text-texto-sec">
        {abrigo.vagasOcupadas} de {abrigo.vagasTotais} lugares ocupados
      </p>
      <p className={`mt-1 text-corpo font-bold ${COR_ROTULO[ocupacao.tom]}`}>
        {ocupacao.rotulo}
      </p>

      {!compacto && itens.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {itens.map((id) => {
            const { rotulo, Icone } = ESTRUTURA[id]
            return (
              <span key={id} className="flex items-center gap-1.5 text-legenda text-texto-sec">
                <Icone size={15} strokeWidth={2.2} className="text-texto-sec" />
                {rotulo === 'Aceita animais' ? 'Animais' : rotulo}
              </span>
            )
          })}
        </div>
      )}

      {!compacto && (
        <div className="mt-4 flex gap-3">
          <a
            href={linkComoChegar(abrigo)}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-fundo px-4 text-[14px] font-bold text-texto transition-colors hover:bg-borda"
          >
            <Navigation size={16} />
            Como chegar
          </a>
          <Link
            to={`/abrigos/${abrigo.id}`}
            className="flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-acao px-4 text-[14px] font-bold text-white transition-colors hover:bg-pressionado"
          >
            Ver detalhes
          </Link>
        </div>
      )}
    </article>
  )
}
