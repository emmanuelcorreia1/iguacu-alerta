import { COR_DO_TOM } from '../../lib/formato'

/**
 * Barra de progresso fina.
 * `valor` vai de 0 a 1; `tom` usa a escala de risco (seguro/atencao/alerta/emergencia).
 */
export default function ProgressBar({ valor, tom = 'seguro', className = '' }) {
  const pct = Math.max(0, Math.min(1, valor)) * 100
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-borda ${className}`}>
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{ width: `${pct}%`, backgroundColor: COR_DO_TOM[tom] }}
      />
    </div>
  )
}
