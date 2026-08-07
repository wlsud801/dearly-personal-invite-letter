/* -------------------------------------------------------------------------- */
/*  InvitationData — single content model shared by every template             */
/*  Serializable (dates are ISO strings, multiline text is string[]) so the    */
/*  same shape works for sample data, backend data, and editor drafts.         */
/* -------------------------------------------------------------------------- */

export type Parents = {
  father: string;
  mother: string;
  /** 자녀와의 관계 표기 (예: 장남, 차녀) */
  role: string;
  /** 고인 여부 */
  fatherDeceased?: boolean;
  motherDeceased?: boolean;
  fatherPhone?: string;
  motherPhone?: string;
};

export type Person = {
  ko: string;
  en: string;
  parents: Parents;
  phone?: string;
  /** 표지 폴라로이드용 인물 사진 (없으면 템플릿이 프레임 아트로 폴백) */
  photo?: string;
};

export type AccountRow = {
  role: string;
  name: string;
  bank: string;
  number: string;
};

export type AccountGroup = {
  label: string;
  rows: AccountRow[];
};

export type GuestMessage = {
  text: string;
  from: string;
  /** 현재 사용자가 작성한 글인지 — true 일 때만 삭제(X) 가능. 백엔드가 세팅. */
  mine?: boolean;
  /** 삭제 등 서버 액션 호출에 쓰는 메시지 id. 백엔드가 세팅. */
  id?: string;
};

export type TransportItem = {
  head: string;
  sub: string;
};

export type TransportGroup = {
  title: string;
  items: TransportItem[];
};

export type InvitationData = {
  groom: Person;
  bride: Person;

  schedule: {
    /** ISO date string — parse with `new Date()` at render time */
    weddingDate: string;
    /** 표지용 짧은 표기 (예: "2026. 05. 31") */
    dateLabel: string;
    dateKo: string;
    dateEn: string;
  };

  /** 멀티라인 문구는 string[] — 한 배열이 한 편집 단위 */
  greeting: { intro: string[]; blessing: string[]; closingEn: string[] };
  reception: {
    title: string;
    body: string[];
    /** 피로연 일자 (ISO, 날짜) — 빅 표기(YYYY.MM.DD). 비우면 날짜 생략 */
    date?: string;
    /** 요일·시간 표기 (예: "금요일ㅣ오후 5시 - 8시") */
    dateDetail?: string;
    /** 장소명 (예: "남서울 웨딩홀 3층 연회장") — call 아이콘 */
    placeName?: string;
    /** 장소 전화번호 (call) */
    placeTel?: string;
    /** 주소 — copy 아이콘 */
    address?: string;
  };
  flower: { title: string; body: string[] };

  gallery: { photos: string[] };
  guestbook: { messages: GuestMessage[] };
  fullImage: { image: string; quoteEn: string[] };

  venue: {
    name: string;
    address: string;
    /** 좌표(WGS84) — 지정하면 지도 렌더 시 지오코딩 API 호출을 건너뛴다 */
    lat?: number;
    lng?: number;
    tel?: string;
    addressDetail?: string;
    transport: TransportGroup[];
  };
  accounts: { groom: AccountGroup; bride: AccountGroup };
  share: {
    rsvpQuoteEn: string[];
    /** 마무리 감사 인사 — 문단별 배열(한 문단 = 줄 배열). greeting 과 동일 형태 */
    thanks: string[][];
  };
};
