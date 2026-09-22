const SEGMENTOS = [
  { de: 0, ate: 4, cor: '#0F9D6B' },
  { de: 4, ate: 5, cor: '#F2B705' },
  { de: 5, ate: 6, cor: '#E4661A' },
  { de: 6, ate: 7, cor: '#C7261B' },
]
const MAXIMO = 7

/**
 * Régua do nível do rio com as 4 faixas de cor e o marcador do nível atual.
 * `cinza` desenha a versão desativada usada no modo offline.
 */
export default function RiverLevelGauge({ nivel, cinza = false, className = '' }) {
  const posicao = Math.max(0.015, Math.min(0.985, nivel / MAXIMO))
  return (
    <div className={className}>
      <div className="relative">
        <div className="flex h-2 gap-1">
          {SEGMENTOS.map((s) => (
            <div
              key={s.de}
              className="h-full rounded-full"
              style={{
                width: `${((s.ate - s.de) / MAXIMO) * 100}%`,
                backgroundColor: cinza ? '#D4DAD7' : s.cor,
              }}
            />
          ))}
        </div>
        {!cinza && (
          <span
            className="absolute -top-1 h-4 w-[3px] -translate-x-1/2 rounded-full bg-texto"
            style={{ left: `${posicao * 100}%` }}
          />
        )}
      </div>
      {!cinza && (
        <div className="relative mt-2 h-4 text-legenda text-texto-sec">
          <span className="absolute left-0">Normal</span>
          <span className="absolute -translate-x-1/2" style={{ left: `${(4 / MAXIMO) * 100}%` }}>
            4 m
          </span>
          <span className="absolute -translate-x-1/2" style={{ left: `${(5 / MAXIMO) * 100}%` }}>
            5 m
          </span>
          <span className="absolute -translate-x-1/2" style={{ left: `${(6 / MAXIMO) * 100}%` }}>
            6 m +
          </span>
        </div>
      )}
    </div>
  )
}
