import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, MessageCircle, Send, Sparkles } from 'lucide-react'
import RiskBadge from '../components/ui/RiskBadge'
import nivelRio from '../data/nivelRio.json'
import bairros from '../data/bairros.json'
import { FOTO_EL_NINO } from '../lib/fotos'
import { metros } from '../lib/formato'

const CARDS = [
  {
    titulo: 'O que é o El Niño',
    texto:
      'É um fenômeno climático natural caracterizado pelo aquecimento anormal das águas superficiais do Oceano Pacífico Equatorial. Ele enfraquece os ventos alísios, altera a circulação atmosférica global e modifica os regimes de chuva e temperatura em várias regiões do planeta.',
  },
  {
    titulo: 'Mas no que isso nos afeta?',
    texto:
      'O El Niño provoca chuvas intensas e contínuas no Sul do Brasil, sobrecarregando a bacia do Rio Iguaçu. Como o relevo de União da Vitória favorece o acúmulo de água e o solo fica rapidamente saturado, o nível do rio sobe gradativamente, gerando um alto risco de graves enchentes na cidade.',
  },
  {
    titulo: 'Por que o Sul do Brasil sofre mais',
    texto:
      'O aquecimento do Pacífico intensifica o Jato de Baixos Níveis, uma corrente de ventos a cerca de 1.500 metros de altitude que transporta ar quente e úmido da Amazônia diretamente para a nossa região. Além disso, frentes frias ficam retidas sobre o Sul por bloqueios atmosféricos, resultando em tempestades recorrentes, chuvas acumuladas recordes e inundações.',
  },
  {
    titulo: 'A enchente de outubro de 2023',
    texto:
      'Em 8 de outubro de 2023 começou a terceira maior enchente da história do Vale do Iguaçu, deixando milhares de pessoas desabrigadas. Quando o rio atingiu 5 m, parte da rodovia BR-476 (km 356) desmoronou, elevando o tráfego de veículos pesados dentro do perímetro urbano. Abrigos como o Ginásio Benedito Albino, a Escola Renato Arlei Otto e a Escola Dídio Augusto receberam as famílias atingidas.',
  },
]

export default function ElNino() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto w-full max-w-3xl pb-10 md:px-8">
      {/* Imagem de satélite do fenômeno */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-b from-[#B9C2BE] to-[#EDF0EE] md:mt-8 md:h-64 md:rounded-3.5xl">
        <img
          src={FOTO_EL_NINO}
          alt="Imagem de satélite do fenômeno El Niño"
          className="h-full w-full object-cover"
        />
        <span className="absolute bottom-3 right-3 rounded-full bg-texto/60 px-3 py-1 text-legenda font-bold text-white">
          Imagem de satélite
        </span>
        <div className="pt-safe absolute left-4 top-4">
          <button
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-flutuante md:hidden"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
      </div>

      <div className="relative -mt-6 rounded-t-3.5xl bg-fundo px-5 pt-6 md:mt-8 md:rounded-none md:bg-transparent md:px-0 md:pt-0">
        <RiskBadge tom="roxo">Clima e enchentes</RiskBadge>
        <h1 className="mt-3 text-titulo md:text-titulo-lg">Por que chove tanto aqui</h1>

        <div className="mt-5 space-y-4">
          {CARDS.map((c) => (
            <article
              key={c.titulo}
              className="rounded-3xl border border-borda/70 bg-white p-5 shadow-card md:p-6"
            >
              <h2 className="text-[17px] font-bold">{c.titulo}</h2>
              <p className="mt-2 text-corpo text-texto-sec">{c.texto}</p>
            </article>
          ))}
        </div>

        <ChatElNino />
      </div>
    </div>
  )
}

/*
 * INTEGRAÇÃO DE IA (demonstração):
 * este chat responde com regras simples e dados locais para mostrar como o
 * assistente funcionaria. Na versão real, cada pergunta seria enviada para a
 * API do assistente (ex.: Claude) junto com o contexto do nível do rio e do
 * bairro da pessoa, e a resposta chegaria em streaming para a lista abaixo.
 */
