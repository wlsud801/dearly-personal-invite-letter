/* -------------------------------------------------------------------------- */
/*  Clipboard / share / map actions shared by all templates                   */
/*  (browser APIs are only touched inside the functions, so SSR import is safe) */
/* -------------------------------------------------------------------------- */

/** Copies text to the clipboard. Resolves `true` on success. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Copies the current page URL (or a given one) to the clipboard. */
export function copyLink(url?: string): Promise<boolean> {
  const link =
    url ?? (typeof window !== "undefined" ? window.location.href : "");
  return copyToClipboard(link);
}

export type MapProvider = "naver" | "tmap";

/** Opens an external map for `query` (place name and/or address). */
export function openMap(provider: MapProvider, query: string): void {
  if (typeof window === "undefined") return;
  const q = encodeURIComponent(query);
  const url =
    provider === "naver"
      ? `https://map.naver.com/v5/search/${q}`
      : `tmap://search?name=${q}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/* ----------------------------- Kakao share ------------------------------- */

type KakaoShareSDK = {
  init: (key: string) => void;
  isInitialized: () => boolean;
  Share?: { sendDefault: (settings: Record<string, unknown>) => void };
};

/** 카카오톡 공유 JS SDK (지도 SDK 의 window.kakao 와 별개인 window.Kakao) */
const KAKAO_SDK_SRC = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";

const getKakaoShare = () =>
  (window as unknown as { Kakao?: KakaoShareSDK }).Kakao;

let kakaoSdkPromise: Promise<KakaoShareSDK | null> | null = null;
function loadKakaoShareSdk(): Promise<KakaoShareSDK | null> {
  if (kakaoSdkPromise) return kakaoSdkPromise;
  const existing = getKakaoShare();
  if (existing) {
    kakaoSdkPromise = Promise.resolve(existing);
    return kakaoSdkPromise;
  }
  kakaoSdkPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = KAKAO_SDK_SRC;
    script.async = true;
    script.onload = () => resolve(getKakaoShare() ?? null);
    script.onerror = () => {
      kakaoSdkPromise = null; // 다음 시도에서 재로드
      resolve(null);
    };
    document.head.appendChild(script);
  });
  return kakaoSdkPromise;
}

/** shareKakao 가 실제로 수행한 동작 — 호출부에서 토스트 등 피드백을 결정한다. */
export type ShareResult = "kakao" | "native" | "copied" | "failed";

/**
 * 카카오톡 공유. 카카오 JS SDK(지도와 같은 JavaScript 키)로 카카오톡을 연다.
 * SDK 로드/키 부재 시 OS 공유 시트(navigator.share) → 링크 복사 순으로 폴백.
 */
export async function shareKakao(options?: {
  url?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
}): Promise<ShareResult> {
  if (typeof window === "undefined") return "failed";
  const link = options?.url ?? window.location.href;

  // 1) 카카오톡 공유 — 카카오 개발자 앱에 도메인이 등록되어 있어야 한다.
  const key = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;
  if (key) {
    const kakao = await loadKakaoShareSdk();
    if (kakao) {
      try {
        // SDK v2 는 init 이후에야 Share 모듈이 노출된다 — init 을 먼저 한다.
        if (!kakao.isInitialized()) kakao.init(key);
        kakao.Share!.sendDefault({
          objectType: "feed",
          content: {
            title: options?.title ?? document.title,
            description: options?.description ?? "",
            imageUrl: options?.imageUrl ?? "",
            link: { mobileWebUrl: link, webUrl: link },
          },
        });
        return "kakao";
      } catch {
        // 도메인 미등록/키 오류 등 — 아래 폴백으로 진행
      }
    }
  }

  // 2) OS 공유 시트 (모바일) — 목록에서 카카오톡을 고를 수 있다
  if (navigator.share) {
    try {
      await navigator.share({
        title: options?.title ?? document.title,
        url: link,
      });
      return "native";
    } catch (e) {
      // 사용자가 시트를 닫은 경우(AbortError)는 처리 완료로 본다
      if ((e as DOMException)?.name === "AbortError") return "native";
    }
  }

  // 3) 링크 복사
  return (await copyToClipboard(link)) ? "copied" : "failed";
}
