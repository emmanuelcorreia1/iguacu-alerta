import {
  Accessibility,
  Bath,
  BedDouble,
  CookingPot,
  GlassWater,
  PawPrint,
  ShowerHead,
  Zap,
} from 'lucide-react'

/** Itens de estrutura dos abrigos, com rótulo e ícone */
export const ESTRUTURA = {
  banheiros: { rotulo: 'Banheiros', Icone: Bath },
  'chuveiro-quente': { rotulo: 'Chuveiro quente', Icone: ShowerHead },
  colchoes: { rotulo: 'Colchões', Icone: BedDouble },
  cozinha: { rotulo: 'Cozinha', Icone: CookingPot },
  energia: { rotulo: 'Energia', Icone: Zap },
  'agua-potavel': { rotulo: 'Água potável', Icone: GlassWater },
  acessivel: { rotulo: 'Acessível', Icone: Accessibility },
  'aceita-animais': { rotulo: 'Aceita animais', Icone: PawPrint },
}