function respostaSimulada(pergunta) {
  const semAcento = (t) =>
    t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  const p = semAcento(pergunta)

  // Reconhece o bairro pelo nome completo ou por uma palavra marcante dele
  // (ex.: "Rocio" encontra "Nossa Senhora do Rocio")
  const PALAVRAS_COMUNS = new Set(['de', 'da', 'do', 'das', 'dos', 'nossa', 'senhora', 'sao', 'santa'])
  const bairroCitado = bairros.find((b) => {
    const nome = semAcento(b.nome)
    if (p.includes(nome)) return true
    return nome
      .split(' ')
      .some((t) => t.length >= 4 && !PALAVRAS_COMUNS.has(t) && p.includes(t))
  })
  if (bairroCitado) {
    const falta = bairroCitado.cota - nivelRio.atual
    return `O bairro ${bairroCitado.nome} é atingido quando o rio chega a ${metros(
      bairroCitado.cota,
    )}. Agora o rio está em ${metros(nivelRio.atual)}, ou seja, faltam ${metros(
      falta,
    )} para a água chegar. Vou avisar você se a previsão mudar - enquanto isso, deixe a mochila de saída pronta.`
  }

  if (p.includes('el nino') || p.includes('nino') || p.includes('chove')) {
    return 'O El Niño aquece as águas do Pacífico e faz chover muito mais no Sul do Brasil. Essa chuva cai na bacia do Rio Iguaçu e desce até União da Vitória em um ou dois dias - por isso o rio pode subir mesmo em dias de sol na cidade.'
  }
  if (
    p.includes('subir') ||
    p.includes('previs') ||
    p.includes('semana') ||
    p.includes('nivel') ||
    p.includes('rio')
  ) {
    return `O Rio Iguaçu está em ${metros(nivelRio.atual)} (${nivelRio.atualizadoTexto.toLowerCase()}). Nos últimos 7 dias ele variou de ${metros(nivelRio.historico[0].nivel)} a ${metros(
      Math.max(...nivelRio.historico.map((h) => h.nivel)),
    )}. A Defesa Civil entra em atenção a partir de ${nivelRio.cotas.atencao} m.`
  }
  if (p.includes('sair') || p.includes('quando') || p.includes('evacu')) {
    return `A recomendação é se preparar quando o rio passa de ${nivelRio.cotas.atencao} m e sair de casa assim que a Defesa Civil avisar o seu bairro - sem esperar a água chegar. Confira a cota do seu bairro na tela "Meu bairro" e deixe documentos e remédios prontos.`
  }
  if (p.includes('abrigo')) {
    return 'Há abrigos abertos com vagas agora. Toque em "Abrigos" no menu para ver o mapa, as vagas em tempo real e a rota até o mais próximo de você.'
  }
  if (p.includes('2023') || p.includes('enchente')) {
    return 'Em outubro de 2023 aconteceu a terceira maior enchente da história do Vale do Iguaçu. Quando o rio atingiu 5 m, parte da BR-476 desmoronou. Milhares de pessoas ficaram desabrigadas e abrigos como o Ginásio Benedito Albino receberam as famílias.'
  }
  return 'Posso responder sobre o nível do rio, a cota do seu bairro, quando sair de casa e o que o El Niño muda por aqui. Experimente: "O rio vai subir esta semana?" ou "Qual a situação do Navegantes?"'
}

const SUGESTOES = [
  'O rio vai subir esta semana?',
  'Quando devo sair de casa?',
  'Qual a situação do Navegantes?',
]

function ChatElNino() {
  const [mensagens, setMensagens] = useState([
    {
      de: 'bot',
      texto:
        'Olá! Eu sou o assistente do Iguaçu Alerta. Posso explicar o El Niño, dizer como está o rio e ajudar você a decidir a hora de sair de casa.',
    },
  ])
  const [texto, setTexto] = useState('')
  const [digitando, setDigitando] = useState(false)
  const fimRef = useRef(null)

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [mensagens, digitando])

  function enviar(pergunta) {
    const limpa = pergunta.trim()
    if (!limpa || digitando) return
    setMensagens((m) => [...m, { de: 'voce', texto: limpa }])
    setTexto('')
    setDigitando(true)
    setTimeout(() => {
      setMensagens((m) => [...m, { de: 'bot', texto: respostaSimulada(limpa) }])
      setDigitando(false)
    }, 700)
  }

  return (
    <section className="mt-6 rounded-3xl border border-borda/70 bg-white p-5 shadow-card md:p-6">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#EEEAFB] text-[#6741D9]">
          <MessageCircle size={17} />
        </span>
        <h2 className="text-[17px] font-bold">Pergunte sobre o clima</h2>
        <RiskBadge tom="roxo" className="ml-auto">
          <Sparkles size={12} />
          Demonstração
        </RiskBadge>
      </div>

      <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
        {mensagens.map((m, i) =>
          m.de === 'bot' ? (
            <p
              key={i}
              className="mr-8 rounded-2xl rounded-tl-md bg-fundo p-4 text-corpo text-texto"
            >
              {m.texto}
            </p>
          ) : (
            <p
              key={i}
              className="ml-8 rounded-2xl rounded-tr-md bg-verde-claro p-4 text-corpo font-semibold text-pressionado"
            >
              {m.texto}
            </p>
          ),
        )}
        {digitando && (
          <p className="mr-8 w-max rounded-2xl rounded-tl-md bg-fundo px-4 py-3 text-corpo text-texto-sec">
            digitando…
          </p>
        )}
        <span ref={fimRef} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGESTOES.map((s) => (
          <button
            key={s}
            onClick={() => enviar(s)}
            className="rounded-full border border-borda bg-white px-3.5 py-2 text-legenda font-bold text-texto-sec transition-colors hover:border-acao hover:text-pressionado"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          enviar(texto)
        }}
        className="mt-3 flex items-center gap-2 rounded-full border border-borda bg-fundo px-4 py-2"
      >
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escreva a sua pergunta…"
          className="min-h-[40px] flex-1 bg-transparent text-corpo font-semibold outline-none placeholder:text-texto-sec"
        />
        <button
          type="submit"
          aria-label="Enviar"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-acao text-white transition-colors hover:bg-pressionado"
        >
          <Send size={16} />
        </button>
      </form>
      <p className="mt-2 text-legenda text-texto-sec">
        Respostas simuladas para demonstração - aqui entraria a integração com a IA.
      </p>
    </section>
  )
}
