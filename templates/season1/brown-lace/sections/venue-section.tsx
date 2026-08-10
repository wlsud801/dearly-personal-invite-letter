"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — venue (장소 정보 / location) section                           */
/*                                                                             */
/*  Figma frame 128:40736 "location" (402×?), file KTCSliL9f8oNYI3Lsu9NWL.       */
/*  다크 브라운 배경 위에 위→아래로:                                            */
/*   · "Location" 타이틀(Roaming 48)                                            */
/*   · 장소명(call) + 주소(copy)                                                 */
/*   · 지도 (클릭 시 네이버 지도) + 네이버지도/T맵 버튼                          */
/*   · 교통편(venue.transport) 그룹 — 그룹 사이 얇은 디바이더                     */
/*  수치·폰트·색은 Figma 노드 데이터에서 추출. 텍스트는 크림(#D7CEC6).            */
/* -------------------------------------------------------------------------- */

import RoughButton from "@/templates/season1/components/rough-button";
import {
  Editable,
  KakaoMap,
  Reveal,
  copyWithToast,
  openMap,
  useInvitationData,
} from "@/templates/shared";
import { Copy, Phone } from "lucide-react";
import { CardReveal } from "../card-reveal";
import { COLOR, FONT } from "../theme";

/** 지도 앱 브랜드 아이콘 (모든 템플릿 공용) */
const NAVER_ICON = "/assets/images/icons/naver-map.svg";
const TMAP_ICON = "/assets/images/icons/t-map.svg";

const nameStyle = {
  fontFamily: FONT.pretendard,
  fontWeight: 700,
  fontSize: 16,
  lineHeight: 1.4,
  letterSpacing: "-0.02em",
  color: COLOR.text,
} as const;

const addressStyle = {
  fontFamily: FONT.pretendard,
  fontWeight: 500,
  fontSize: 14,
  lineHeight: 1.4,
  letterSpacing: "-0.02em",
  color: COLOR.text,
} as const;

type MapAppButtonProps = {
  icon: string;
  label: string;
  onClick: () => void;
};

/** 네이버지도 / T맵 액션 버튼 — RoughButton (filled, arrow) + 좌측 브랜드 아이콘 */
function MapAppButton({ icon, label, onClick }: MapAppButtonProps) {
  return (
    <RoughButton
      label={label}
      variant="filled"
      colorType="green"
      arrow
      icon={
        <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
          <img
            src={icon}
            alt=""
            aria-hidden
            className="size-5 object-contain"
          />
        </span>
      }
      onClick={onClick}
      className="min-w-0 flex-1"
    />
  );
}

export function VenueSection() {
  const { venue } = useInvitationData();
  const query = `${venue.name}`;

  return (
    <section
      aria-label="장소 정보"
      className="relative w-full select-none px-5 pt-5 pb-10"
      style={{ backgroundColor: COLOR.background }}
    >
      {/* 가로 모드: 카드 진입 시 콘텐츠가 아래→위로 페이드인 */}
      <CardReveal className="mx-auto flex w-full max-w-[362px] flex-col items-center gap-4">
        {/* 타이틀 */}
        <p
          className="w-full text-center"
          style={{
            fontFamily: FONT.roaming,
            fontSize: 48,
            lineHeight: 1,
            color: COLOR.text,
          }}
        >
          Location
        </p>

        {/* 장소명 + 주소 */}
        <Editable
          field="venue"
          label="예식 장소"
          className="flex w-full flex-col items-center"
        >
          <div className="flex items-center justify-center gap-1">
            <p className="whitespace-nowrap" style={nameStyle}>
              {venue.name}
            </p>
            {venue.tel && (
              <a
                href={`tel:${venue.tel.replace(/[^0-9+]/g, "")}`}
                aria-label={`${venue.name} 에 전화`}
                className="flex size-6 items-center justify-center"
                style={{ color: COLOR.text }}
              >
                <Phone className="size-[13px]" />
              </a>
            )}
          </div>
          <div className="flex items-center justify-center gap-1">
            <p className="whitespace-nowrap" style={addressStyle}>
              {venue.address}
              {venue.addressDetail && ` (${venue.addressDetail})`}
            </p>
            <button
              type="button"
              onClick={() =>
                void copyWithToast(venue.address, "주소가 복사되었습니다.")
              }
              aria-label="주소 복사"
              className="flex size-6 items-center justify-center"
              style={{ color: COLOR.text }}
            >
              <Copy className="size-[13px]" />
            </button>
          </div>
        </Editable>

        {/* 지도 (카카오) — 키 미설정/실패 시 네이버 지도 열기 폴백 */}
        <KakaoMap
          address={venue.address}
          name={venue.name}
          lat={venue.lat}
          lng={venue.lng}
          className="h-[231px] w-full overflow-hidden rounded-[4px] bg-[#E9E2DD] text-[#7C6D5F]"
        />

        {/* 지도 앱 버튼 */}
        <div className="flex w-full gap-3 px-3 py-2">
          <MapAppButton
            icon={NAVER_ICON}
            label="네이버 지도"
            onClick={() => openMap("naver", query)}
          />
          <MapAppButton
            icon={TMAP_ICON}
            label="T맵"
            onClick={() => openMap("tmap", query)}
          />
        </div>

        {/* 교통편 */}
        {venue.transport.length > 0 && (
          <Editable
            field="venue.transport"
            label="교통편"
            className="flex w-full flex-col gap-5 p-3"
          >
            {venue.transport.map((group, i) => (
              // 스크롤 진입 시 자차·지하철 등 교통편 그룹이 아래→위로 순차 등장.
              // delay 를 그룹 순서만큼 주어 한 화면에 여러 그룹이 보여도 하나씩 나타난다.
              <Reveal
                key={group.title}
                from="up"
                amount={0.3}
                delay={i * 0.15}
                className="flex w-full flex-col"
              >
                <div className="flex w-full flex-col gap-3">
                  <p style={nameStyle}>{group.title}</p>
                  {group.items.map((item, j) => (
                    <div key={j} className="flex w-full flex-col gap-1">
                      <p style={nameStyle}>{item.head}</p>
                      {item.sub && (
                        <p style={{ ...addressStyle, opacity: 0.6 }}>
                          {item.sub}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* 그룹 사이 얇은 디바이더 */}
                {i < venue.transport.length - 1 && (
                  <div
                    className="mt-5 h-px w-full"
                    style={{ backgroundColor: COLOR.text, opacity: 0.2 }}
                  />
                )}
              </Reveal>
            ))}
          </Editable>
        )}
      </CardReveal>
    </section>
  );
}
