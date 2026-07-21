'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import Modal from './Modal';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react';

const PHOTOS = Array.from({ length: 21 }, (_, i) => {
    const n = String(i + 1).padStart(2, '0');
    return `/images/original/hyebin_${n}.jpeg`;
});

type Props = {
    onClose: () => void;
    initialIndex?: number;
};

export default function GalleryModal({ onClose, initialIndex = 0 }: Props) {
    const [current, setCurrent] = useState(initialIndex);

    const prev = useCallback(() => {
        setCurrent((c) => (c - 1 + PHOTOS.length) % PHOTOS.length);
    }, []);

    const next = useCallback(() => {
        setCurrent((c) => (c + 1) % PHOTOS.length);
    }, []);

    // 스와이프(터치 드래그) 내비게이션
    // offset: 트랙을 -100%(현재 사진 중앙) 기준으로 얼마나 px 이동했는지
    //   드래그 중  -> 손가락 이동량
    //   릴리스 후  -> ±컨테이너 너비(이웃 사진으로 애니메이션), 완료 후 인덱스 커밋
    const [offset, setOffset] = useState(0);
    const [animating, setAnimating] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const swiping = useRef(false);
    const pending = useRef<0 | 1 | -1>(0); // 릴리스 후 커밋할 방향
    const SWIPE_THRESHOLD = 50;

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        if (animating) return;
        const t = e.touches[0];
        touchStartX.current = t.clientX;
        touchStartY.current = t.clientY;
        swiping.current = false;
    }, [animating]);

    const onTouchMove = useCallback((e: React.TouchEvent) => {
        if (animating) return;
        const t = e.touches[0];
        const dx = t.clientX - touchStartX.current;
        const dy = t.clientY - touchStartY.current;
        // 세로 스크롤보다 가로 이동이 우세할 때만 스와이프로 처리
        if (!swiping.current && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
            swiping.current = true;
        }
        if (swiping.current) {
            // 한 번에 최대 한 장까지만 끌리도록 이동량을 제한
            const width = trackRef.current?.clientWidth ?? 0;
            const clamped = width > 0 ? Math.max(-width, Math.min(width, dx)) : dx;
            setOffset(clamped);
        }
    }, [animating]);

    const onTouchEnd = useCallback(() => {
        if (!swiping.current) return;
        swiping.current = false;
        const width = trackRef.current?.clientWidth ?? 0;
        if (offset <= -SWIPE_THRESHOLD) {
            pending.current = 1;
            setAnimating(true);
            setOffset(-width);
        } else if (offset >= SWIPE_THRESHOLD) {
            pending.current = -1;
            setAnimating(true);
            setOffset(width);
        } else {
            // 임계값 미달 -> 원위치 복귀
            setAnimating(true);
            setOffset(0);
        }
    }, [offset]);

    // 슬라이드 애니메이션 종료 후 인덱스 커밋 & 트랙 원위치
    const onTransitionEnd = useCallback((e: React.TransitionEvent) => {
        // 트랙 자신의 transform 전환에만 반응 (자식 이벤트 버블링 무시)
        if (e.target !== e.currentTarget || e.propertyName !== 'transform') return;
        if (!animating) return;
        if (pending.current === 1) setCurrent((c) => (c + 1) % PHOTOS.length);
        else if (pending.current === -1) setCurrent((c) => (c - 1 + PHOTOS.length) % PHOTOS.length);
        pending.current = 0;
        setAnimating(false);
        setOffset(0);
    }, [animating]);

    // 좌우 화살표 키 내비게이션
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [prev, next]);

    return (
        <Modal onClose={onClose}>
            <div
                className="flex flex-col items-center w-[100vw] max-w-[430px] h-[100dvh] overflow-hidden"
                style={{ backgroundColor: '#f8f5f0' }}
            >
                {/* 제목 */}
                <div className="relative flex items-center justify-center py-[10px] w-full">
                    <h2
                        className="text-[36px] leading-[1.5] text-[#4b3a2a] text-center"
                        style={{ fontFamily: "'Soluga', serif" }}
                    >
                        Gallery
                    </h2>
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9"
                        aria-label="닫기"
                    >
                        <XIcon className="w-6 h-6 text-[#A39C8F]" />
                    </button>
                </div>

                {/* 사진 */}
                <div
                    className="relative flex-1 w-full overflow-hidden touch-pan-y"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div
                        ref={trackRef}
                        className="absolute inset-0 flex"
                        style={{
                            transform: `translate3d(calc(-100% + ${offset}px), 0, 0)`,
                            transition: animating ? 'transform 0.3s ease-out' : 'none',
                        }}
                        onTransitionEnd={onTransitionEnd}
                    >
                        {[
                            (current - 1 + PHOTOS.length) % PHOTOS.length,
                            current,
                            (current + 1) % PHOTOS.length,
                        ].map((idx, i) => (
                            <div key={i} className="relative shrink-0 w-full h-full">
                                <Image
                                    src={PHOTOS[idx]}
                                    alt={`웨딩 사진 ${idx + 1}`}
                                    fill
                                    sizes="430px"
                                    quality={90}
                                    priority={i === 1}
                                    className="object-contain select-none pointer-events-none"
                                    draggable={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 내비게이션 */}
                <div
                    className="shrink-0 flex items-center justify-center w-full"
                    style={{ gap: '81px', paddingTop: '20px', paddingBottom: '24px' }}
                >
                    <button
                        onClick={prev}
                        className="flex items-center justify-center"
                        style={{ width: '51px', height: '51px' }}
                        aria-label="이전 사진"
                    >
                        <ChevronLeftIcon className="w-6 h-6 text-[#A39C8F]" />
                    </button>

                    <span
                        className="flex items-center gap-[10px] text-black"
                        style={{ fontFamily: "'Rusilla Serif', serif", fontSize: '20px' }}
                    >
                        <span>{current + 1}</span>
                        <span>/</span>
                        <span>{PHOTOS.length}</span>
                    </span>

                    <button
                        onClick={next}
                        className="flex items-center justify-center"
                        style={{ width: '51px', height: '51px' }}
                        aria-label="다음 사진"
                    >
                        <ChevronRightIcon className="w-6 h-6 text-[#A39C8F]" />
                    </button>
                </div>
            </div>
        </Modal>
    );
}
