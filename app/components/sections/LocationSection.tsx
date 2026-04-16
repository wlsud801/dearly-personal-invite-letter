"use client";

import { motion, type Variants } from "framer-motion";
import CallButton from "../CallButton";
import CopyButton from "../CopyButton";
import KakaoMap from "../KakaoMap";
import { useToast } from "../Toast";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay },
  }),
};

const VENUE_QUERY = encodeURIComponent("라루체 웨딩");

const TRANSPORTS = [
  {
    type: "자차",
    main: "네이게이션 : '라루체 웨딩' 검색",
    sub: "서울 중구 퇴계로18길 46",
  },
  {
    type: "지하철",
    main: "4호선 명동역 3번출구",
    sub: "퍼시픽 호텔 우측길로 60M",
  },
  {
    type: "버스",
    main: "퇴계로2가.명동역",
    sub: "104, 105, 421, 463, 507, 604, N16, 7011",
    extra: { main: "명동입구", sub: "104, 421, 463, 507, 604, N16, 7011, 05" },
  },
];

export default function LocationSection() {
  const [toast, toastNode] = useToast();

  const openNaver = () => {
    const webUrl = `https://map.naver.com/v5/search/${VENUE_QUERY}`;
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isIOS) {
      window.location.href = `nmap://search?query=${VENUE_QUERY}&appname=dearly`;
      setTimeout(() => window.open(webUrl, "_blank"), 1500);
    } else if (isAndroid) {
      window.location.href = `intent://search?query=${VENUE_QUERY}#Intent;scheme=nmap;package=com.nhn.android.nmap;end`;
      setTimeout(() => window.open(webUrl, "_blank"), 1500);
    } else {
      window.open(webUrl, "_blank");
    }
  };

  const openTmap = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (!isMobile) {
      toast.show("T맵 앱이 없거나 사용할 수 없는 환경입니다");
      return;
    }

    // 앱 실행 시 페이지가 blur됨 — blur 없이 타임아웃이 지나면 미설치로 판단
    let appOpened = false;
    const onBlur = () => {
      appOpened = true;
    };
    window.addEventListener("blur", onBlur, { once: true });

    setTimeout(() => {
      window.removeEventListener("blur", onBlur);
      if (!appOpened) toast.show("T맵 앱이 없거나 사용할 수 없는 환경입니다");
    }, 1500);

    window.location.href = `tmap://search?name=${VENUE_QUERY}`;
  };

  return (
    <>
      <section className="bg-[#f8f5f0] flex flex-col items-center px-12 py-12 gap-10">
        {/* 제목 + 주소 */}
        <motion.div
          className="flex flex-col gap-5 items-center w-full"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={0}
        >
          <h2
            className="text-[#4b3a2a] text-[36px] text-center"
            style={{ fontFamily: "'Soluga', serif" }}
          >
            Location
          </h2>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 h-[30px]">
              <span className="text-black text-[16px] font-medium tracking-[-0.64px]">
                라루체 웨딩
              </span>
              <CallButton phone="02-766-8200" />
            </div>
            <div className="flex items-center gap-2 h-[30px]">
              <span className="text-[#99958f] text-[16px] tracking-[-0.64px]">
                서울 중구 퇴계로18길 46
              </span>
              <CopyButton text="서울 중구 퇴계로18길 46" />
            </div>
          </div>
        </motion.div>

        {/* 지도 + 버튼 */}
        <motion.div
          className="flex flex-col gap-6 items-center w-full"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={0.15}
        >
          <div
            className="w-full overflow-hidden"
            style={{
              marginLeft: "-48px",
              marginRight: "-48px",
              width: "calc(100% + 96px)",
            }}
          >
            <KakaoMap />
          </div>
          <div className="flex gap-2.5 w-full">
            <button
              type="button"
              onClick={openNaver}
              className="flex flex-1 items-center justify-center gap-2 bg-white rounded-[10px] h-[50px] shadow-sm active:opacity-70"
            >
              <span className="text-black text-[16px]">네이버</span>
              <img
                src={"/images/icon/naver-map.svg"}
                alt=""
                className="w-[18px] h-[18px] object-contain"
              />
            </button>
            <button
              type="button"
              onClick={openTmap}
              className="flex flex-1 items-center justify-center gap-2 bg-white rounded-[10px] h-[50px] shadow-sm active:opacity-70"
            >
              <span className="text-black text-[16px]">T맵</span>
              <img
                src={"/images/icon/t-map.svg"}
                alt=""
                className="w-[18px] h-[18px] object-contain"
              />
            </button>
          </div>
        </motion.div>

        {/* 교통 안내 */}
        <div className="flex flex-col w-full">
          {TRANSPORTS.map((t, i) => (
            <motion.div
              key={t.type}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0.3 + i * 0.12}
            >
              <div className="flex flex-col gap-2.5 min-h-[79px] w-full justify-center">
                <p className="text-[#99958f] text-[16px] tracking-[-0.352px]">
                  {t.type}
                </p>
                <div>
                  <p className="text-black text-[15px] font-medium">{t.main}</p>
                  <p className="text-[#7a7a7a] text-[15px]">{t.sub}</p>
                </div>
              </div>
              {t.extra && (
                <div className="flex flex-col gap-1 w-full mt-6">
                  <p className="text-black text-[15px] font-medium">
                    {t.extra.main}
                  </p>
                  <p className="text-[#7a7a7a] text-[15px]">{t.extra.sub}</p>
                </div>
              )}
              {i < TRANSPORTS.length - 1 && (
                <div className="py-6 flex items-center justify-center">
                  <hr className="w-full border-t border-[#e0e0e0]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {toastNode}
    </>
  );
}
