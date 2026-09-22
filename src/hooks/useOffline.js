import { useEffect, useState } from 'react'

const CHAVE_SINCRONIZACAO = 'iguacu-alerta:ultima-sincronizacao'

/**
 * Informa se o app está sem conexão e quando os dados foram
 * sincronizados pela última vez (para o banner "Sem conexão").
 */
export default function useOffline() {
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const aoConectar = () => setOnline(true)
    const aoDesconectar = () => setOnline(false)
    window.addEventListener('online', aoConectar)
    window.addEventListener('offline', aoDesconectar)
    return () => {
      window.removeEventListener('online', aoConectar)
      window.removeEventListener('offline', aoDesconectar)
    }
  }, [])

  useEffect(() => {
    if (online) {
      localStorage.setItem(CHAVE_SINCRONIZACAO, new Date().toISOString())
    }
  }, [online])

  const salvo = localStorage.getItem(CHAVE_SINCRONIZACAO)
  const data = salvo ? new Date(salvo) : new Date()
  const dataTexto = data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  })
  const horaTexto = `${data.getHours()}h`

  return { online, dataTexto, horaTexto }
}
