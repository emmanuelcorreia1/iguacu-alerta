import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import { ChevronRight, LocateFixed } from 'lucide-react'
import RiskBadge from '../components/ui/RiskBadge'
import { FOTO_ABRIGO } from '../lib/fotos'
import { COR_DO_TOM, TOM_DO_RISCO, ocupacaoDoAbrigo } from '../lib/formato'

const CENTRO_UV = [-26.2273, -51.087]
// Posição usada enquanto a pessoa não autoriza a localização real
const POSICAO_PADRAO = [-26.2278, -51.0868]

/** Pino colorido conforme a ocupação do abrigo */
function pinoDoAbrigo(cor, selecionado) {
  const s = selecionado ? 46 : 38
  const casa = `<svg width="${s * 0.45}" height="${s * 0.45}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.7V21h14V9.7"/></svg>`
  return L.divIcon({
    className: 'pin-abrigo',
    html: `<div style="width:${s}px;height:${s}px;border-radius:9999px;background:${cor};border:3px solid #fff;box-shadow:0 6px 14px rgba(20,32,28,.35);display:flex;align-items:center;justify-content:center;">${casa}</div>`,
    iconSize: [s, s],
    iconAnchor: [s / 2, s / 2],
  })
}

function CentralizarEm({ posicao, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (posicao) {
      if (zoom) map.setView(posicao, zoom, { animate: true })
      else map.panTo(posicao, { animate: true })
    }
  }, [map, posicao, zoom])
  return null
}

/**
 * Mapa Leaflet dos abrigos: pinos coloridos por ocupação, posição real
 * da pessoa (quando autorizada), bairro pesquisado em destaque e
 * card de preview do abrigo selecionado.
 */
export default function AbrigosMapa({
  abrigos,
  selecionado,
  aoSelecionar,
  bairroDestacado = null,
  className = '',
}) {
  const navigate = useNavigate()
  const ocupacao = selecionado ? ocupacaoDoAbrigo(selecionado) : null

  const [posicaoUsuario, setPosicaoUsuario] = useState(POSICAO_PADRAO)
  const [posicaoReal, setPosicaoReal] = useState(false)
  // Guarda também o bairro vigente: se a pessoa pesquisar outro bairro
  // depois de clicar em "localizar", o destaque volta a ter prioridade
  const [focoUsuario, setFocoUsuario] = useState(null)

  // Tenta obter a localização real assim que o mapa abre
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosicaoUsuario([coords.latitude, coords.longitude])
        setPosicaoReal(true)
      },
      () => {},
      { enableHighAccuracy: true, timeout: 6000 },
    )
  }, [])

  function localizar() {
    aoSelecionar(null)
    const irPara = (pos) =>
      setFocoUsuario({ pos: [...pos], bairro: bairroDestacado?.id ?? null })
    if (!navigator.geolocation) {
      irPara(posicaoUsuario)
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = [coords.latitude, coords.longitude]
        setPosicaoUsuario(pos)
        setPosicaoReal(true)
        irPara(pos)
      },
      () => irPara(posicaoUsuario),
      { enableHighAccuracy: true, timeout: 6000 },
    )
  }

  // O foco manual só vale enquanto o bairro pesquisado não mudar
  const focoManual =
    focoUsuario && focoUsuario.bairro === (bairroDestacado?.id ?? null)
      ? focoUsuario.pos
      : null

  const foco = selecionado
    ? [selecionado.lat, selecionado.lng]
    : (focoManual ??
      (bairroDestacado ? [bairroDestacado.lat, bairroDestacado.lng] : null))

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-borda ${className}`}>
      <MapContainer
        center={CENTRO_UV}
        zoom={14}
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CentralizarEm posicao={foco} zoom={bairroDestacado && !selecionado ? 15 : null} />

        {/* Bairro pesquisado em destaque */}
        {bairroDestacado && (
          <Circle
            center={[bairroDestacado.lat, bairroDestacado.lng]}
            radius={480}
            pathOptions={{
              color: COR_DO_TOM[TOM_DO_RISCO[bairroDestacado.risco]],
              fillColor: COR_DO_TOM[TOM_DO_RISCO[bairroDestacado.risco]],
              fillOpacity: 0.16,
              weight: 2,
              dashArray: '6 6',
            }}
          >
            <Tooltip permanent direction="top" offset={[0, -10]}>
              <span style={{ fontWeight: 700 }}>{bairroDestacado.nome}</span>
            </Tooltip>
          </Circle>
        )}

        {/* Posição da pessoa (real quando autorizada) */}
        <CircleMarker
          center={posicaoUsuario}
          radius={9}
          pathOptions={{ color: '#fff', weight: 3, fillColor: '#3B5BDB', fillOpacity: 1 }}
        >
          {posicaoReal && (
            <Tooltip direction="top" offset={[0, -8]}>
              Você está aqui
            </Tooltip>
          )}
        </CircleMarker>

        {abrigos.map((a) => {
          const tom = ocupacaoDoAbrigo(a).tom
          return (
            <Marker
              key={a.id}
              position={[a.lat, a.lng]}
              icon={pinoDoAbrigo(COR_DO_TOM[tom], selecionado?.id === a.id)}
              eventHandlers={{ click: () => aoSelecionar(a) }}
            />
          )
        })}
      </MapContainer>

      {/* Botão de localizar */}
      <button
        aria-label="Usar minha localização"
        className="absolute right-3 z-[1000] grid h-12 w-12 place-items-center rounded-2xl bg-white text-acao shadow-flutuante"
        style={{ bottom: selecionado ? 110 : 16 }}
        onClick={localizar}
      >
        <LocateFixed size={20} />
      </button>

      {/* Preview do abrigo tocado */}
      {selecionado && (
        <button
          onClick={() => navigate(`/abrigos/${selecionado.id}`)}
          className="absolute inset-x-3 bottom-3 z-[1000] flex items-center gap-3 rounded-3xl bg-white p-3 text-left shadow-flutuante"
        >
          {FOTO_ABRIGO[selecionado.id] ? (
            <img
              src={FOTO_ABRIGO[selecionado.id]}
              alt=""
              className="h-16 w-16 shrink-0 rounded-2xl object-cover"
            />
          ) : (
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-borda text-legenda text-texto-sec">
              Foto
            </span>
          )}
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="truncate text-card">{selecionado.nome}</span>
              <RiskBadge tom={ocupacao.tom}>{ocupacao.badge}</RiskBadge>
            </span>
            <span className="mt-0.5 block truncate text-corpo text-texto-sec">
              {selecionado.endereco}
            </span>
            <span className="mt-0.5 block text-legenda">
              <span className="font-bold text-pressionado">
                {String(selecionado.distanciaKm).replace('.', ',')} km
              </span>{' '}
              <span className="text-texto-sec">{selecionado.abertoDesde}</span>
            </span>
          </span>
          <ChevronRight size={18} className="shrink-0 text-texto-sec" />
        </button>
      )}
    </div>
  )
}
