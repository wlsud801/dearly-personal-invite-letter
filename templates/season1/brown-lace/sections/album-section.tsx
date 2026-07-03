"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — album (앨범 / photo) section                                   */
/*                                                                             */
/*  Figma frame 128:40544 "photo" (402×682), file KTCSliL9f8oNYI3Lsu9NWL.        */
/*  레이스 액자(album-main) 안에 대표 사진을 타원으로 마스킹해 넣고, 같은 사진을    */
/*  dim(opacity 20%) 처리해 섹션 배경으로 깐다. 상/하단엔 레이스 스캘럽 띠         */
/*  (album-deco, 위는 상하반전). 하단에 "더 많은 사진 보기" 라인 버튼.            */
/*  대표 사진 = gallery.photos[0]. 없으면 surface 플레이스홀더로 폴백.            */
/* -------------------------------------------------------------------------- */

import RoughButton from "@/templates/season1/components/rough-button";
import { Editable, useInvitationData } from "@/templates/shared";
import { useState } from "react";
import { ASSET } from "../assets";
import { CardReveal } from "../card-reveal";
import { useIntro } from "../intro-context";
import { GalleryModal } from "../modal/gallery-modal";
import { COLOR } from "../theme";

export function AlbumSection() {
  const { gallery } = useInvitationData();
  const { isHorizontal } = useIntro();
  const photo = gallery.photos[11];
  const [galleryOpen, setGalleryOpen] = useState(false);

  return (
    <section
      aria-label="앨범"
      className={`relative w-full select-none overflow-hidden ${
        // 가로(카드) 모드: 카드 높이(100cqh)를 채우므로 콘텐츠를 세로 중앙에 배치
        isHorizontal ? "flex flex-col justify-center" : ""
      }`}
      style={{
        backgroundColor: COLOR.background,
        // 가로(카드) 모드: 카드 높이만큼 채워 dim 배경 사진이 화면을 꽉 채우게 한다.
        // 100cqh = shell([container-type:size]) 높이 = 카드 높이. 내용이 더 길면 늘어난다.
        minHeight: isHorizontal ? "100cqh" : undefined,
      }}
    >
      {/* 필터 배경 — 대표 사진과 동일 이미지 dim 처리 */}
      {photo && (
        <img
          alt=""
          aria-hidden
          src={photo}
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-20"
        />
      )}

      {/* 상단 레이스 띠 (상하반전) */}
      <img
        alt=""
        aria-hidden
        src={ASSET.albumDeco}
        className="absolute inset-x-0 top-0 w-full -scale-y-100"
      />

      {/* 콘텐츠 — 가로 모드: dim 배경·레이스 띠는 두고 콘텐츠만 페이드인 */}
      <CardReveal className="relative flex w-full flex-col items-center gap-5 px-5 py-10">
        {/* 레이스 액자 + 타원 사진 */}
        <Editable field="gallery" label="앨범 사진" className="w-full">
          <div className="relative mx-auto w-full max-w-[362px] aspect-[362/524]">
            {/* 레이스 액자 프레임 (아래) */}
            <img
              alt=""
              aria-hidden
              src={ASSET.albumMain}
              className="pointer-events-none absolute inset-0 size-full object-contain opacity-80"
            />
            {/* 타원 마스킹 사진 — 액자 가운데 타원 위에 올린다 */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[50%]"
              style={{
                width: "76%",
                height: "70%",
                backgroundColor: COLOR.surface,
              }}
            >
              {photo && (
                <img
                  alt=""
                  src={photo}
                  className="size-full object-cover scale-[1.3] origin-top "
                  draggable={false}
                />
              )}
            </div>
          </div>
        </Editable>

        {/* 더 많은 사진 보기 — RoughButton (line, arrow) */}
        <RoughButton
          label="더 많은 사진 보기"
          variant="line"
          colorType="green"
          arrow
          onClick={() => setGalleryOpen(true)}
          className="min-w-[160px]"
        />
      </CardReveal>

      {/* 하단 레이스 띠 */}
      <img
        alt=""
        aria-hidden
        src={ASSET.albumDeco}
        className="absolute inset-x-0 bottom-0 w-full"
      />

      {/* 전체 갤러리 모달 */}
      <GalleryModal open={galleryOpen} onClose={() => setGalleryOpen(false)} />
    </section>
  );
}
