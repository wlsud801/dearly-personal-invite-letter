"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — guestbook (방명록 / Message) section                           */
/*                                                                             */
/*  Figma frame 128:40563 "message" (402×?), file KTCSliL9f8oNYI3Lsu9NWL.        */
/*  상/하단 플로럴 플러시(guest-deco) 사이에 "Message" 타이틀 + 방명록 메시지       */
/*  프리뷰(최대 3개, 본문 + From.이름, 메시지 사이 하트 디바이더) + 액션 버튼 2개   */
/*  (메세지 남기기 / 전체보기, 라인 스타일). 데이터 = guestbook.messages.         */
/* -------------------------------------------------------------------------- */

import { Editable, useInvitationData } from "@/templates/shared";
import { Fragment, useState } from "react";
import RoughButton from "@/templates/season1/components/rough-button";
import { ASSET } from "../assets";
import { CardReveal } from "../card-reveal";
import { COLOR, FONT } from "../theme";
import { GuestbookModal } from "../modal/guestbook-modal";
import { GuestbookWriteModal } from "../modal/guestbook-write-modal";

const messageStyle = {
  fontFamily: FONT.pretendard,
  fontWeight: 400,
  fontSize: 14,
  lineHeight: 1.5,
  letterSpacing: "-0.022em",
  color: COLOR.text,
} as const;

function LineButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <RoughButton
      label={label}
      variant="line"
      colorType="green"
      arrow
      onClick={onClick}
      className="min-w-0 flex-1"
    />
  );
}

export function GuestbookSection() {
  const { guestbook } = useInvitationData();
  const preview = guestbook.messages.slice(0, 3);
  const [listOpen, setListOpen] = useState(false);
  const [writeOpen, setWriteOpen] = useState(false);

  return (
    <section
      aria-label="방명록"
      // min-h-[100cqh]: 메시지가 적어도 섹션이 항상 화면(카드) 높이를 채운다.
      className="relative flex min-h-[100cqh] w-full select-none flex-col items-center gap-4 px-5 py-10"
      style={{ backgroundColor: COLOR.background }}
    >
      {/* 상단 플러시 */}
      <img
        alt=""
        aria-hidden
        src={ASSET.guestDeco}
        className="w-[266px] max-w-full rotate-180"
      />

      {/* 가로 모드: 상/하단 플러시는 두고 타이틀·메시지·버튼만 페이드인.
          flex-1: 남는 세로 공간을 차지해 하단 플러시를 섹션 아래 끝으로 밀되,
          콘텐츠는 위에서부터 쌓아 타이틀이 메시지 유무와 무관하게 항상 최상단. */}
      <CardReveal className="flex w-full flex-1 flex-col items-center gap-4">
        {/* 타이틀 */}
        <p
          className="text-center"
          style={{
            fontFamily: FONT.roaming,
            fontSize: 48,
            lineHeight: 1,
            color: COLOR.text,
          }}
        >
          Message
        </p>

        {/* 메시지가 없을 때 안내문 */}
        {preview.length === 0 && (
          <p
            className="px-3 py-6 text-center"
            style={{ ...messageStyle, color: COLOR.muted }}
          >
            아직 남겨진 메시지가 없어요.
            <br />첫 번째로 메시지를 남겨주세요.
          </p>
        )}

        {/* 메시지 프리뷰 */}
        {preview.length > 0 && (
          <Editable
            field="guestbook"
            label="방명록"
            className="flex w-full flex-col items-center gap-3"
          >
            {preview.map((msg, i) => (
              <Fragment key={i}>
                {i > 0 && (
                  <img
                    alt=""
                    aria-hidden
                    src={ASSET.decoHeart}
                    className="size-2"
                  />
                )}
                <div className="flex w-full flex-col items-start gap-2 p-3">
                  <p
                    className="w-full whitespace-pre-line"
                    style={messageStyle}
                  >
                    {msg.text}
                  </p>
                  <div
                    className="flex items-center gap-1"
                    style={{ fontSize: 12, color: COLOR.muted }}
                  >
                    <span style={{ fontFamily: FONT.altesse }}>From.</span>
                    <span
                      style={{ fontFamily: FONT.pretendard, fontWeight: 500 }}
                    >
                      {msg.from}
                    </span>
                  </div>
                </div>
              </Fragment>
            ))}
          </Editable>
        )}

        {/* 액션 — 전체보기는 메시지가 있을 때만 */}
        <div className="flex w-full flex-wrap gap-3 px-3 py-2">
          <LineButton
            label="메세지 남기기"
            onClick={() => setWriteOpen(true)}
          />
          {preview.length > 0 && (
            <LineButton
              label="메세지 전체보기"
              onClick={() => setListOpen(true)}
            />
          )}
        </div>
      </CardReveal>

      {/* 하단 플러시 */}
      <img
        alt=""
        aria-hidden
        src={ASSET.guestDeco}
        className="w-[266px] max-w-full -scale-y-100 rotate-180"
      />

      {/* 방명록 전체보기 모달 */}
      <GuestbookModal open={listOpen} onClose={() => setListOpen(false)} />

      {/* 방명록 작성 모달 */}
      <GuestbookWriteModal
        open={writeOpen}
        onClose={() => setWriteOpen(false)}
      />
    </section>
  );
}
