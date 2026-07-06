import { Editable, useCoverScrollLock, useInvitationData } from "@/templates/shared";
import { useEffect, useRef, useState } from "react";
import { ASSET } from "../assets";
import styles from "../cover.module.css";
import { useIntro } from "../intro-context";
import { COLOR, EFFECT, FONT } from "../theme";

/** 표지 열림 모션 전체 길이(ms). 가장 긴 트랜지션 = delay 1000 + duration 2500. */
const OPEN_ANIM_MS = 3500;

function CoverSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  // 표지를 한 번 클릭하면 하나로 이어진 모션이 재생된다.
  // 뚜껑은 위로 사라지고, 봉투(열린 뚜껑·몸통·뒷배경)는 시차를 두고 하단으로 내려가며,
  // 그 사이 편지지가 위로 떠올라 최종 화면(Figma 128:42278)이 된다.
  const [opened, setOpened] = useState(false);
  // 열림 모션이 끝나면 표지를 dim(페이드아웃)으로 감추고 greeting 으로 전환한다.
  const [done, setDone] = useState(false);
  // 가로 모드: 페이드아웃이 끝난 뒤 표지 카드를 완전히 접었는지.
  const [collapsed, setCollapsed] = useState(false);
  const { markCoverDone, isHorizontal } = useIntro();

  const { groom, bride, schedule, venue, greeting } = useInvitationData();
  const d = new Date(schedule.weddingDate);
  const bigDate = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate(),
  ).padStart(2, "0")}`;

  // 열림 모션 동안엔 다음 섹션으로 스크롤되지 않도록 스크롤 컨테이너를 잠근다.
  // 세로=overflowY(아래 greeting), 가로=overflowX(옆 카드). 가로는 페이드아웃 도중
  // 스와이프로 위치가 어긋나지 않도록 카드 접기(collapsed)까지 잠금을 유지한다.
  useCoverScrollLock(
    sectionRef,
    isHorizontal ? collapsed : done,
    isHorizontal ? "x" : "y",
  );

  // 클릭 후 모션이 끝나는 시점에 표지를 감추고 greeting 전환을 알린다.
  useEffect(() => {
    if (!opened) return;
    const t = setTimeout(() => {
      setDone(true);
      markCoverDone();
    }, OPEN_ANIM_MS);
    return () => clearTimeout(t);
  }, [opened, markCoverDone]);

  // 가로 모드: 페이드아웃(section opacity transition, duration-1000)이 끝나면 표지 카드를
  // 접는다. greeting 이 별도 카드라, 페이드만으로는 빈 카드가 남고 되돌아가면 다시 보인다.
  useEffect(() => {
    if (!isHorizontal || !done) return;
    const t = setTimeout(() => setCollapsed(true), 1000);
    return () => clearTimeout(t);
  }, [isHorizontal, done]);

  // 접힘을 부모 카드(shell 이 렌더한 [data-section] 래퍼)에 적용 → 스냅 대상에서 제거.
  // 표지가 첫 카드였으므로 greeting 이 자연스럽게 첫 카드 자리로 들어온다.
  useEffect(() => {
    if (!collapsed) return;
    const card = sectionRef.current?.closest<HTMLElement>("[data-section]");
    if (card) card.style.display = "none";
  }, [collapsed]);

  return (
    <section
      ref={sectionRef}
      aria-label="표지"
      onClick={() => setOpened(true)}
      className="absolute inset-x-0 top-0 z-30 w-full cursor-pointer select-none overflow-hidden transition-opacity duration-1000 ease-in-out"
      style={{
        height: "100cqh",
        backgroundColor: COLOR.background,
        opacity: done ? 0 : 1,
        pointerEvents: done ? "none" : "auto",
      }}
    >
      <div className="w-full h-full">
        {/* 열린 편지 봉투 뚜껑 */}
        <div
          className={`absolute left-0 z-7 transition-all duration-2500 delay-1000 ease-in-out ${
            opened ? "top-[55%]" : "top-[-50%]"
          }`}
        >
          <img
            alt=""
            aria-hidden
            src={ASSET.introBgLid}
            className="max-w-none object-cover w-full rotate-180"
          />
        </div>
        {/* 편지 봉투 뚜껑 — 클릭 시 dim 되며 위로 사라짐 */}
        <div
          className={`absolute z-10 origin-top transition-all duration-2000 ease-in-out ${
            opened
              ? "pointer-events-none -translate-y-full opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          <img
            alt=""
            aria-hidden
            src={ASSET.introBgLid}
            className=" max-w-none object-cover"
            style={{ width: "100%" }}
          />
          <div
            className="absolute w-full top-[35%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-center leading-[1.1]"
            style={{
              fontFamily: FONT.filmotype,
              fontSize: "68px",
              color: COLOR.text,
              filter: EFFECT.innerShadow,
            }}
          >
            <Editable field="names.en" label="영문 이름">
              <p>
                {bride.en} <span style={{ fontSize: "3rem" }}>&</span>
              </p>
              <p>{groom.en}</p>
            </Editable>
          </div>
        </div>

        {/* 편지 봉투 몸통 — 뚜껑이 열린 뒤(딜레이) 아래로 내려감 */}
        <div
          className={`absolute bottom-0 w-full h-full z-9 transition-transform duration-2500 delay-1000 ease-in-out ${
            opened ? "translate-y-[95%]" : "translate-y-0"
          }`}
        >
          <img
            alt=""
            aria-hidden
            src={ASSET.introPocket}
            className="max-w-none object-cover "
            style={{ width: "100%" }}
          />
          {/* save the date */}
          <div className="absolute left-1/2 top-[65%] -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center">
            <img src={ASSET.introDeco} alt="" className="mb-6" />
            <p
              style={{
                fontFamily: FONT.roaming,
                color: COLOR.label,
                fontSize: "16px",
              }}
            >
              Save the Date
            </p>
            <Editable
              as="p"
              field="schedule"
              label="예식 일시"
              style={{
                fontFamily: FONT.maltiner,
                fontSize: "68px",
                color: COLOR.text,
                filter: EFFECT.innerShadow,
              }}
            >
              {bigDate}
            </Editable>
            <img src={ASSET.introDeco} alt="" className="rotate-180 mb-3" />

            {/* date and venue */}
            <div className="text-center mt-4">
              <Editable
                as="p"
                field="schedule"
                label="예식 일시"
                style={{ fontFamily: FONT.pretendard, color: COLOR.muted }}
              >
                {schedule.dateKo}
              </Editable>
              <Editable
                as="p"
                field="venue"
                label="예식 장소"
                style={{ fontFamily: FONT.pretendard, color: COLOR.muted }}
              >
                {venue.name}
              </Editable>

              <Editable
                as="p"
                field="schedule"
                label="예식 일시"
                className="mt-4"
                style={{ fontFamily: FONT.roaming, color: COLOR.muted }}
              >
                {schedule.dateEn}
              </Editable>
            </div>
          </div>
        </div>

        {/* 편지지 — 봉투와 같은 시점에 아래로 내려감 */}
        <div
          className={`absolute w-full h-103 top-0 left-1/2 -translate-x-1/2 z-8 ${
            opened ? styles.letterDipRise : "translate-y-[40%]"
          }`}
        >
          <img
            alt=""
            aria-hidden
            className="absolute max-w-none object-cover"
            src={ASSET.introLetter}
            style={{ width: "100%" }}
          />
          <div className="absolute w-full h-full top-5 left-0 flex flex-col items-center justify-center text-center px-6 gap-4">
            <Editable
              as="p"
              field="greeting"
              label="인사말"
              style={{ color: "#99958F", fontSize: "13px" }}
            >
              {greeting.intro.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </Editable>
            <Editable
              as="p"
              field="greeting"
              label="인사말"
              style={{ color: COLOR.muted, fontSize: "15px" }}
            >
              {greeting.blessing.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </Editable>

            <Editable
              as="p"
              field="names.ko"
              label="국문 이름"
              className="flex items-center justify-center gap-[6px]"
              style={{
                fontFamily: FONT.pretendard,
                fontSize: 14,
                marginTop: 18,
                color: COLOR.muted,
              }}
            >
              <span>신랑 {groom.ko}</span>
              <img src={ASSET.introDecoHeart} alt="" />
              <span>신부 {bride.ko}</span>
            </Editable>
            <Editable
              as="p"
              field="greeting"
              label="인사말"
              style={{ fontFamily: FONT.altesse, color: "#99958F" }}
            >
              We would be delighted to have you join us <br /> in celebrating
              our love and the beginning of our forever.
            </Editable>
          </div>
        </div>

        {/* 편지 봉투 뒷 배경 */}
        <img
          alt=""
          aria-hidden
          src={ASSET.introBack}
          className={`absolute left-0 max-w-none object-cover z-6 transition-all duration-2500 delay-1000 ease-in-out ${
            opened ? "top-[90%]" : "top-[-15%]"
          }`}
          style={{ width: "100%" }}
        />
      </div>

      {/* 탭 안내 — 열리기 전에만, 클릭은 섹션이 받도록 pointer-events 없음 */}
      {!opened && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center"
        >
          <span
            className="animate-pulse tracking-[0.3em]"
            style={{
              fontFamily: FONT.pretendard,
              fontSize: 12,
              color: COLOR.muted,
            }}
          >봉투를 클릭해주세요
          </span>
        </div>
      )}
    </section>
  );
}

export default CoverSection;
