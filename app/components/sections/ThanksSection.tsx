'use client';

import Script from "next/script";
import { imgThanksLeft, imgThanksRight, imgKakaoIcon, imgLinkIcon } from "./assets";
import { useToast } from "../Toast";

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (settings: object) => void;
      };
    };
  }
}

export default function ThanksSection() {
  const [toast, toastNode] = useToast();

  const handleKakaoShare = () => {
    if (!window.Kakao?.Share) {
      toast.show("카카오톡 공유를 준비 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    const url = window.location.href;
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "손재환 ♥ 김혜빈 결혼합니다",
        description: "2026년 5월 31일 일요일 오전 11시 30분 | 라루체 명동 5F 그레이스홀",
        imageUrl: `${window.location.origin}/images/og-image.jpg`,
        link: { mobileWebUrl: url, webUrl: url },
      },
    });
  };

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    toast.show("청첩장 주소가 복사되었습니다");
  };

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/v1/kakao.min.js"
        strategy="afterInteractive"
        onReady={() => {
          const key = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
          if (key && !window.Kakao.isInitialized()) {
            window.Kakao.init(key);
          }
        }}
      />

      <section className="bg-[#2c4221] flex flex-col items-center px-12 py-12 gap-10">
        <div className="flex flex-col gap-5 items-center w-full">
          {/* Thanks to 제목 */}
          <div className="flex items-center gap-3 w-full justify-center">
            <img src={imgThanksLeft} alt="" className="h-[54px] w-[52px] object-contain" />
            <h2
              className="text-white text-[36px] text-center"
              style={{ fontFamily: "'Soluga', serif" }}
            >
              Thanks to
            </h2>
            <img src={imgThanksRight} alt="" className="h-[55px] w-[50px] object-contain" />
          </div>

          {/* 감사 본문 */}
          <div className="flex flex-col items-center">
            <div className="px-6 py-5 text-center">
              <p className="text-[#b2baae] text-[15px] leading-relaxed tracking-[-0.6px] whitespace-pre-line">
                {`오랜 시간 저희를 따뜻한 시선으로\n지켜봐주셔서 감사합니다.`}
              </p>
            </div>
            <div className="px-6 py-5 text-center">
              <p className="text-white text-[16px] font-medium leading-relaxed tracking-[-0.64px] whitespace-pre-line">
                {`보내주신 마음을 오래도록 기억하며\n서로의 동반자로 의미있는 삶을 살겠습니다.`}
              </p>
            </div>
          </div>
        </div>

        {/* 공유 버튼 */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            type="button"
            onClick={handleKakaoShare}
            className="flex items-center gap-2 bg-[#f4f3f1] rounded-[10px] h-[58px] px-5 w-full"
          >
            <span className="text-[#212842] text-[14px] font-medium tracking-[-0.56px] flex-1 text-left">
              카카오톡으로 공유하기
            </span>
            <div className="flex items-center justify-center w-[30px] h-[30px] p-2.5">
              <img src={imgKakaoIcon} alt="" className="w-3 h-[11px]" />
            </div>
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-2 bg-[#f4f3f1] rounded-[10px] h-[58px] px-5 w-full"
          >
            <span className="text-[#212842] text-[14px] font-medium tracking-[-0.56px] flex-1 text-left">
              청첩장 주소 복사하기
            </span>
            <div className="flex items-center justify-center w-[30px] h-[30px] p-2.5">
              <img src={imgLinkIcon} alt="" className="w-3 h-3" />
            </div>
          </button>
        </div>
      </section>

      {toastNode}
    </>
  );
}
