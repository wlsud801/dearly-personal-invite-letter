'use client';

import { useEffect, ReactNode } from 'react';

type Props = {
    onClose: () => void;
    children: ReactNode;
    /** 배경 클릭 시 닫기 여부 (기본값: true) */
    closeOnBackdrop?: boolean;
};

export default function Modal({ onClose, children, closeOnBackdrop = true }: Props) {
    // ESC 키로 닫기
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    // 스크롤 잠금
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    return (
        <div
            className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            onClick={closeOnBackdrop ? onClose : undefined}
        >
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}
