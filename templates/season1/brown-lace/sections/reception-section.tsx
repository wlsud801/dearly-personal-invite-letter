"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — 추가 정보 (피로연 + 화환) section                               */
/*                                                                             */
/*  Figma frame 128:40773 "추가 정보" (402×?), file KTCSliL9f8oNYI3Lsu9NWL.       */
/*  reception(피로연)·flower(화환)이 하나의 레이스 카드 안에 함께 들어간다.        */
/*  레이스 카드 배경 = reception-lace-top + (-block ×N) + -bottom 조합.           */
/*  block 은 세로 repeat 배경으로 깔려 내용 높이에 따라 자동으로 늘어난다(반응형).  */
/*                                                                             */
/*  reception·flower 는 "각각 optional" — 데이터(제목/본문 등)가 비어 있으면        */
/*  해당 블록을 렌더하지 않는다. 둘 다 비면 섹션 전체를 숨긴다(null). 두 섹션은      */
/*  한 카드를 공유하므로 단일 컴포넌트로 묶고 reception id 에 등록한다.            */
/*  텍스트는 모두 크림 페이퍼 위 다크 브라운(COLOR.heading #53473D).              */
/* -------------------------------------------------------------------------- */

import {
  Editable,
  Lines,
  copyWithToast,
  pad2,
  useInvitationData,
} from "@/templates/shared";
import type { ReactNode } from "react";
import { Copy, Phone } from "lucide-react";
import { ASSET } from "../assets";
import { CardReveal } from "../card-reveal";
import { COLOR, FONT } from "../theme";

const INK = COLOR.heading; // #53473D — 크림 페이퍼 위 텍스트

const titleStyle = {
  fontFamily: FONT.pretendard,
  fontWeight: 700,
  fontSize: 16,
  lineHeight: 1.4,
  letterSpacing: "-0.02em",
  color: INK,
} as const;

const bodyStyle = {
  fontFamily: FONT.pretendard,
  fontWeight: 400,
  fontSize: 14,
  lineHeight: 1.4,
  letterSpacing: "-0.02em",
  color: INK,
} as const;

/** 레이스 카드 — top + block(세로 repeat) + bottom 으로 내용 높이에 맞춰 늘어난다. */
function LaceCard({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[362px]">
      <img
        alt=""
        aria-hidden
        src={ASSET.receptionLaceTop}
        className="block w-full"
      />
      {/* top/bottom 이미지와 1px 겹쳐 연결부의 배경색 노출(선)을 막는다 */}
      <div
        className="-my-px bg-top bg-repeat-y px-[17%]"
        style={{
          backgroundImage: `url(${ASSET.receptionLaceBlock})`,
          backgroundSize: "100% auto",
        }}
      >
        {children}
      </div>
      <img
        alt=""
        aria-hidden
        src={ASSET.receptionLaceBottom}
        className="block w-full"
      />
    </div>
  );
}

/** 피로연 빅 날짜 — Aurora, YYYY(32) . (20) MM(32) . (20) DD(32) */
function ReceptionDate({ iso }: { iso: string }) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const big = { fontSize: 32, lineHeight: "normal" } as const;
  const dot = { fontSize: 20, lineHeight: "normal" } as const;
  return (
    <div
      className="flex items-end gap-1"
      style={{ fontFamily: FONT.aurora, color: INK }}
    >
      <span style={big}>{d.getFullYear()}</span>
      <span style={dot}>.</span>
      <span style={big}>{pad2(d.getMonth() + 1)}</span>
      <span style={dot}>.</span>
      <span style={big}>{pad2(d.getDate())}</span>
    </div>
  );
}

export function ReceptionSection() {
  const { reception, flower } = useInvitationData();

  const hasReception = !!(
    reception.title ||
    reception.body.length ||
    reception.date ||
    reception.dateDetail ||
    reception.placeName ||
    reception.address
  );
  const hasFlower = !!(flower.title || flower.body.length);

  if (!hasReception && !hasFlower) return null;

  return (
    <section
      aria-label="추가 정보"
      className="relative w-full select-none px-5 py-10"
      style={{ backgroundColor: COLOR.background }}
    >
      {/* 가로 모드: 카드 진입 시 콘텐츠 페이드인 (세로 모드는 셸 reveal) */}
      <CardReveal>
        <LaceCard>
          <div className="flex w-full flex-col items-center gap-5 py-4 text-center">
            {/* ===== 피로연 ===== */}
            {hasReception && (
              <Editable
                field="reception"
                label="피로연 안내"
                className="flex w-full flex-col items-center gap-6"
              >
                {/* 제목 + 안내문 */}
                <div className="flex w-full flex-col items-center gap-3">
                  {reception.title && (
                    <p style={titleStyle}>{reception.title}</p>
                  )}
                  {reception.body.length > 0 && (
                    <p style={bodyStyle}>
                      <Lines lines={reception.body} />
                    </p>
                  )}
                </div>

                {/* 일시 + 장소 */}
                {(reception.date ||
                  reception.dateDetail ||
                  reception.placeName ||
                  reception.address) && (
                  <div className="flex w-full flex-col items-center gap-4">
                    {reception.date && <ReceptionDate iso={reception.date} />}
                    {reception.dateDetail && (
                      <p style={{ ...titleStyle, fontWeight: 500 }}>
                        {reception.dateDetail}
                      </p>
                    )}

                    {(reception.placeName || reception.address) && (
                      <div className="flex w-full flex-col items-center justify-center">
                        {reception.placeName && (
                          <div className="flex items-center justify-center gap-1">
                            <p className="whitespace-nowrap" style={titleStyle}>
                              {reception.placeName}
                            </p>
                            {reception.placeTel && (
                              <a
                                href={`tel:${reception.placeTel.replace(/[^0-9+]/g, "")}`}
                                aria-label={`${reception.placeName} 에 전화`}
                                className="flex size-6 items-center justify-center"
                                style={{ color: INK }}
                              >
                                <Phone className="size-[13px]" />
                              </a>
                            )}
                          </div>
                        )}
                        {reception.address && (
                          <div className="flex items-center justify-center gap-1">
                            <p className="whitespace-nowrap" style={bodyStyle}>
                              {reception.address}
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                void copyWithToast(
                                  reception.address!,
                                  "주소가 복사되었습니다.",
                                )
                              }
                              aria-label="주소 복사"
                              className="flex size-6 items-center justify-center"
                              style={{ color: INK }}
                            >
                              <Copy className="size-[13px]" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Editable>
            )}

            {/* ===== 화환 ===== */}
            {hasFlower && (
              <Editable
                field="flower"
                label="화환 안내"
                className="flex w-full flex-col items-center gap-3"
              >
                {/* 플로럴 데코 (Figma 160×28) — 화환 안내 상단 장식.
                  피로연 블록과 함께 렌더될 땐 두 블록 사이 디바이더 역할도 한다. */}
                <img
                  alt=""
                  aria-hidden
                  src={ASSET.receptionDeco}
                  className="w-40 max-w-full"
                />
                {flower.title && <p style={titleStyle}>{flower.title}</p>}
                {flower.body.length > 0 && (
                  <p style={bodyStyle}>
                    <Lines lines={flower.body} />
                  </p>
                )}
                {/* 하단 플로럴 데코 — 상단 데코의 상하 반전 대칭 */}
                <img
                  alt=""
                  aria-hidden
                  src={ASSET.receptionDeco}
                  className="w-40 max-w-full -scale-y-100"
                />
              </Editable>
            )}
          </div>
        </LaceCard>
      </CardReveal>
    </section>
  );
}
