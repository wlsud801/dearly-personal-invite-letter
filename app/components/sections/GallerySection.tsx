'use client';

import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';
import GalleryModal from '../GalleryModal';

const staggerParent: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.25 },
    },
};

const fadeUpChild: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};

export default function GallerySection() {
    const [modalIndex, setModalIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = (index: number) => {
        setModalIndex(index);
        setModalOpen(true);
    };

    return (
        <section className="flex flex-col items-center px-12 py-12 gap-5 relative overflow-hidden">
            <img
                src="/images/gallery/gallery_bg.svg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            <motion.div
                className="relative flex flex-col w-full items-center"
                variants={staggerParent}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <motion.h2 variants={fadeUpChild} className="text-[#4b3a2a] text-[36px] text-center" style={{ fontFamily: "'Soluga', serif" }}>
                    Gallery
                </motion.h2>

                <div className="flex flex-col gap-[10px] items-center w-full">
                    {/* 콜라주 — Figma inline-grid 스태킹 */}
                    <div
                        className="inline-grid place-items-start"
                        style={{ gridTemplateColumns: 'max-content', gridTemplateRows: 'max-content' }}
                    >
                        {/* 봉투 (좌상단, -20deg) */}
                        <motion.div
                            variants={fadeUpChild}
                            className="col-start-1 row-start-1 flex items-center justify-center cursor-pointer"
                            style={{
                                width: '260px',
                                height: '280px',
                                marginLeft: '20px',
                            }}
                            onClick={() => openModal(0)}
                        >
                            {/* 봉투 몸체 */}
                            <div
                                className="col-start-1 row-start-1 relative"
                                style={{ width: '232px', height: '180px' }}
                            >
                                <img alt="" src={'/images/gallery/envelop.svg'} />
                            </div>
                        </motion.div>

                        {/* 폴라로이드 (우상단, +17.43deg) */}
                        <motion.div
                            variants={fadeUpChild}
                            className="col-start-1 row-start-1 inline-grid place-items-start cursor-pointer"
                            onClick={() => openModal(14)}
                            style={{
                                width: '225px',
                                height: '287px',
                                marginLeft: '174px',
                                marginTop: '38px',
                                gridTemplateColumns: 'max-content',
                                gridTemplateRows: 'max-content',
                            }}
                        >
                            {/* 사진 (뒤) */}
                            <div
                                className="col-start-1 row-start-1 flex items-center justify-center"
                                style={{ width: '192px', height: '238px', marginLeft: '15px', marginTop: '9px' }}
                            >
                                <div style={{ transform: 'rotate(17.43deg)' }}>
                                    <div
                                        className="relative overflow-hidden"
                                        style={{ width: '137px', height: '207px' }}
                                    >
                                        <Image
                                            alt=""
                                            src="/images/original/hyebin_15.jpeg"
                                            fill
                                            sizes="137px"
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* 폴라로이드 프레임 (앞) */}
                            <div
                                className="col-start-1 row-start-1 flex items-center justify-center"
                                style={{ width: '225px', height: '287px' }}
                            >
                                <div style={{ transform: 'rotate(17.43deg)' }}>
                                    <img
                                        alt=""
                                        src="/images/components/polaroid-narrow.svg"
                                        style={{ width: '157px', height: '251px' }}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* 하트 프레임 사진 (하단, -6.19deg) */}
                        <motion.div
                            variants={fadeUpChild}
                            className="col-start-1 row-start-1 flex items-center justify-center cursor-pointer"
                            style={{ width: '265px', height: '238px', marginLeft: '30px', marginTop: '231px' }}
                            onClick={() => openModal(0)}
                        >
                            <div style={{ transform: 'rotate(-6.19deg)' }}>
                                <div className="relative overflow-hidden" style={{ width: '244px', height: '213px' }}>
                                    {/* 사진 (뒤) */}
                                    <Image
                                        alt=""
                                        src="/images/original/hyebin_01.jpeg"
                                        fill
                                        sizes="244px"
                                        className="object-cover"
                                        style={{
                                            top: '20px',
                                            left: 0,
                                            right: 0,
                                            bottom: 'auto',
                                            height: '85%',
                                            objectPosition: 'center 30%',
                                            rotate: '-6deg',
                                            maskImage: "url('/images/gallery/heart_mask.svg')",
                                            maskSize: '100% 100%',
                                            WebkitMaskImage: "url('/images/gallery/heart_mask.svg')",
                                            WebkitMaskSize: '100% 100%',
                                        }}
                                    />
                                    {/* 하트 프레임 (앞) */}
                                    <img
                                        alt=""
                                        className="absolute block inset-0 max-w-none size-full"
                                        src="/images/gallery/heart_frame.svg"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* 영문 캡션 */}
                        <motion.div
                            variants={fadeUpChild}
                            className="col-start-1 row-start-1 flex items-center justify-center"
                            style={{ width: '183px', height: '75px', marginLeft: '194px', marginTop: '374px' }}
                        >
                            <img
                                src="/images/gallery/gallery_text.svg"
                                alt="Come and share in the moments that make our hearts whole"
                                style={{ transform: 'rotate(-7.5deg)', width: '183px' }}
                            />
                        </motion.div>
                    </div>

                    {/* 힌트 버튼 */}
                    <motion.button
                        variants={fadeUpChild}
                        onClick={() => setModalOpen(true)}
                        className="bg-[rgba(255,255,255,0.4)] border border-white rounded-[10px] px-6 py-3 w-full text-center cursor-pointer"
                    >
                        <p
                            className="text-[#a39c8f] text-[14px] tracking-[-0.56px]"
                            style={{ fontFamily: "'Pretendard', sans-serif" }}
                        >
                            사진을 클릭해 보세요!
                        </p>
                    </motion.button>
                </div>
            </motion.div>

            {modalOpen && <GalleryModal initialIndex={modalIndex} onClose={() => setModalOpen(false)} />}
        </section>
    );
}
