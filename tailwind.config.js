/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Cor primária
        acao: '#0F9D6B',
        pressionado: '#0B7A53',
        'verde-claro': '#E7F6F0',
        // Escala de risco
        seguro: '#0F9D6B',
        atencao: '#F2B705',
        alerta: '#E4661A',
        emergencia: '#C7261B',
        // Neutros
        branco: '#FFFFFF',
        fundo: '#F5F7F6',
        borda: '#EAEEEC',
        'texto-sec': '#6B7573',
        texto: '#14201C',
      },
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        titulo: ['26px', { lineHeight: '1.2', fontWeight: '800' }],
        'titulo-lg': ['32px', { lineHeight: '1.15', fontWeight: '800' }],
        secao: ['20px', { lineHeight: '1.3', fontWeight: '700' }],
        card: ['15px', { lineHeight: '1.35', fontWeight: '700' }],
        corpo: ['14px', { lineHeight: '1.55', fontWeight: '500' }],
        legenda: ['12px', { lineHeight: '1.4', fontWeight: '600' }],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 32, 28, 0.04), 0 6px 20px rgba(20, 32, 28, 0.06)',
        flutuante: '0 8px 30px rgba(20, 32, 28, 0.14)',
      },
      borderRadius: {
        '2.5xl': '20px',
        '3.5xl': '28px',
      },
    },
  },
  plugins: [],
}
