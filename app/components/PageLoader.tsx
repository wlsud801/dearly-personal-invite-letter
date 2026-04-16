'use client';

import { useEffect, useState } from 'react';

/** 초기 렌더 시 보여줄 핵심 이미지들을 미리 로드한 뒤 콘텐츠를 노출 */
const CRITICAL_IMAGES = [
  '/images/intro/intro-bg.svg',
  '/images/intro/envelop-body.svg',
  '/images/intro/envelop-closed-flap.svg',
  '/images/intro/sticker.svg',
  '/images/intro/ampersand.svg',
  '/images/components/dot-line.svg',
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
    Promise.all(CRITICAL_IMAGES.map(preloadImage)).then(() => setReady(true));
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
