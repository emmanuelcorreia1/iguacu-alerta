const CORES = {
  azul: 'bg-[#E9EEFC] text-[#4263EB]',
  laranja: 'bg-[#FCEFE0] text-[#E8590C]',
  verde: 'bg-verde-claro text-acao',
  roxo: 'bg-[#EEEAFB] text-[#6741D9]',
  vermelho: 'bg-[#FAE3E1] text-emergencia',
  cinza: 'bg-fundo text-texto-sec',
}

/** Ícone em quadrado de fundo pastel (52 px, cantos arredondados) */
export default function IconSquare({ Icone, cor = 'verde', tamanho = 52, className = '' }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-2xl ${CORES[cor]} ${className}`}
      style={{ width: tamanho, height: tamanho }}
    >
      <Icone size={tamanho * 0.42} strokeWidth={2.2} />
    </span>
  )
}
