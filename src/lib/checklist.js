/** Itens da lista "Prepare sua saída", salvos no aparelho */
export const CHECKLIST = [
  { id: 'documentos', rotulo: 'Documentos em saco plástico' },
  { id: 'remedios', rotulo: 'Remédios de uso contínuo e receitas' },
  { id: 'agua-alimentos', rotulo: 'Água e alimentos não perecíveis' },
  { id: 'roupas', rotulo: 'Roupas e cobertores' },
  { id: 'carregador', rotulo: 'Carregador de celular e lanterna' },
  { id: 'higiene', rotulo: 'Itens de higiene e máscaras' },
]

export const CHAVE_CHECKLIST = 'iguacu-alerta:checklist-saida'

export function lerChecklist() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_CHECKLIST)) ?? ['documentos']
  } catch {
    return ['documentos']
  }
}
