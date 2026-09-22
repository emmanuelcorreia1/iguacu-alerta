import { Check } from 'lucide-react'
import ProgressBar from './ProgressBar'

/**
 * Progresso do formulário em etapas.
 * Mobile: barra simples + "x de 6". Desktop: stepper horizontal com rótulos.
 */
export default function StepperHeader({ etapas, atual }) {
  return (
    <div>
      {/* Mobile: barra de progresso simples */}
      <div className="md:hidden">
        <ProgressBar valor={atual / etapas.length} tom="seguro" className="h-2" />
      </div>

      {/* Desktop: stepper horizontal */}
      <ol className="hidden items-center gap-2 md:flex">
        {etapas.map((rotulo, i) => {
          const numero = i + 1
          const feito = numero < atual
          const corrente = numero === atual
          return (
            <li key={rotulo} className="flex items-center gap-2 last:flex-none md:flex-1">
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[13px] font-bold transition-colors ${
                  feito
                    ? 'bg-acao text-white'
                    : corrente
                      ? 'border-2 border-acao bg-verde-claro text-pressionado'
                      : 'border border-borda bg-white text-texto-sec'
                }`}
              >
                {feito ? <Check size={16} strokeWidth={3} /> : numero}
              </span>
              <span
                className={`whitespace-nowrap text-legenda ${
                  corrente ? 'font-bold text-texto' : 'text-texto-sec'
                }`}
              >
                {rotulo}
              </span>
              {numero < etapas.length && (
                <span
                  className={`h-[2px] min-w-4 flex-1 rounded-full ${feito ? 'bg-acao' : 'bg-borda'}`}
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
