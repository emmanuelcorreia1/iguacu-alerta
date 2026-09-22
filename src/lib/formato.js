/** Formata metros no padrão brasileiro: 3.04 -> "3,04 m" */
export function metros(valor) {
  return `${valor.toFixed(2).replace('.', ',')} m`
}

/** Nível do rio -> faixa de risco usada em cores e textos */
export function faixaDoNivel(nivel, cotas = { atencao: 4, alerta: 5, emergencia: 6 }) {
  if (nivel >= cotas.emergencia) return { tom: 'emergencia', rotulo: 'Emergência' }
  if (nivel >= cotas.alerta) return { tom: 'alerta', rotulo: 'Alerta' }
  if (nivel >= cotas.atencao) return { tom: 'atencao', rotulo: 'Atenção' }
  return { tom: 'seguro', rotulo: 'Nível normal' }
}

/** Estado de ocupação de um abrigo (4 estados do protótipo) */
export function ocupacaoDoAbrigo(abrigo) {
  const vagas = abrigo.vagasTotais - abrigo.vagasOcupadas
  const pct = abrigo.vagasOcupadas / abrigo.vagasTotais
  if (vagas <= 0) {
    return {
      tom: 'emergencia',
      badge: 'Lotado',
      rotulo: 'Sem vagas · veja o abrigo mais próximo',
      vagas,
      pct,
    }
  }
  if (pct >= 0.85) {
    return { tom: 'alerta', badge: `${vagas} vagas`, rotulo: 'Quase cheio', vagas, pct }
  }
  if (pct >= 0.5) {
    return { tom: 'atencao', badge: `${vagas} vagas`, rotulo: 'Enchendo', vagas, pct }
  }
  return { tom: 'seguro', badge: `${vagas} vagas`, rotulo: 'Muitas vagas', vagas, pct }
}

/** Nível de risco de um bairro -> tom de cor e rótulo exibido */
export const TOM_DO_RISCO = { alto: 'alerta', medio: 'atencao', baixo: 'seguro' }
export const ROTULO_DO_RISCO = {
  alto: 'Risco alto',
  medio: 'Risco moderado',
  baixo: 'Menor risco',
}

/** Cor sólida de cada tom da escala de risco */
export const COR_DO_TOM = {
  seguro: '#0F9D6B',
  atencao: '#F2B705',
  alerta: '#E4661A',
  emergencia: '#C7261B',
}

/** Link de rota no Google Maps (abre no app de mapas do aparelho) */
export function linkComoChegar(abrigo) {
  return `https://www.google.com/maps/dir/?api=1&destination=${abrigo.lat},${abrigo.lng}`
}
