"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — share (공유하기 / end) section                                 */
/*                                                                             */
/*  Figma frame 128:41855 "end", file KTCSliL9f8oNYI3Lsu9NWL.                     */
/*  표지(cover)와 짝을 이루는 마무리 — 꽃 편지지+봉투 합본 배경(share-bg) 위에      */
/*  "Thanks to" + 감사 인사 + 카카오톡 공유/청첩장 주소 복사 버튼. 좌표는 배경      */
/*  프레임 기준 비율(%)로 절대배치. 감사 문구는 데이터 필드가 없어 정적 텍스트.    */
/* -------------------------------------------------------------------------- */

import RoughButton from "@/templates/season1/components/rough-button";
import {
  Editable,
  absoluteUrl,
  copyLink,
  shareKakao,
  showToast,
  useInvitationData,
} from "@/templates/shared";
import { Copy, MessageCircle } from "lucide-react";
import { ASSET } from "../assets";
import { CardReveal } from "../card-reveal";
import { useIntro } from "../intro-context";
import { COLOR, FONT } from "../theme";

const INK = COLOR.muted; // #7C6D5F — 크림 편지지 위 텍스트

// 공유/복사에 사용할 청첩장 주소 — 배포 도메인으로 고정(하드코딩).
// window.location 을 쓰면 로컬 개발 시 localhost 가 나가므로 여기서 못 박는다.
const INVITATION_URL =
  "https://dearly-personal-invite-letter-wlsud801s-projects.vercel.app/jinyoung-jihoon";

export function ShareSection() {
  const { share, groom, bride, schedule } = useInvitationData();
  const { isHorizontal } = useIntro();

  // 카카오톡 공유 — 성공(kakao/native)은 별도 피드백 없음, 폴백 결과만 토스트
  const handleKakaoShare = () =>
    void shareKakao({
      url: INVITATION_URL,
      title: `${groom.ko} ♥ ${bride.ko} 결혼합니다`,
      description:
        "따뜻한 가을의 문턱에서, 저희의 첫걸음을 함께 축복해 주세요.",
      // 피드 썸네일 — 봉투 썸네일 이미지.
      // 카카오 서버가 접근할 절대 URL(프로덕션 도메인 기준)이어야 한다.
      imageUrl: absoluteUrl("/assets/templates/brown-lace/thumbnail.jpg"),
    }).then((result) => {
      if (result === "copied") showToast("청첩장 주소가 복사되었습니다.");
      else if (result === "failed") showToast("공유에 실패했습니다.");
    });

  return (
    <section
      aria-label="공유하기"
      className="relative w-full select-none overflow-hidden drop-shadow-[0px_-2px_8px_rgba(101,89,79,0.2)]"
      style={{
        backgroundColor: COLOR.background,
        // 콘텐츠/배경이 모두 absolute 라 흐름 높이가 없어 높이를 별도로 줘야 한다.
        // 세로: aspectRatio 로 배경 비율대로 높이를 만든다.
        // 가로(카드): 카드 높이(100cqh)를 채운다. 뒤 배경(peopleBg)이 object-cover 라
        //   섹션 높이가 얼마든 항상 꽉 채워진다.
        ...(isHorizontal
          ? { minHeight: "100cqh" }
          : { aspectRatio: "804 / 1247" }),
      }}
    >
      {/* 뒤 배경 — 화면을 꽉 채운다 */}
      <img
        alt=""
        aria-hidden
        src={ASSET.peopleBg}
        className="absolute inset-0 size-full object-cover"
      />
      {/* 앞 봉투 V 노치 — 하단 고정 */}
      <img
        alt=""
        aria-hidden
        src={ASSET.endBgFront}
        className="absolute inset-x-0 bottom-0 w-full"
      />

      {/* 콘텐츠 — 편지지 윗부분(봉투 V노치 위)에 배치.
          가로 모드: 배경(편지지·봉투)은 두고 콘텐츠만 페이드인.
          가로 중앙정렬은 translate 속성(-translate-x-1/2)이라 Reveal 의
          transform(translateY)과 충돌하지 않는다. */}
      <CardReveal
        className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center justify-between"
        style={{ top: "17%", width: "64%", height: "50%" }}
      >
        {/* 인사 */}
        <div
          className="flex w-full flex-col items-center gap-3 text-center"
          style={{ color: INK }}
        >
          <p style={{ fontFamily: FONT.roaming, fontSize: 40, lineHeight: 1 }}>
            Thanks to
          </p>
          <Editable
            field="share.thanks"
            label="감사 인사"
            className="flex w-full flex-col items-center gap-2"
          >
            {share.thanks.map((para, i) => (
              <p
                key={i}
                style={{
                  fontFamily: FONT.pretendard,
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: 1.4,
                  letterSpacing: "-0.02em",
                }}
              >
                {para.map((line, j) => (
                  <span key={j} className="block">
                    {line}
                  </span>
                ))}
              </p>
            ))}
          </Editable>
        </div>

        {/* 하트 디바이더 */}
        <img alt="" aria-hidden src={ASSET.decoHeart} className="size-3" />

        {/* 액션 — RoughButton (arrow) */}
        <div className="flex w-full flex-col gap-3">
          <RoughButton
            label="카카오톡 공유"
            variant="filled"
            colorType="green"
            arrow
            icon={<MessageCircle className="size-[18px]" />}
            onClick={handleKakaoShare}
            className="w-full"
          />
          <RoughButton
            label="청첩장 주소 복사"
            variant="filled"
            colorType="green"
            arrow
            icon={<Copy className="size-[13px]" />}
            onClick={() =>
              void copyLink(INVITATION_URL).then((ok) =>
                showToast(
                  ok ? "청첩장 주소가 복사되었습니다." : "복사에 실패했습니다.",
                ),
              )
            }
            className="w-full"
          />
        </div>
      </CardReveal>
    </section>
  );
}
