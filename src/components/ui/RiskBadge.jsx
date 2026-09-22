const TONS = {
  seguro: 'bg-verde-claro text-pressionado',
  atencao: 'bg-[#FBF2CF] text-[#8F6E04]',
  alerta: 'bg-[#FCEADD] text-alerta',
  emergencia: 'bg-[#FAE3E1] text-emergencia',
  neutro: 'bg-fundo text-texto-sec',
  branco: 'bg-white text-pressionado shadow-card',
  azul: 'bg-[#E7EDFB] text-[#3B5BDB]',
  roxo: 'bg-[#ECE9FB] text-[#6741D9]',
}

/** Badge em pílula com fundo pastel, usada em toda a escala de risco */
export default function RiskBadge({ tom = 'neutro', className = '', children }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-legenda font-bold ${TONS[tom]} ${className}`}
    >
      {children}
    </span>
  )
}
