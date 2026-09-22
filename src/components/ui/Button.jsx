const VARIANTES = {
  primario:
    'bg-acao text-white shadow-[0_8px_24px_rgba(15,157,107,0.28)] hover:bg-pressionado active:bg-pressionado',
  secundario:
    'bg-white text-texto border border-borda hover:border-texto-sec/40 active:bg-fundo',
  emergencia:
    'bg-emergencia text-white shadow-[0_10px_30px_rgba(199,38,27,0.32)] hover:bg-[#A81F16] active:bg-[#A81F16]',
  neutro: 'bg-fundo text-texto hover:bg-borda active:bg-borda',
  desativado: 'bg-borda/70 text-texto-sec cursor-not-allowed',
}

export default function Button({
  variante = 'primario',
  desativado = false,
  className = '',
  children,
  ...resto
}) {
  const estilo = desativado ? VARIANTES.desativado : VARIANTES[variante]
  return (
    <button
      type="button"
      disabled={desativado}
      className={`inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl px-5 text-[15px] font-bold transition-colors ${estilo} ${className}`}
      {...resto}
    >
      {children}
    </button>
  )
}
