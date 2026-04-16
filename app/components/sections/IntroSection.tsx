"use client";

import {
  WEDDING_DAY,
  WEDDING_EN_DOW,
  WEDDING_EN_MONTH,
  WEDDING_KO_DOW,
  WEDDING_MONTH,
  WEDDING_MONTH_PADDED,
  WEDDING_TIME_EN,
  WEDDING_TIME_KO,
  WEDDING_YEAR,
} from "@/app/constants/wedding";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const collageContainer: Variants = {
  hidden: {},
  visible: {},
};

const fromTop: Variants = {
  hidden: { opacity: 0, y: -22 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay },
  }),
};

const fromBottom: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay },
  }),
};

const fromBottomSmall: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay },
  }),
};

export default function IntroSection() {
  const [opened, setOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [contentScale, setContentScale] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleOpen = () => {
    if (opened || isOpening) return;
    setIsOpening(true);
    setTimeout(() => setOpened(true), 280);
  };

  // 봉투 닫힌 동안 스크롤 잠금
  useEffect(() => {
    if (!opened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  // 봉투 너비(370px) 기준으로 스케일 계산 — 컨테이너 너비에 비례해 항상 동일 비율 유지
  useEffect(() => {
    const ENVELOPE_W = 370;

    const calc = () => {
      const containerW = sectionRef.current?.clientWidth ?? window.innerWidth;
      setContentScale((containerW - 24) / ENVELOPE_W);
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex flex-col items-center relative w-full overflow-hidden"
      style={{
        height: opened ? "max(100dvh, 786px)" : "100dvh",
        transition: "height 0.5s ease-in-out",
      }}
    >
      <audio
        ref={audioRef}
        src="/bgm/NewZhilla_Be-My-Valentine_short-01_75sec.wav"
        loop
        preload="auto"
      />
      {/* 음악 토글 버튼 */}
      <button
        onClick={toggleMusic}
        className="fixed top-4 left-4 z-50 w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm shadow flex items-center justify-center"
        aria-label={isPlaying ? "음악 끄기" : "음악 켜기"}
      >
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4b3a2a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#99958f"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
            <line
              x1="2"
              y1="2"
              x2="22"
              y2="22"
              stroke="#99958f"
              strokeWidth="2"
            />
          </svg>
        )}
      </button>
      {/* 줄무늬 배경 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          alt=""
          className="absolute w-full"
          src={"/images/intro/intro-bg.svg"}
        />
      </div>

      <div className="relative flex flex-col items-start w-full h-full">
        {/* ── HEADER: 이름 + 날짜 ── */}
        <div
          className="shrink-0 flex flex-col items-start w-full"
          style={{
            paddingTop: opened ? "24px" : "32px",
            transition: "padding 1.2s ease-in-out",
          }}
        >
          <div className="flex flex-col items-center w-full">
            <div className="flex items-center justify-center pb-[2px] px-[10px] w-full">
              <p
                className="text-[#4b3a2a] leading-[1] text-center"
                style={{
                  fontFamily: "'Soluga', serif",
                  fontSize: opened
                    ? "clamp(28px, 9.5vw, 42px)"
                    : "clamp(36px, 13vw, 60px)",
                  transition: "font-size 1.2s ease-in-out",
                }}
              >
                JaeHwan
              </p>
            </div>
            <div className="flex gap-[10px] items-start">
              <div className="flex items-center justify-center pb-[4px] pl-[10px]">
                <p
                  className="text-[#4b3a2a] text-center"
                  style={{
                    fontFamily: "'Soluga', serif",
                    fontSize: opened
                      ? "clamp(28px, 9.5vw, 42px)"
                      : "clamp(36px, 13vw, 60px)",
                    transition: "font-size 1.2s ease-in-out",
                  }}
                >
                  HyeBin
                </p>
              </div>
              <div
                className="relative shrink-0"
                style={{
                  width: opened ? "30px" : "39px",
                  height: opened ? "32px" : "42px",
                  marginTop: opened ? "14px" : "20px",
                  transition:
                    "width 1.2s ease-in-out, height 1.2s ease-in-out, margin-top 1.2s ease-in-out",
                }}
              >
                <img
                  alt=""
                  className="absolute block inset-0 max-w-none size-full"
                  src={"/images/intro/ampersand.svg"}
                />
              </div>
            </div>
          </div>

          {/* 점 구분선 */}
          <div
            className="flex items-center justify-center px-[10px] w-full"
            style={{
              paddingTop: opened ? "2px" : "0px",
              paddingBottom: opened ? "2px" : "0px",
              transition: "padding 1.2s ease-in-out",
            }}
          >
            <div className="">
              <img
                alt=""
                className="block max-w-none size-full"
                src={"/images/components/dot-line.svg"}
              />
            </div>
          </div>

          {/* 05 . 31 . 2026 */}
          <div className="flex items-center justify-center w-full">
            <div className="flex gap-[clamp(4px,2vw,10px)] items-center justify-center text-[#4b3a2a]">
              <p
                style={{
                  fontFamily: "'Soluga', serif",
                  fontSize: opened
                    ? "clamp(18px, 6vw, 26px)"
                    : "clamp(22px, 7.5vw, 35px)",
                  letterSpacing: "0.1em",
                  transition: "font-size 1.2s ease-in-out",
                }}
              >
                {WEDDING_MONTH_PADDED}
              </p>
              <p
                style={{
                  fontFamily: "'Rusilla Serif', serif",
                  fontSize: opened
                    ? "clamp(22px, 7vw, 30px)"
                    : "clamp(28px, 9.5vw, 46px)",
                  letterSpacing: "0.1em",
                  transition: "font-size 1.2s ease-in-out",
                }}
              >
                .
              </p>
              <p
                style={{
                  fontFamily: "'Soluga', serif",
                  fontSize: opened
                    ? "clamp(18px, 6vw, 26px)"
                    : "clamp(22px, 7.5vw, 35px)",
                  letterSpacing: "0.1em",
                  transition: "font-size 1.2s ease-in-out",
                }}
              >
                {String(WEDDING_DAY).padStart(2, "0")}
              </p>
              <p
                style={{
                  fontFamily: "'Rusilla Serif', serif",
                  fontSize: opened
                    ? "clamp(22px, 7vw, 30px)"
                    : "clamp(28px, 9.5vw, 46px)",
                  letterSpacing: "0.1em",
                  transition: "font-size 1.2s ease-in-out",
                }}
              >
                .
              </p>
              <p
                style={{
                  fontFamily: "'Soluga', serif",
                  fontSize: opened
                    ? "clamp(18px, 6vw, 26px)"
                    : "clamp(22px, 7.5vw, 35px)",
                  letterSpacing: "0.1em",
                  transition: "font-size 1.2s ease-in-out",
                }}
              >
                {WEDDING_YEAR}
              </p>
            </div>
          </div>
        </div>

        {/* ── MIDDLE: 봉투 / 콜라주 ── */}
        <div className="flex-1 min-h-0 w-full flex flex-col items-start">
          <div
            className="relative"
            style={{
              width: `${100 / contentScale}%`,
              transform: `scale(${contentScale})`,
              transformOrigin: "top left",
            }}
          >
            {/* ── 닫힌 봉투 (아래에서 위로 등장) ── */}
            <AnimatePresence>
              {!opened && (
                <motion.div
                  key="closed-envelope"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: isOpening ? 0 : 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: isOpening ? 0.25 : 0.75,
                    ease: "easeOut",
                    delay: isOpening ? 0 : 0.1,
                  }}
                  className={`flex flex-col items-center pl-10 pr-[43px] pt-10 w-full ${
                    !isOpening ? "cursor-pointer" : "pointer-events-none"
                  }`}
                  onClick={handleOpen}
                >
                  <div
                    className="inline-grid place-items-start relative"
                    style={{
                      gridTemplateColumns: "max-content",
                      gridTemplateRows: "max-content",
                    }}
                  >
                    {/* 봉투 몸체 */}
                    <div className="col-start-1 row-start-1 h-[267px] w-[370px] relative">
                      <img
                        alt=""
                        className="absolute block inset-0 max-w-none size-full"
                        src={"/images/intro/envelop-body.svg"}
                      />
                    </div>

                    {/* 봉투 앞면 + JH 스티커 — 함께 회전 */}
                    <motion.div
                      className="col-start-1 row-start-1 relative"
                      style={{
                        width: 370,
                        height: 267,
                        transformPerspective: 900,
                        transformOrigin: "top center",
                        backfaceVisibility: "hidden",
                      }}
                      animate={{ rotateX: isOpening ? -178 : 0 }}
                      transition={{ duration: 0.65, ease: [0.4, 0, 0.8, 0.6] }}
                    >
                      <img
                        alt=""
                        className="absolute block max-w-none"
                        style={{ width: 369, height: 260, top: 0, left: 0 }}
                        src={"/images/intro/envelop-closed-flap.svg"}
                      />
                      <div
                        className="absolute h-[69px] w-[56px] overflow-hidden"
                        style={{ left: 157, top: 187 }}
                      >
                        <img
                          alt=""
                          className="absolute h-[91.1%] left-[0.01%] max-w-none top-[4.45%] w-[99.99%]"
                          src={"/images/intro/sticker.svg"}
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* 탭 안내 */}
                  {!isOpening && (
                    <p
                      className="text-[#99958f] text-[12px] mt-4 tracking-widest animate-pulse"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      탭하여 열기
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── 열린 콜라주 (위에서 아래로 스태거 등장) ── */}
            <AnimatePresence>
              {opened && (
                <motion.div
                  key="open-collage"
                  className="flex items-center justify-center pr-[43px] w-full"
                  variants={collageContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <div
                    className="inline-grid place-items-start"
                    style={{
                      gridTemplateColumns: "max-content",
                      gridTemplateRows: "max-content",
                    }}
                  >
                    {/* 봉투 뒤판 + 꽃 */}
                    <motion.div
                      variants={fromBottom}
                      custom={0.1}
                      className="col-start-1 row-start-1 inline-grid place-items-start"
                      style={{
                        marginLeft: "42.3px",
                        marginTop: "43.7px",
                        gridTemplateColumns: "max-content",
                        gridTemplateRows: "max-content",
                      }}
                    >
                      <div className="col-start-1 row-start-1 h-[433px] w-[370px] relative">
                        <div className="absolute">
                          <img
                            alt=""
                            className="block max-w-none size-full"
                            src={"/images/intro/envelop-back.svg"}
                          />
                        </div>
                      </div>
                      <motion.div
                        variants={fromTop}
                        custom={0.35}
                        className="col-start-1 row-start-1 inline-grid place-items-start"
                        style={{
                          marginLeft: "130px",
                          marginTop: "-60.61px",
                          gridTemplateColumns: "max-content",
                          gridTemplateRows: "max-content",
                        }}
                      >
                        <div className="col-start-1 row-start-1 h-[300px] w-[200px] relative">
                          <img
                            alt=""
                            className="absolute block inset-0 max-w-none size-full"
                            src={"/images/intro/intro-flower-01.svg"}
                          />
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* 신부 폴라로이드 */}
                    {/* <motion.div
                                            variants={fromTop}
                                            custom={0.4}
                                            className="col-start-1 row-start-1 flex h-[279px] items-center justify-center"
                                            style={{ marginLeft: '162.83px', width: '225.7px' }}
                                        >
                                            <div style={{ transform: 'rotate(-14.75deg)' }}>
                                                <div className="h-[244px] relative w-[169px]">
                                                    <img
                                                        alt=""
                                                        className="absolute block inset-0 max-w-none size-full"
                                                        src={imgIntroBrideCard}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div> */}

                    {/* 신랑 마스크 */}
                    {/* <motion.div
                      variants={fromTop}
                      custom={0.48}
                      className="col-start-1 row-start-1 inline-grid place-items-start h-[109px] w-[105px]"
                      style={{ marginLeft: "241.13px", marginTop: "116.8px", gridTemplateColumns: "max-content", gridTemplateRows: "max-content" }}
                    >
                      <div className="col-start-1 row-start-1 flex h-[245px] items-center justify-center" style={{ marginLeft: "-45.56px", marginTop: "-9.19px", width: "246.55px" }}>
                        <div style={{ transform: "rotate(-45.86deg)" }}>
                          <div className="h-[205px] relative w-[143px]" style={{ maskImage: `url('${imgIntroGroomMask}')`, maskRepeat: "no-repeat", maskPosition: "56.098px 5.493px", maskSize: "105px 109px" }}>
                            <img alt="" className="absolute block inset-0 max-w-none size-full" src={'/images/components/polaroid-narrow.svg'} />
                          </div>
                        </div>
                      </div>
                    </motion.div> */}

                    {/* 신부 사진 폴라로이드 */}
                    <motion.div
                      variants={fromTop}
                      custom={0.56}
                      className="col-start-1 row-start-1 inline-grid place-items-start h-[234px] w-[202px]"
                      style={{
                        marginLeft: "33.56px",
                        marginTop: "50.67px",
                        gridTemplateColumns: "max-content",
                        gridTemplateRows: "max-content",
                      }}
                    >
                      <div
                        className="col-start-1 row-start-1 flex h-[173px] items-center justify-center"
                        style={{
                          marginLeft: "13.14px",
                          marginTop: "13.89px",
                          width: "168px",
                        }}
                      >
                        <div style={{ transform: "rotate(-8.9deg)" }}>
                          <div className="h-[152px] relative w-[146px] overflow-hidden">
                            <img
                              alt=""
                              className="absolute w-full left-[-1%] max-w-none top-0 object-cover"
                              src={"/images/original/hyebin_12.jpeg"}
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-start-1 row-start-1 flex h-[234px] items-center justify-center"
                        style={{ width: "202px" }}
                      >
                        <div style={{ transform: "rotate(-8.9deg)" }}>
                          <div className="h-[210px] relative w-[172px]">
                            <img
                              alt=""
                              className="absolute inset-0 max-w-none object-cover size-full shadow-2xl"
                              src={"/images/components/polaroid-wide.svg"}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* 꽃 장식 */}
                    <motion.div
                      variants={fromTop}
                      custom={0.64}
                      className="col-start-1 row-start-1 flex h-[151px] items-center justify-center"
                      style={{ marginTop: "145.42px", width: "163.75px" }}
                    >
                      <div className="h-[170px] relative w-[163px] rotate-[-10deg] translate-x-[30px]">
                        <img
                          alt=""
                          className="absolute block w-fullh-[142px] object-cover "
                          src={"/images/intro/intro-flower-02.svg"}
                        />
                      </div>
                    </motion.div>

                    {/* 신랑 사진 폴라로이드 */}
                    <motion.div
                      variants={fromTop}
                      custom={0.72}
                      className="col-start-1 row-start-1 inline-grid place-items-start h-[226px] w-[164px]"
                      style={{
                        marginLeft: "95.52px",
                        marginTop: "178.72px",
                        gridTemplateColumns: "max-content",
                        gridTemplateRows: "max-content",
                      }}
                    >
                      <div
                        className="col-start-1 row-start-1 flex h-[187px] items-center justify-center"
                        style={{
                          marginLeft: "9.59px",
                          marginTop: "7.12px",
                          width: "141px",
                        }}
                      >
                        <div style={{ transform: "rotate(10.45deg)" }}>
                          <div className="h-[170px] relative w-[112px] overflow-hidden">
                            <img
                              alt=""
                              className="absolute w-full left-[-1%] scale-[2.5] translate-x-[20px] translate-y-[30px] max-w-none top-0 object-cover"
                              src={"/images/original/hyebin_11.jpeg"}
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-start-1 row-start-1 flex h-[226px] items-center justify-center"
                        style={{ width: "164px" }}
                      >
                        <div style={{ transform: "rotate(10.45deg)" }}>
                          <div className="h-[206px] relative w-[129px]">
                            <img
                              alt=""
                              className="absolute inset-0 max-w-none object-cover size-full"
                              src={"/images/components/polaroid-narrow.svg"}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Save the Date 태그 */}
                    <motion.div
                      variants={fromTop}
                      custom={0.8}
                      className="col-start-1 row-start-1 inline-grid place-items-start h-[136px] w-[198px]"
                      style={{
                        marginLeft: "211.55px",
                        marginTop: "137.91px",
                        gridTemplateColumns: "max-content",
                        gridTemplateRows: "max-content",
                      }}
                    >
                      <div
                        className="col-start-1 row-start-1 flex h-[125px] items-center justify-center"
                        style={{ marginTop: "6.21px", width: "195.55px" }}
                      >
                        <div style={{ transform: "rotate(11deg)" }}>
                          <div className="h-[140px] relative w-[191px]">
                            <img
                              alt=""
                              className="absolute block inset-0 max-w-none size-full"
                              src={"/images/intro/intro-tag-outer.svg"}
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-start-1 row-start-1 flex h-[107px] items-center justify-center"
                        style={{
                          marginLeft: "8.74px",
                          marginTop: "16px",
                          width: "179px",
                        }}
                      >
                        <div style={{ transform: "rotate(11deg)" }}>
                          <div className="h-[120px] relative w-[178px]">
                            <img
                              alt=""
                              className="absolute block inset-0 max-w-none size-full"
                              src={"/images/intro/intro-tag-inner.svg"}
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-start-1 row-start-1 inline-grid place-items-start"
                        style={{
                          marginLeft: "14.21px",
                          marginTop: "27px",
                          gridTemplateColumns: "max-content",
                          gridTemplateRows: "max-content",
                        }}
                      >
                        <div
                          className="col-start-1 row-start-1 inline-grid place-items-start h-[77px] w-[111px]"
                          style={{
                            marginLeft: "15.67px",
                            gridTemplateColumns: "max-content",
                            gridTemplateRows: "max-content",
                          }}
                        >
                          <div
                            className="col-start-1 row-start-1 flex h-[37px] items-center justify-center"
                            style={{
                              marginTop: "41.09px",
                              marginLeft: "10px",
                              width: "103.56px",
                            }}
                          >
                            <div style={{ transform: "rotate(20deg)" }}>
                              <p
                                className="text-[#45452e] text-[25.775px] whitespace-nowrap"
                                style={{ fontFamily: "'Rusilla Serif', serif" }}
                              >
                                {WEDDING_MONTH} . {WEDDING_DAY} . {WEDDING_YEAR}
                              </p>
                            </div>
                          </div>
                          <div
                            className="col-start-1 row-start-1 flex h-[43px] items-center justify-center"
                            style={{
                              marginLeft: "40.5px",
                              marginTop: "8px",
                              width: "65.98px",
                            }}
                          >
                            <div style={{ transform: "rotate(20deg)" }}>
                              <div
                                className="text-[#45452e] text-center"
                                style={{ fontFamily: "'Rusilla Serif', serif" }}
                              >
                                <p className="text-[24.687px] leading-[0.8]">
                                  Save
                                </p>
                                <p className="text-[18.301px] leading-[0.8]">
                                  the date
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="col-start-1 row-start-1 flex h-[27px] items-center justify-center"
                          style={{ marginTop: "35px", width: "140.86px" }}
                        >
                          <div style={{ transform: "rotate(20deg)" }}>
                            <div className="h-0 relative w-[143.5px]">
                              <div className="absolute border-[0.5px] border-[#45452e]"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* 새 인장 */}
                    <motion.div
                      variants={fromTop}
                      custom={0.88}
                      className="col-start-1 row-start-1 h-[118px] w-[116px] relative"
                      style={{ marginLeft: "221.26px", marginTop: "224px" }}
                    >
                      <img
                        alt=""
                        className="absolute block inset-0 max-w-none size-full"
                        src={"/images/intro/intro-art-img.svg"}
                      />
                    </motion.div>

                    {/* 봉투 앞판 */}
                    <motion.div
                      variants={fromBottomSmall}
                      custom={0.2}
                      className="col-start-1 row-start-1 inline-grid place-items-start"
                      style={{
                        marginLeft: "42.3px",
                        marginTop: "233.7px",
                        gridTemplateColumns: "max-content",
                        gridTemplateRows: "max-content",
                      }}
                    >
                      <div
                        className="col-start-1 row-start-1 inline-grid place-items-start"
                        style={{
                          gridTemplateColumns: "max-content",
                          gridTemplateRows: "max-content",
                        }}
                      >
                        <div className="col-start-1 row-start-1 h-[243px] w-[370px] relative">
                          <img
                            alt=""
                            className="absolute block inset-0 max-w-none size-full"
                            src={"/images/intro/envelop-front.svg"}
                          />
                        </div>
                        {/* <div
                                                    className="col-start-1 row-start-1 h-[147px] w-[369px] relative"
                                                    style={{ marginLeft: '0.52px', marginTop: '75px' }}
                                                >
                                                    <img
                                                        alt=""
                                                        className="absolute block inset-0 max-w-none size-full"
                                                        src={imgIntroFlapDetail}
                                                    />
                                                </div> */}
                        {/* <div
                                                    className="col-start-1 row-start-1 h-[69px] w-[56px] relative"
                                                    style={{ marginLeft: '156.7px', marginTop: '161.3px' }}
                                                >
                                                    <div className="absolute inset-0">
                                                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                                            <img
                                                                alt=""
                                                                className="absolute h-[91.1%] left-[0.01%] max-w-none top-[4.45%] w-[99.99%]"
                                                                src={'/images/intro/sticker.svg'}
                                                            />
                                                        </div>
                                                    </div>
                                                    <p
                                                        className="absolute text-transparent text-[34.25px]"
                                                        style={{
                                                            fontFamily: "'Rusilla Serif', serif",
                                                            top: '14.46%',
                                                            left: '37.46%',
                                                            backgroundImage:
                                                                'linear-gradient(118.33deg, rgba(243,243,243,0.2) 22.97%, rgba(189,189,189,0.2) 93.1%)',
                                                            WebkitBackgroundClip: 'text',
                                                            backgroundClip: 'text',
                                                        }}
                                                    >
                                                        J
                                                    </p>
                                                    <p
                                                        className="absolute text-transparent text-[34.55px]"
                                                        style={{
                                                            fontFamily: "'Rusilla Serif', serif",
                                                            top: '27.86%',
                                                            left: '45.52%',
                                                            backgroundImage:
                                                                'linear-gradient(143.43deg, rgba(243,243,243,0.2) 22.97%, rgba(189,189,189,0.2) 93.1%)',
                                                            WebkitBackgroundClip: 'text',
                                                            backgroundClip: 'text',
                                                        }}
                                                    >
                                                        H
                                                    </p>
                                                </div> */}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* end MIDDLE */}

        {/* ── FOOTER: 위치 + 영문 날짜 ── */}
        <div className="relative z-10 shrink-0 flex flex-col items-center w-full pb-6">
          <div className="flex items-center justify-center px-2 py-[10px] w-full">
            <div
              className="text-black text-center tracking-[-0.03em] leading-[1.6]"
              style={{
                fontFamily: "'Pretendard', sans-serif",
                fontSize: "clamp(13px, 3.8vw, 16px)",
              }}
            >
              <p>
                {WEDDING_YEAR}년 {WEDDING_MONTH}월 {WEDDING_DAY}일,{" "}
                {WEDDING_KO_DOW}요일 {WEDDING_TIME_KO}
              </p>
              <p>라루체 명동 5F 그레이스홀</p>
            </div>
          </div>
          <div className="flex items-center justify-center p-[6px] w-full">
            <p
              className="text-[#99958f] text-center"
              style={{
                fontFamily: "'Badoney', cursive",
                fontSize: "clamp(11px, 3.5vw, 14px)",
              }}
            >
              {WEDDING_DAY} {WEDDING_EN_MONTH} {WEDDING_YEAR}, {WEDDING_EN_DOW}{" "}
              {WEDDING_TIME_EN}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
