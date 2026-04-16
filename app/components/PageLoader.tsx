'use client';

import { useEffect, useState } from 'react';

/** 닫힌 봉투에 필요한 이미지 — 로딩 화면 해제 조건 */
const CRITICAL_IMAGES = [
  '/images/intro/intro-bg.svg',
  '/images/intro/envelop-body.svg',
  '/images/intro/envelop-closed-flap.svg',
  '/images/intro/sticker.svg',
  '/images/intro/ampersand.svg',
  '/images/components/dot-line.svg',
];

/** 봉투 열림 후 콜라주 이미지 — 로딩 화면과 무관하게 백그라운드 프리로드 */
const COLLAGE_IMAGES = [
  '/images/intro/envelop-back.svg',
  '/images/intro/envelop-front.svg',
  '/images/intro/intro-flower-01.svg',
  '/images/intro/intro-flower-02.svg',
  '/images/intro/intro-tag-outer.svg',
  '/images/intro/intro-tag-inner.svg',
  '/images/intro/intro-art-img.svg',
  '/images/components/polaroid-wide.svg',
  '/images/components/polaroid-narrow.svg',
  '/images/original/hyebin_12.jpeg',
  '/images/original/hyebin_11.jpeg',
];

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // 실패해도 진행
    img.src = src;
  });
}

export default function PageLoader({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 1단계: 닫힌 봉투 이미지 로드 → 화면 표시
    Promise.all(CRITICAL_IMAGES.map(preloadImage)).then(() => {
      setReady(true);
      // 2단계: 콜라주 이미지 백그라운드 프리로드 (봉투 탭 전에 미리 캐시)
      COLLAGE_IMAGES.forEach(preloadImage);
    });
  }, []);

  return (
    <>
      {/* 로딩 오버레이 */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#f8f5f0] transition-opacity duration-500"
        style={{
          opacity: ready ? 0 : 1,
          pointerEvents: ready ? 'none' : 'auto',
        }}
      >
        <p
          className="text-[#4b3a2a] text-[24px] animate-pulse"
          style={{ fontFamily: "'Soluga', serif" }}
        >
          JaeHwan &amp; HyeBin
        </p>
      </div>

      {/* 콘텐츠는 항상 마운트되어 있되, ready 전엔 보이지 않음 */}
      <div
        style={{
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
        }}
      >
        {children}
      </div>
    </>
  );
}
