import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, LocateFixed } from 'lucide-react'
import Button from '../components/ui/Button'
import RiskBadge from '../components/ui/RiskBadge'
import StepperHeader from '../components/ui/StepperHeader'
import { ESTRUTURA } from '../lib/estrutura'

const ETAPAS = ['Espaço', 'Responsável', 'Endereço', 'Capacidade', 'Estrutura', 'Revisão']

const TIPOS_DE_ESPACO = [
  'Salão de igreja',
  'Casa ou apartamento',
  'Chácara ou sítio',
  'Empresa ou galpão',
]

const CAPACIDADES = ['Até 10 pessoas', '10 a 30 pessoas', '30 a 60 pessoas', 'Mais de 60 pessoas']

const FORM_INICIAL = {
  tipo: null,
  nome: '',
  telefone: '',
  endereco: '',
  capacidade: null,
  estrutura: [],
}

export default function OferecerAbrigo() {
  const navigate = useNavigate()
  const [etapa, setEtapa] = useState(1)
  const [form, setForm] = useState(FORM_INICIAL)
  const [protocolo, setProtocolo] = useState(null)

  function definir(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }))
  }

  function alternarEstrutura(id) {
    setForm((f) => ({
      ...f,
      estrutura: f.estrutura.includes(id)
        ? f.estrutura.filter((x) => x !== id)
        : [...f.estrutura, id],
    }))
  }

  const etapaValida = {
    1: form.tipo !== null,
    2: form.nome.trim().length >= 3 && form.telefone.trim().length >= 8,
    3: form.endereco.trim().length >= 5,
    4: form.capacidade !== null,
    5: form.estrutura.length > 0,
    6: true,
  }[etapa]

  function avancar() {
    if (etapa < ETAPAS.length) {
      setEtapa((e) => e + 1)
    } else {
      // Aqui entraria o envio para o backend da Defesa Civil
      setProtocolo(`UVA-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`)
    }
  }

  if (protocolo) {
    return (
      <Confirmacao
        protocolo={protocolo}
        aoRecomecar={() => {
          setForm(FORM_INICIAL)
          setEtapa(1)
          setProtocolo(null)
        }}
      />
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-16 md:px-8">
      {/* Cabeçalho com progresso */}
      <div className="pt-safe flex items-center gap-3 pt-4 md:pt-8">
        <button
          onClick={() => (etapa > 1 ? setEtapa((e) => e - 1) : navigate(-1))}
          aria-label="Voltar"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white shadow-card"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="flex-1 text-titulo md:text-titulo-lg">Oferecer abrigo</h1>
        <span className="text-corpo font-semibold text-texto-sec md:hidden">
          {etapa} de {ETAPAS.length}
        </span>
      </div>

      <div className="mt-4 md:mt-6">
        <StepperHeader etapas={ETAPAS} atual={etapa} />
      </div>

      <section className="mt-5 rounded-3xl border border-borda/70 bg-white p-5 shadow-card md:mt-8 md:p-8">
        {etapa === 1 && (
          <>
            <h2 className="text-secao">Que tipo de espaço você oferece?</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {TIPOS_DE_ESPACO.map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => definir('tipo', tipo)}
                  className={`min-h-[84px] rounded-2xl border px-4 text-[15px] font-bold transition-colors ${
                    form.tipo === tipo
                      ? 'border-acao bg-verde-claro text-pressionado'
                      : 'border-borda bg-white text-texto hover:border-texto-sec/40'
                  }`}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </>
        )}

        {etapa === 2 && (
          <>
            <h2 className="text-secao">Quem é o responsável?</h2>
            <div className="mt-4 space-y-3">
              <input
                value={form.nome}
                onChange={(e) => definir('nome', e.target.value)}
                placeholder="Nome completo"
                className="min-h-[54px] w-full rounded-2xl bg-fundo px-4 text-[15px] font-semibold outline-none ring-acao/40 placeholder:font-medium placeholder:text-texto-sec focus:ring-2"
              />
              <input
                value={form.telefone}
                onChange={(e) => definir('telefone', e.target.value)}
                placeholder="(42) 99000-0000"
                inputMode="tel"
                className="min-h-[54px] w-full rounded-2xl bg-fundo px-4 text-[15px] font-semibold outline-none ring-acao/40 placeholder:font-medium placeholder:text-texto-sec focus:ring-2"
              />
              <p className="text-legenda text-texto-sec">
                O telefone é usado apenas pela Defesa Civil para confirmar o cadastro.
              </p>
            </div>
          </>
        )}

        {etapa === 3 && (
          <>
            <h2 className="text-secao">Onde fica o espaço?</h2>
            <div className="mt-4 space-y-3">
              <input
                value={form.endereco}
                onChange={(e) => definir('endereco', e.target.value)}
                placeholder="Rua, número - bairro"
                className="min-h-[54px] w-full rounded-2xl bg-fundo px-4 text-[15px] font-semibold outline-none ring-acao/40 placeholder:font-medium placeholder:text-texto-sec focus:ring-2"
              />
              <button
                onClick={() => definir('endereco', 'Rua Frei Rogério, 250 - São Basílio Magno')}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-verde-claro px-4 text-[14px] font-bold text-pressionado transition-colors hover:bg-[#D8F0E5]"
              >
                <LocateFixed size={17} />
                Usar minha localização
              </button>
            </div>
          </>
        )}

        {etapa === 4 && (
          <>
            <h2 className="text-secao">Quantas pessoas o espaço acomoda?</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {CAPACIDADES.map((c) => (
                <button
                  key={c}
                  onClick={() => definir('capacidade', c)}
                  className={`min-h-[72px] rounded-2xl border px-4 text-[15px] font-bold transition-colors ${
                    form.capacidade === c
                      ? 'border-acao bg-verde-claro text-pressionado'
                      : 'border-borda bg-white text-texto hover:border-texto-sec/40'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </>
        )}

        {etapa === 5 && (
          <>
            <h2 className="text-secao">O que o espaço oferece?</h2>
            <p className="mt-1 text-corpo text-texto-sec">Marque tudo o que se aplica.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {Object.entries(ESTRUTURA).map(([id, { rotulo, Icone }]) => {
                const ativo = form.estrutura.includes(id)
                return (
                  <button
                    key={id}
                    onClick={() => alternarEstrutura(id)}
                    className={`flex min-h-[56px] items-center gap-2.5 rounded-2xl border px-3.5 text-left transition-colors ${
                      ativo
                        ? 'border-acao bg-verde-claro text-pressionado'
                        : 'border-borda bg-white hover:border-texto-sec/40'
                    }`}
                  >
                    <Icone
                      size={19}
                      strokeWidth={2.2}
                      className={ativo ? 'text-pressionado' : 'text-acao'}
                    />
                    <span className="text-[13px] font-bold leading-tight">{rotulo}</span>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {etapa === 6 && (
          <>
            <h2 className="text-secao">Confira antes de enviar</h2>
            <dl className="mt-4 divide-y divide-borda">
              {[
                ['Tipo de espaço', form.tipo],
                ['Responsável', form.nome],
                ['Telefone', form.telefone],
                ['Endereço', form.endereco],
                ['Capacidade', form.capacidade],
                [
                  'Estrutura',
                  form.estrutura.map((id) => ESTRUTURA[id].rotulo).join(', '),
                ],
              ].map(([rotulo, valor]) => (
                <div key={rotulo} className="flex items-start justify-between gap-4 py-3">
                  <dt className="shrink-0 text-corpo text-texto-sec">{rotulo}</dt>
                  <dd className="text-right text-[14px] font-bold">{valor}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-legenda text-texto-sec">
              Ao enviar, você concorda que a Defesa Civil visite o local para validar o
              cadastro.
            </p>
          </>
        )}
      </section>

      {/* Navegação entre etapas */}
      <div className="mt-5 flex gap-3 md:mt-6">
        {etapa > 1 && (
          <Button
            variante="secundario"
            className="flex-1 md:max-w-[160px]"
            onClick={() => setEtapa((e) => e - 1)}
          >
            Voltar
          </Button>
        )}
        <Button
          variante="primario"
          desativado={!etapaValida}
          className="flex-[2] md:max-w-xs"
          onClick={avancar}
        >
          {etapa === ETAPAS.length ? 'Enviar cadastro' : 'Continuar'}
        </Button>
      </div>
    </div>
  )
}

/** Tela final: protocolo gerado e status "Em análise" (tela 10) */
function Confirmacao({ protocolo, aoRecomecar }) {
  const navigate = useNavigate()
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-40px)] w-full max-w-md flex-col items-center justify-center px-5 py-12 text-center">
      <span className="grid h-40 w-40 place-items-center rounded-full bg-verde-claro/60">
        <span className="grid h-28 w-28 place-items-center rounded-full bg-verde-claro">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-acao text-white shadow-[0_12px_30px_rgba(15,157,107,0.4)]">
            <Check size={36} strokeWidth={3} />
          </span>
        </span>
      </span>

      <h1 className="mt-8 text-titulo md:text-titulo-lg">Cadastro enviado</h1>
      <p className="mt-3 text-corpo text-texto-sec">
        Obrigado por oferecer o seu espaço. A Defesa Civil entra em contato pelo telefone
        informado em até 24 horas para validar o local.
      </p>

      <div className="mt-7 w-full rounded-2xl bg-white p-1 shadow-card">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-corpo text-texto-sec">Protocolo</span>
          <span className="text-[16px] font-extrabold tracking-wide">{protocolo}</span>
        </div>
        <div className="flex items-center justify-between border-t border-borda px-4 py-3">
          <span className="text-corpo text-texto-sec">Situação</span>
          <RiskBadge tom="atencao">Em análise</RiskBadge>
        </div>
      </div>

      <Button variante="primario" className="mt-7 w-full" onClick={() => navigate('/')}>
        Voltar ao início
      </Button>
      <Button variante="secundario" className="mt-3 w-full" onClick={aoRecomecar}>
        Cadastrar outro espaço
      </Button>
    </div>
  )
}
