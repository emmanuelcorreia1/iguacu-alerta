import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { List, Map as MapIcon, MapPin, Search, SlidersHorizontal } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import AbrigosMapa from './AbrigosMapa'
import AbrigosLista, { AbrigosVazio } from './AbrigosLista'
import abrigosJson from '../data/abrigos.json'
import bairros from '../data/bairros.json'
import { ocupacaoDoAbrigo } from '../lib/formato'

const FILTROS = [
  { id: 'comVagas', rotulo: 'Com vagas' },
  { id: 'abertoAgora', rotulo: 'Aberto agora' },
  { id: 'acessivel', rotulo: 'Acessível' },
  { id: 'animais', rotulo: 'Aceita animais' },
]

/**
 * Tela de abrigos.
 * Mobile: alterna entre mapa e lista. Desktop: split-view com
 * lista rolável à esquerda (~40%) e mapa fixo à direita (~60%).
 */
export default function Abrigos() {
  const [params] = useSearchParams()
  const [visao, setVisao] = useState('mapa')
  const [mostrarFiltros, setMostrarFiltros] = useState(true)
  const [busca, setBusca] = useState('')
  const [selecionado, setSelecionado] = useState(null)
  const [filtros, setFiltros] = useState({
    comVagas: true,
    abertoAgora: false,
    acessivel: false,
    animais: false,
  })

  // "?demo=vazio" força o estado vazio para demonstração
  const demoVazio = params.get('demo') === 'vazio'

  // Bairro digitado na busca -> destacado no mapa
  const bairroDestacado = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (termo.length < 3) return null
    return bairros.find((b) => b.nome.toLowerCase().includes(termo)) ?? null
  }, [busca])

  const abertos = useMemo(() => {
    if (demoVazio) return []
    let lista = abrigosJson.filter((a) => a.status === 'aberto')
    if (filtros.comVagas) lista = lista.filter((a) => ocupacaoDoAbrigo(a).vagas > 0)
    if (filtros.acessivel) lista = lista.filter((a) => a.estrutura.includes('acessivel'))
    if (filtros.animais) lista = lista.filter((a) => a.estrutura.includes('aceita-animais'))
    const termo = busca.trim().toLowerCase()
    if (termo) {
      const casadas = lista.filter(
        (a) =>
          a.nome.toLowerCase().includes(termo) ||
          a.endereco.toLowerCase().includes(termo) ||
          a.bairro.toLowerCase().includes(termo),
      )
      // Se o texto só corresponde a um bairro, mantém todos os abrigos
      // visíveis e apenas destaca o bairro no mapa
      if (casadas.length > 0) lista = casadas
    }
    return [...lista].sort((a, b) => a.distanciaKm - b.distanciaKm)
  }, [busca, filtros, demoVazio])

  const nenhumAberto = demoVazio || abrigosJson.every((a) => a.status !== 'aberto')

  function alternarFiltro(id) {
    setFiltros((f) => ({ ...f, [id]: !f[id] }))
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
      <div className="pt-safe pt-4 md:pt-8">
        <PageHeader
          titulo="Abrigos"
          acoes={
            !nenhumAberto && (
              <>
                <button
                  aria-label="Filtros"
                  onClick={() => setMostrarFiltros((v) => !v)}
                  className={`grid h-11 w-11 place-items-center rounded-2xl shadow-card transition-colors ${
                    mostrarFiltros ? 'bg-verde-claro text-pressionado' : 'bg-white'
                  }`}
                >
                  <SlidersHorizontal size={18} />
                </button>
                <button
                  aria-label={visao === 'mapa' ? 'Ver lista' : 'Ver mapa'}
                  onClick={() => setVisao((v) => (v === 'mapa' ? 'lista' : 'mapa'))}
                  className="grid h-11 w-11 place-items-center rounded-2xl bg-verde-claro text-pressionado shadow-card md:hidden"
                >
                  {visao === 'mapa' ? <List size={18} /> : <MapIcon size={18} />}
                </button>
              </>
            )
          }
        />
      </div>

      {nenhumAberto ? (
        <AbrigosVazio />
      ) : (
        <>
          {/* Busca */}
          <label className="mt-4 flex items-center gap-3 rounded-2xl bg-[#EDF1EF] px-4 py-3.5">
            <Search size={18} className="text-texto-sec" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por localização"
              className="w-full bg-transparent text-[15px] font-semibold outline-none placeholder:font-medium placeholder:text-texto-sec"
            />
          </label>

          {/* Aviso de bairro encontrado quando a lista está aberta no mobile */}
          {bairroDestacado && visao === 'lista' && (
            <button
              onClick={() => setVisao('mapa')}
              className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-verde-claro px-4 text-[14px] font-bold text-pressionado md:hidden"
            >
              <MapPin size={16} />
              Ver {bairroDestacado.nome} no mapa
            </button>
          )}

          {/* Chips de filtro */}
          {mostrarFiltros && (
            <div className="scrollbar-none -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
              {FILTROS.map(({ id, rotulo }) => (
                <button
                  key={id}
                  onClick={() => alternarFiltro(id)}
                  className={`min-h-[44px] shrink-0 rounded-full px-5 text-[14px] font-bold transition-colors ${
                    filtros[id]
                      ? 'bg-acao text-white'
                      : 'border border-borda bg-white text-texto'
                  }`}
                >
                  {rotulo}
                </button>
              ))}
            </div>
          )}

          {/* Mobile: mapa OU lista · Desktop: split-view */}
          <div className="mt-4 md:flex md:gap-6">
            {/* Lista */}
            <div
              className={`md:block md:max-h-[calc(100vh-320px)] md:w-[40%] md:min-w-[340px] md:overflow-y-auto md:pb-4 md:pr-1 ${
                visao === 'lista' ? '' : 'hidden'
              }`}
            >
              <AbrigosLista abrigos={abertos} comVagas={filtros.comVagas} />
            </div>

            {/* Mapa */}
            <AbrigosMapa
              abrigos={abertos}
              selecionado={selecionado}
              aoSelecionar={setSelecionado}
              bairroDestacado={bairroDestacado}
              className={`h-[calc(100dvh-370px)] min-h-[400px] md:sticky md:top-6 md:block md:h-[calc(100vh-320px)] md:flex-1 ${
                visao === 'mapa' ? '' : 'hidden'
              }`}
            />
          </div>
        </>
      )}
    </div>
  )
}
