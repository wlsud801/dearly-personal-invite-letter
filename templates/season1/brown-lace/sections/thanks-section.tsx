"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — thanks (감사장) section                                        */
/*                                                                             */
/*  Figma frame 128:51501 "template-02-thankyou", file KTCSliL9f8oNYI3Lsu9NWL.   */
/*  감사장 모드(letterType="thanks")에서만 렌더되는 단독 페이지. 청첩장 모드에는   */
/*  포함되지 않는다(THANKS_SECTIONS / SECTIONS 분리).                            */
/*                                                                             */
/*  구성(아래→위): 크림 편지지 배경(레이스 프레임 + 타원 창) → 타원 커플 사진 →     */
/*  하단 봉투 V 플랩(상단 투명) → 상단 콘텐츠("Thanks to" + 감사 인사 + 드림).     */
/*  좌표는 Figma 프레임(404×874) 기준 비율(%)로 절대배치. 감사 문구는 share.thanks */
/*  를 공유한다(감사장/청첩장은 서로 다른 모드라 동시에 노출되지 않는다).          */
/* -------------------------------------------------------------------------- */

import { Editable, useInvitationData } from "@/templates/shared";
import { ASSET } from "../assets";
import { CardReveal } from "../card-reveal";
import { useIntro } from "../intro-context";
import { COLOR, FONT } from "../theme";

const INK = COLOR.muted; // #7C6D5F — 크림 편지지 위 텍스트

export function ThanksSection() {
  const { share, groom, bride, gallery } = useInvitationData();
  const { isHorizontal } = useIntro();
  // 타원 창에 들어갈 대표 커플 사진. 없으면 창은 빈 레이스 프레임으로 폴백.
  const photo = gallery.photos[3];

  return (
    <section
      aria-label="감사장"
      className="relative w-full select-none overflow-hidden"
      style={{
        backgroundColor: COLOR.background,
        // share 섹션과 동일: 콘텐츠가 모두 absolute 라 흐름 높이가 없어 높이를 별도로 준다.
        // 세로는 배경 프레임 비율(404:874), 가로(카드)는 카드 높이를 채운다.
        ...(isHorizontal
          ? { minHeight: "100cqh" }
          : { aspectRatio: "404 / 874" }),
      }}
    >
      {/* 크림 편지지 배경 — 레이스 프레임 + 타원 창. Figma image26 는 상하 반전 배치라
          scaleY(-1) + 프레임 기준 top/height 로 원본 좌표를 그대로 재현한다. */}
      <img
        alt=""
        aria-hidden
        src={ASSET.thankyouBg}
        className="absolute left-0 w-full max-w-none object-cover"
        style={{ top: "-5.03%", height: "118.4%", transform: "scaleY(-1)" }}
      />

      {/* 타원 커플 사진 — 배경 레이스 창 안에 위치 (Figma ellipse 128:51507). */}
      {photo ? (
        <div
          className="absolute overflow-hidden rounded-[50%]"
          style={{
            left: "23.5%",
            top: "52.9%",
            width: "53%",
            height: "35.7%",
            opacity: 0.7,
            boxShadow:
              "inset 0px 6px 10px 0px rgba(0,0,0,0.15), inset 0px 2px 3px 0px rgba(0,0,0,0.3)",
          }}
        >
          <img src={photo} alt="" className="size-full object-cover" />
        </div>
      ) : null}

      {/* 앞 봉투 — 하단 V 노치 플랩. 상단은 투명이라 타원 사진을 가리지 않는다.
          share 섹션과 동일한 봉투 앞판(endBgFront)을 공용으로 쓴다. */}
      <img
        alt=""
        aria-hidden
        src={ASSET.endBgFront}
        className="absolute inset-x-0 bottom-0 w-full"
      />

      {/* 콘텐츠 — Thanks to + 감사 인사 + 드림 (상단, Figma contents 128:51527).
          가로 모드: 배경(편지지·봉투·사진)은 두고 콘텐츠만 페이드인 */}
      <CardReveal
        className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center text-center"
        style={{ top: "5.4%", width: "90%", color: INK }}
      >
        <p
          style={{
            fontFamily: FONT.roaming,
            fontSize: 40,
            lineHeight: 1.5,
          }}
        >
          Thanks to
        </p>

        <Editable
          field="share.thanks"
          label="감사 인사"
          className="flex w-full flex-col items-center pt-10 gap-1"
        >
          {share.thanks.map((para, i) => (
            <p
              key={i}
              style={{
                fontFamily: FONT.pretendard,
                fontWeight: 500,
                fontSize: 14,
                lineHeight: 1.8,
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

        {/* 하트 디바이더 */}
        <img alt="" aria-hidden src={ASSET.decoHeart} className="size-3" />

        <p
          style={{
            fontFamily: FONT.pretendard,
            fontWeight: 500,
            fontSize: 14,
            letterSpacing: "-0.02em",
          }}
        >
          {groom.ko}, {bride.ko} 드림
        </p>
      </CardReveal>
    </section>
  );
}
