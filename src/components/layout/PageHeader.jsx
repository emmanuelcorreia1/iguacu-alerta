import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

/** Cabeçalho de página com botão voltar (mobile) e ações à direita */
export default function PageHeader({ titulo, extra, acoes }) {
  const navigate = useNavigate()
  return (
    <header className="flex items-center gap-3">
      <button
        onClick={() => navigate(-1)}
        aria-label="Voltar"
        className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white shadow-card transition-colors hover:bg-fundo md:hidden"
      >
        <ChevronLeft size={20} />
      </button>
      <h1 className="flex-1 truncate text-titulo md:text-titulo-lg">{titulo}</h1>
      {extra}
      {acoes && <div className="flex shrink-0 items-center gap-2">{acoes}</div>}
    </header>
  )
}
