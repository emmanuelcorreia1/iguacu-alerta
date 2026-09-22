import { useMemo, useState } from 'react'
import { AlertCircle, Check, ChevronLeft, ChevronRight, LocateFixed, Search } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import ProgressBar from '../components/ui/ProgressBar'
import RiskBadge from '../components/ui/RiskBadge'
import bairros from '../data/bairros.json'
import nivelRio from '../data/nivelRio.json'
import { metros, ROTULO_DO_RISCO, TOM_DO_RISCO } from '../lib/formato'
import { CHECKLIST, CHAVE_CHECKLIST, lerChecklist } from '../lib/checklist'

const CHAVE_BAIRRO = 'iguacu-alerta:meu-bairro'

const COR_COTA = {
  alto: 'text-alerta',
  medio: 'text-[#8F6E04]',
  baixo: 'text-pressionado',
}

const GRUPOS = [
  { risco: 'alto', titulo: 'Risco alto' },
  { risco: 'medio', titulo: 'Risco moderado' },
  { risco: 'baixo', titulo: 'Menor risco' },
]

/** Distância aproximada entre dois pontos (graus -> usada só para comparar) */
function distancia2(a, b) {
  return (a.lat - b[0]) ** 2 + (a.lng - b[1]) ** 2
}

export default function MeuBairro() {
  const [busca, setBusca] = useState('')
  const [selecionadoId, setSelecionadoId] = useState(null)
  const [marcados, setMarcados] = useState(lerChecklist)
  const [avisoGeo, setAvisoGeo] = useState('')

  const selecionado = bairros.find((b) => b.id === selecionadoId)

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return bairros
    return bairros.filter((b) => b.nome.toLowerCase().includes(termo))
  }, [busca])

  function escolher(bairro) {
    setSelecionadoId(bairro.id)
    setBusca('')
    localStorage.setItem(CHAVE_BAIRRO, bairro.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /** Tenta a localização real; se não der, usa o bairro salvo ou o centro */
  function usarLocalizacao() {
    setAvisoGeo('')
    const alternativa = () => {
      const salvo = bairros.find((b) => b.id === localStorage.getItem(CHAVE_BAIRRO))
      escolher(salvo ?? bairros.find((b) => b.id === 'centro'))
      setAvisoGeo('Não foi possível obter a localização - mostrando o último bairro consultado.')
    }
    if (!navigator.geolocation) {
      alternativa()
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const ponto = [coords.latitude, coords.longitude]
        const maisPerto = [...bairros].sort(
          (a, b) => distancia2(a, ponto) - distancia2(b, ponto),
        )[0]
        escolher(maisPerto)
      },
      alternativa,
      { enableHighAccuracy: true, timeout: 6000 },
    )
  }

  function alternarItem(id) {
    setMarcados((atual) => {
      const proximo = atual.includes(id)
        ? atual.filter((x) => x !== id)
        : [...atual, id]
      localStorage.setItem(CHAVE_CHECKLIST, JSON.stringify(proximo))
      return proximo
    })
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 md:px-8">
      <div className="pt-safe pt-4 md:pt-8">
        <PageHeader titulo="Meu bairro" />
      </div>

      <div className="mt-5 grid items-start gap-5 md:grid-cols-2 md:gap-6">
        <div>
          {/* Busca + geolocalização */}
          <label className="flex items-center gap-3 rounded-2xl bg-[#EDF1EF] px-4 py-3.5">
            <Search size={18} className="text-texto-sec" />
            <input
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value)
                setSelecionadoId(null)
              }}
              placeholder="Buscar bairro pelo nome"
              className="w-full bg-transparent text-[15px] font-semibold outline-none placeholder:font-medium placeholder:text-texto-sec"
            />
          </label>

          <button
            onClick={usarLocalizacao}
            className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-verde-claro px-4 text-[14px] font-bold text-pressionado transition-colors hover:bg-[#D8F0E5]"
          >
            <LocateFixed size={17} />
            Usar minha localização
          </button>
          {avisoGeo && <p className="mt-2 text-legenda text-texto-sec">{avisoGeo}</p>}

          {selecionado ? (
            <DetalheBairro
              bairro={selecionado}
              aoVoltar={() => setSelecionadoId(null)}
            />
          ) : (
            <ListaBairros bairros={filtrados} aoEscolher={escolher} />
          )}
        </div>

        {/* Checklist "Prepare sua saída" */}
        <section className="rounded-3xl border border-borda/70 bg-white p-5 shadow-card md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-secao">Prepare sua saída</h2>
            <RiskBadge tom="neutro">
              {marcados.length} de {CHECKLIST.length}
            </RiskBadge>
          </div>
          <ul className="mt-2 divide-y divide-borda">
            {CHECKLIST.map(({ id, rotulo }) => {
              const feito = marcados.includes(id)
              return (
                <li key={id}>
                  <button
                    onClick={() => alternarItem(id)}
                    className="flex min-h-[56px] w-full items-center gap-3 py-2 text-left"
                  >
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border-2 transition-colors ${
                        feito ? 'border-acao bg-acao text-white' : 'border-borda bg-white'
                      }`}
                    >
                      {feito && <Check size={15} strokeWidth={3.5} />}
                    </span>
                    <span
                      className={`text-[15px] font-semibold ${
                        feito ? 'text-texto-sec line-through decoration-borda' : ''
                      }`}
                    >
                      {rotulo}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="mt-2 text-legenda text-texto-sec">
            A lista fica salva no aparelho e funciona mesmo sem internet.
          </p>
        </section>
      </div>
    </div>
  )
}

/** Lista de todos os bairros agrupados por nível de risco */
function ListaBairros({ bairros: lista, aoEscolher }) {
  if (lista.length === 0) {
    return (
      <p className="mt-6 rounded-2xl bg-fundo p-4 text-corpo text-texto-sec">
        Nenhum bairro encontrado com esse nome.
      </p>
    )
  }
  return (
    <div className="mt-4 space-y-5">
      <p className="text-legenda text-texto-sec">
        Cotas baseadas nos registros da última grande enchente. Toque em um bairro para
        ver a situação dele.
      </p>
      {GRUPOS.map(({ risco, titulo }) => {
        const doGrupo = lista
          .filter((b) => b.risco === risco)
          .sort((a, b) => a.cota - b.cota)
        if (doGrupo.length === 0) return null
        return (
          <section key={risco}>
            <div className="flex items-center gap-2">
              <h2 className="text-card text-texto-sec">{titulo}</h2>
              <RiskBadge tom={TOM_DO_RISCO[risco]}>{doGrupo.length} bairros</RiskBadge>
            </div>
            <div className="mt-2 overflow-hidden rounded-3xl border border-borda/70 bg-white shadow-card">
              {doGrupo.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => aoEscolher(b)}
                  className={`flex min-h-[60px] w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-fundo ${
                    i > 0 ? 'border-t border-borda' : ''
                  }`}
                >
                  <span className="flex-1">
                    <span className="block text-[15px] font-bold">{b.nome}</span>
                    <span className="block text-legenda text-texto-sec">
                      Atingido a partir de {metros(b.cota)}
                    </span>
                  </span>
                  <span className={`text-[15px] font-extrabold ${COR_COTA[b.risco]}`}>
                    {metros(b.cota)}
                  </span>
                  <ChevronRight size={17} className="text-texto-sec" />
                </button>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

/** Situação detalhada de um bairro (comparação com o nível atual do rio) */
function DetalheBairro({ bairro, aoVoltar }) {
  const falta = bairro.cota - nivelRio.atual
  return (
    <section className="mt-4 rounded-3xl border border-borda/70 bg-white p-5 shadow-card md:p-6">
      <button
        onClick={aoVoltar}
        className="mb-3 inline-flex items-center gap-1 text-[14px] font-bold text-acao"
      >
        <ChevronLeft size={16} />
        Todos os bairros
      </button>

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-titulo">{bairro.nome}</h2>
        <RiskBadge tom={TOM_DO_RISCO[bairro.risco]}>
          {ROTULO_DO_RISCO[bairro.risco]}
        </RiskBadge>
      </div>
      <p className="mt-3 text-corpo text-texto-sec">
        Seu bairro é atingido quando o rio chega a{' '}
        <strong className="font-bold text-texto">{metros(bairro.cota)}</strong>.
      </p>
      {bairro.obs && <p className="mt-2 text-corpo text-texto-sec">{bairro.obs}</p>}

      <div className="mt-4 rounded-2xl bg-fundo p-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-legenda text-texto-sec">Rio agora</p>
            <p className="text-[22px] font-extrabold">{metros(nivelRio.atual)}</p>
          </div>
          <div className="text-right">
            <p className="text-legenda text-texto-sec">Cota do bairro</p>
            <p className={`text-[22px] font-extrabold ${COR_COTA[bairro.risco]}`}>
              {metros(bairro.cota)}
            </p>
          </div>
        </div>
        <ProgressBar
          valor={nivelRio.atual / bairro.cota}
          tom={falta <= 0 ? 'emergencia' : 'seguro'}
          className="mt-3 h-2.5"
        />
        <p className="mt-3 text-corpo font-bold">
          {falta > 0
            ? `Faltam ${metros(falta)} para a água chegar`
            : 'A água pode ter atingido o seu bairro - procure um abrigo'}
        </p>
      </div>

      <div className="mt-4 flex gap-3 rounded-2xl bg-[#FBF2CF] p-4">
        <AlertCircle size={20} className="mt-0.5 shrink-0 text-[#8F6E04]" />
        <p className="text-corpo font-semibold text-[#6B5503]">
          A Defesa Civil avisa os moradores quando o rio passa de{' '}
          {nivelRio.cotas.atencao} m. Prepare-se antes disso.
        </p>
      </div>
    </section>
  )
}
