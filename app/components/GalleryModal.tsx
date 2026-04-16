'use client';

import { useState, useCallback, useEffect } from 'react';
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
                className="flex flex-col items-center w-full max-w-[430px] h-[100dvh] overflow-hidden"
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
                <div className="relative flex-1 w-full overflow-hidden">
                    <Image
                        src={PHOTOS[current]}
                        alt={`웨딩 사진 ${current + 1}`}
                        fill
                        sizes="430px"
                        className="object-contain"
                    />
                </div>

                {/* 인접 사진 프리로드 */}
                <link rel="preload" as="image" href={PHOTOS[(current + 1) % PHOTOS.length]} />
                <link rel="preload" as="image" href={PHOTOS[(current - 1 + PHOTOS.length) % PHOTOS.length]} />

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
