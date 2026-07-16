/* -------------------------------------------------------------------------- */
/*  brown-lace — local image asset registry                                    */
/*                                                                             */
/*  Every entry resolves to a real file in                                     */
/*  public/assets/templates/brown-lace. Decorative artwork only — all text     */
/*  (names, dates, copy) is rendered as live layers from useInvitationData().  */
/* -------------------------------------------------------------------------- */

const BASE = "/assets/templates/brown-lace";

export const ASSET = {
  // cover (intro) — 편지 봉투 열림 애니메이션
  /** 봉투 뒤판 (질감 배경) */
  introBack: `${BASE}/intro-bg-back.png`,
  /** 봉투 앞판 포켓 (상단 V 노치) */
  introPocket: `${BASE}/intro-bg.png`,
  /** 봉투 뚜껑 (레이스 삼각 플랩) — 위로 열린다 */
  introLid: `${BASE}/intro-lid.png`,
  /** 봉투에서 나타나는 편지지 (꽃 테두리) */
  introLetter: `${BASE}/intro-letter.png`,
  /** 곡선 장식 오너먼트 */
  introDeco: `${BASE}/intro-deco.svg`,
  /** 하트 장식 */
  introDecoHeart: `${BASE}/intro-deco-heart.svg`,
  /** 봉투 뚜껑 안쪽 레이어 (열림 단계용) */
  introBgLid: `${BASE}/intro-bg-lid.png`,
  /** 봉인 씰 (메탈릭 왁스 스탬프) — 우하단 이니셜 */
  introSeal: `${BASE}/intro-seal.png`,

  // greeting (인삿말)
  /** 인삿말 배경 (꽃/질감) */
  greetingBg: `${BASE}/greeting-bg.png`,
  /** 인삿말 배경 (꽃/질감) — 가로(카드) 모드용 */
  greetingBgHorizontal: `${BASE}/greeting-bg-horizontal.png`,
  /** 하트 장식 */
  decoHeart: `${BASE}/deco-heart.svg`,
  /** 구분선 */
  divide: `${BASE}/divide.svg`,
  /** 카카오 공유 버튼 */
  greetingKakaoBtn: `${BASE}/greeting-kakao-btn.svg`,
  /** 주소 복사 버튼 */
  greetingCopyBtn: `${BASE}/greeting-copy-btn.svg`,

  // people (인물 정보)
  /** 인물 섹션 배경 */
  peopleBg: `${BASE}/people-bg.png`,

  // schedule (일정/캘린더)
  /** 캘린더 레이스 프레임 */
  calendarLace: `${BASE}/calendar-lace.png`,
  /** 예식일 강조 마크 */
  calendarDate: `${BASE}/calendar-date.svg`,

  // album (앨범)
  /** 앨범 대표 이미지 프레임 */
  albumMain: `${BASE}/album-main.png`,
  /** 앨범 장식 */
  albumDeco: `${BASE}/album-deco.svg`,

  // reception (피로연 안내)
  /** 피로연 장식 */
  receptionDeco: `${BASE}/reception-deco.svg`,
  /** 피로연 레이스 상단 */
  receptionLaceTop: `${BASE}/reception-lace-top.png`,
  /** 피로연 레이스 하단 */
  receptionLaceBottom: `${BASE}/reception-lace-bottom.png`,
  /** 피로연 레이스 블록 (원본 파일명 오타 "recrption" 그대로) */
  receptionLaceBlock: `${BASE}/recrption-lace-block.png`,

  // guestbook (방명록)
  /** 방명록 장식 */
  guestDeco: `${BASE}/guest-deco.svg`,
  /** 방명록 장식 (작은 버전 — 전체보기 모달 카드용) */
  guestDecoSm: `${BASE}/guest-deco-sm.svg`,

  // venue (장소 정보)
  /** 위치 장식 */
  locationDeco: `${BASE}/location-deco.svg`,

  // account (마음 전하실 곳)
  /** 계좌 섹션 장식 */
  accountDeco: `${BASE}/account-deco.png`,

  // share (공유하기 / 마무리)
  /** 마무리 배경 — 꽃 편지지 + 봉투 앞판 합본 */
  shareBg: `${BASE}/share-bg.png`,
  /** 마무리 앞 봉투 (하단 V 노치) — 뒤 배경(peopleBg) 위에 앞 레이어로 깐다 */
  endBgFront: `${BASE}/end-bg-front.png`,

  // thanks (감사장 — 감사장 모드 전용 페이지)
  /** 크림 편지지 배경 — 레이스 프레임 + 타원 사진 창 (Figma 에선 상하 반전 배치) */
  thankyouBg: `${BASE}/thankyou-bg.png`,
  // 하단 봉투 V 플랩은 share 섹션의 endBgFront 를 공용으로 사용한다.

  // rsvp (참석 의사 — 표지 모션 종료 후 우측 하단 플로팅 씰 버튼)
  /** RSVP 왁스 씰 버튼 */
  rsvp: `${BASE}/rsvp.png`,

  // shared buttons (공용 버튼)
  /** 채움형 버튼 */
  button: `${BASE}/button.svg`,
  /** 라인형 버튼 */
  lineButton: `${BASE}/line-button.svg`,
} as const;

export type AssetKey = keyof typeof ASSET;
