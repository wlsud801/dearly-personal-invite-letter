'use client'

import { useRef } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void
        Map: new (
          container: HTMLElement,
          options: { center: InstanceType<Window['kakao']['maps']['LatLng']>; level: number }
        ) => unknown
        LatLng: new (lat: number, lng: number) => unknown
        Marker: new (options: { position: unknown }) => { setMap: (map: unknown) => void }
      }
    }
  }
}

// 라루체 웨딩 좌표 (서울 중구 퇴계로18길 46)
const LAT = 37.560868
const LNG = 126.986964
const LEVEL = 3

export default function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null)

  const initMap = () => {
    window.kakao.maps.load(() => {
      if (!mapRef.current) return
      const center = new window.kakao.maps.LatLng(LAT, LNG)
      const map = new window.kakao.maps.Map(mapRef.current, { center, level: LEVEL })
      new window.kakao.maps.Marker({ position: center }).setMap(map)
    })
  }

  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY}&autoload=false`}
        strategy="afterInteractive"
        onReady={initMap}
      />
      <div ref={mapRef} className="w-full h-[231px]" />
    </>
  )
}
