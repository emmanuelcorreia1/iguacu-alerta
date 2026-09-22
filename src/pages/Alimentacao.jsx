import { useState } from 'react'
import { Navigation } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import ProgressBar from '../components/ui/ProgressBar'
import RiskBadge from '../components/ui/RiskBadge'
import pontos from '../data/alimentacao.json'
import { linkComoChegar } from '../lib/formato'

const BADGE_PONTO = {
  'Refeição pronta': 'alerta',
  'Água potável': 'azul',
  'Cesta básica': 'neutro',
}

/** Cor da barra de doação conforme o quanto já foi arrecadado */
function tomDaDoacao(atual, meta) {
  const pct = atual / meta
  if (pct < 0.35) return 'alerta'
  if (pct < 0.65) return 'atencao'
  return 'seguro'
}

export default function Alimentacao() {
  const [aba, setAba] = useState('comer')

  return (
    <div className="mx-auto w-full max-w-5xl px-5 md:px-8">
      <div className="pt-safe pt-4 md:pt-8">
        <PageHeader titulo="Alimentação" />
      </div>

      {/* Abas */}
      <div className="mt-4 grid grid-cols-2 gap-1 rounded-full bg-[#EDF1EF] p-1.5 md:max-w-md">
        {[
          { id: 'comer', rotulo: 'Onde comer' },
          { id: 'ajudar', rotulo: 'Quero ajudar' },
        ].map(({ id, rotulo }) => (
          <button
            key={id}
            onClick={() => setAba(id)}
            className={`min-h-[46px] rounded-full text-[14px] transition-all ${
              aba === id
                ? 'bg-white font-bold shadow-card'
                : 'font-semibold text-texto-sec'
            }`}
          >
            {rotulo}
          </button>
        ))}
      </div>

      {aba === 'comer' ? (
        <div className="mt-5 grid items-start gap-4 md:grid-cols-2 md:gap-5">
          {pontos.map((p) => (
            <article
              key={p.id}
              className="rounded-3xl border border-borda/70 bg-white p-5 shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-[17px] font-bold leading-snug">{p.nome}</h2>
                <RiskBadge tom={p.status === 'servindo' ? 'seguro' : 'atencao'}>
                  {p.statusTexto}
                </RiskBadge>
              </div>
              <p className="mt-1 text-corpo text-texto-sec">
                {String(p.distanciaKm).replace('.', ',')} km · {p.endereco}
              </p>

              <div className="mt-4 rounded-2xl bg-fundo px-4">
                {p.refeicoes.map((r, i) => (
                  <div
                    key={r.nome}
                    className={`flex items-center justify-between py-3 ${
                      i > 0 ? 'border-t border-borda' : ''
                    }`}
                  >
                    <span className="text-corpo text-texto-sec">{r.nome}</span>
                    <span className="text-[15px] font-bold">{r.horario}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {p.badges.map((b) => (
                  <RiskBadge key={b} tom={BADGE_PONTO[b] ?? 'neutro'}>
                    {b}
                  </RiskBadge>
                ))}
              </div>

              <a
                href={linkComoChegar(p)}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-full bg-fundo text-[14px] font-bold transition-colors hover:bg-borda"
              >
                <Navigation size={16} />
                Como chegar
              </a>
            </article>
          ))}
        </div>
      ) : (
        <>
          <p className="mt-5 max-w-2xl text-corpo text-texto-sec">
            As listas abaixo são atualizadas pelos responsáveis de cada ponto. Leve a
            doação no horário indicado.
          </p>
          <div className="mt-4 grid items-start gap-4 md:grid-cols-2 md:gap-5">
            {pontos.map((p) => {
              const faltaMuito = p.doacoes.situacao === 'falta-muito'
              return (
                <article
                  key={p.id}
                  className="rounded-3xl border border-borda/70 bg-white p-5 shadow-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-[17px] font-bold leading-snug">{p.nome}</h2>
                    <RiskBadge tom={faltaMuito ? 'alerta' : 'seguro'}>
                      {p.doacoes.situacaoTexto}
                    </RiskBadge>
                  </div>
                  <p className="mt-1 text-corpo text-texto-sec">{p.doacoes.horario}</p>

                  <div className="mt-4 space-y-4">
                    {p.doacoes.itens.map((item) => (
                      <div key={item.nome}>
                        <div className="flex items-center justify-between">
                          <span className="text-[15px] font-bold">{item.nome}</span>
                          <span className="text-corpo text-texto-sec">
                            {item.atual} de {item.meta}
                            {item.unidade ? ` ${item.unidade}` : ''}
                          </span>
                        </div>
                        <ProgressBar
                          valor={item.atual / item.meta}
                          tom={tomDaDoacao(item.atual, item.meta)}
                          className="mt-2"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Abre a rota até o ponto de doação no app de mapas */}
                  <a
                    href={linkComoChegar(p)}
                    target="_blank"
                    rel="noreferrer"
                    className={`mt-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-bold transition-colors ${
                      faltaMuito
                        ? 'bg-acao text-white hover:bg-pressionado'
                        : 'bg-fundo text-texto hover:bg-borda'
                    }`}
                  >
                    <Navigation size={16} />
                    Quero doar para este ponto
                  </a>
                  <p className="mt-2 text-center text-legenda text-texto-sec">
                    Abre a rota até o ponto no seu app de mapas
                  </p>
                </article>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
