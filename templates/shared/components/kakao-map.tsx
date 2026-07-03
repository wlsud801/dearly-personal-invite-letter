"use client";

/* -------------------------------------------------------------------------- */
/*  KakaoMap — 주소 기반 카카오 지도 (모든 템플릿 공용)                          */
/*                                                                             */
/*  venue.address 를 services(geocoder)로 좌표 변환해 지도 + 마커를 렌더한다.    */
/*  SDK 는 `NEXT_PUBLIC_KAKAO_JS_KEY`(카카오 JavaScript 키)로 1회만 동적 로드.    */
/*  키가 없거나 SDK/지오코딩 실패 시 openMap 으로 여는 플레이스홀더로 폴백한다.   */
/*  → 키 미설정 환경에서도 깨지지 않고, 키를 넣으면 실지도가 뜬다.               */
/*                                                                             */
/*  카카오 개발자 콘솔에서 JS 키의 "사이트 도메인"에 배포 도메인을 등록해야 한다.  */
/* -------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { openMap } from "../lib/actions";

/* --- 사용 범위만 좁게 선언한 카카오 지도 SDK 타입 --- */
type KakaoLatLng = { readonly __brand: "LatLng" };
type KakaoMapInstance = { setCenter: (latlng: KakaoLatLng) => void };
type GeocodeResult = { x: string; y: string };
type KakaoSDK = {
  maps: {
    load: (cb: () => void) => void;
    Map: new (
      container: HTMLElement,
      options: { center: KakaoLatLng; level: number },
    ) => KakaoMapInstance;
    Marker: new (options: { map?: KakaoMapInstance; position: KakaoLatLng }) => unknown;
    LatLng: new (lat: number, lng: number) => KakaoLatLng;
    services: {
      Geocoder: new () => {
        addressSearch: (
          addr: string,
          cb: (result: GeocodeResult[], status: string) => void,
        ) => void;
      };
      Status: { OK: string };
    };
  };
};

/* app/components/KakaoMap.tsx 의 전역 Window.kakao 선언과 충돌하지 않도록
   declare global 대신 로컬 캐스트로 접근한다. */
const getKakao = (): KakaoSDK | undefined =>
  (window as unknown as { kakao?: KakaoSDK }).kakao;

/** SDK script 를 1회만 로드(autoload=false → maps.load 콜백에서 resolve). */
let sdkPromise: Promise<KakaoSDK> | null = null;
function loadKakaoSdk(key: string): Promise<KakaoSDK> {
  if (typeof window === "undefined") return Promise.reject(new Error("ssr"));
  const existing = getKakao();
  if (existing?.maps) return Promise.resolve(existing);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<KakaoSDK>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => getKakao()!.maps.load(() => resolve(getKakao()!));
    script.onerror = () => {
      sdkPromise = null; // 실패 시 다음 마운트에서 재시도 가능
      reject(new Error("kakao sdk load failed"));
    };
    document.head.appendChild(script);
  });
  return sdkPromise;
}

type KakaoMapProps = {
  /** 좌표 변환 기준 주소 */
  address: string;
  /** 마커 라벨 / 폴백 문구·검색어에 쓰는 장소명 */
  name: string;
  /** 확대 레벨(작을수록 확대, 기본 3) */
  level?: number;
  /** 컨테이너 스타일(크기·라운드·배경·폴백 텍스트색) */
  className?: string;
};

/** JS 키는 빌드 타임에 인라인되므로 렌더 시점에 활성 여부를 결정한다.
    이 프로젝트는 NEXT_PUBLIC_KAKAO_MAP_APP_KEY 로 JS 키를 관리한다(기존 KakaoMap.tsx 와 동일). */
const KAKAO_JS_KEY =
  process.env.NEXT_PUBLIC_KAKAO_JS_KEY ??
  process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

export function KakaoMap({ address, name, level = 3, className = "" }: KakaoMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = ref.current;
    if (!KAKAO_JS_KEY || !container) return;

    let cancelled = false;
    loadKakaoSdk(KAKAO_JS_KEY)
      .then((kakao) => {
        if (cancelled) return;
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, (result, status) => {
          if (cancelled || !ref.current) return;
          if (status !== kakao.maps.services.Status.OK || !result[0]) {
            setFailed(true);
            return;
          }
          const coords = new kakao.maps.LatLng(
            Number(result[0].y),
            Number(result[0].x),
          );
          const map = new kakao.maps.Map(ref.current, { center: coords, level });
          new kakao.maps.Marker({ map, position: coords });
          map.setCenter(coords);
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [address, name, level]);

  if (!KAKAO_JS_KEY || failed) {
    return (
      <button
        type="button"
        onClick={() => openMap("naver", `${name} ${address}`)}
        aria-label="지도에서 보기"
        className={`flex items-center justify-center gap-2 ${className}`}
      >
        <MapPin className="size-5 shrink-0" />
        <span className="text-[14px] tracking-[-0.02em]">지도 보기 · {name}</span>
      </button>
    );
  }

  return <div ref={ref} role="img" aria-label={`${name} 지도`} className={className} />;
}
