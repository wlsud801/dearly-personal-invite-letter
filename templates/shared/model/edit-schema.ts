/* -------------------------------------------------------------------------- */
/*  Edit schema — clickable 편집 영역(FieldKey) ↔ 편집 다이얼로그 정의          */
/*                                                                             */
/*  템플릿 섹션은 <Editable field="..."> 로 편집 영역을 표시하고, 에디터는      */
/*  여기 정의된 FieldKey 로 어떤 다이얼로그(제목/입력 필드)를 띄울지 결정한다.   */
/*  모든 path 는 InvitationData 기준 — 추후 백엔드 연동 시 동일 경로로 매핑.     */
/* -------------------------------------------------------------------------- */

import type { InvitationData } from "./invitation";

/** 편집 다이얼로그를 여는 클릭 영역 키 (Figma 268:14355 input/box 들과 1:1) */
export type FieldKey =
  | "names.en" // 신랑/신부 영문 이름
  | "names.ko" // 신랑/신부 국문 이름
  | "cover.photos" // 표지 폴라로이드 사진
  | "parents.groom" // 신랑 혼주 정보
  | "parents.bride" // 신부 혼주 정보
  | "schedule" // 예식 일시
  | "greeting" // 인사말
  | "venue" // 장소 이름/주소
  | "venue.transport" // 교통편
  | "accounts.groom" // 신랑측 계좌
  | "accounts.bride" // 신부측 계좌
  | "gallery" // 앨범 사진
  | "guestbook" // 방명록
  | "reception" // 피로연 안내
  | "flower" // 화환 안내
  | "fullImage" // 풀 이미지
  | "share" // 공유 문구
  | "share.thanks"; // 마무리 감사 인사

/** 단순 스칼라/멀티라인/날짜(+시간)/이미지 입력 한 줄 */
export type FieldType =
  | "text"
  | "tel"
  | "multiline"
  | "date"
  | "datetime"
  | "image";

export type FieldSpec = {
  label: string;
  type: FieldType;
  /** InvitationData 기준 dot-path (배열은 숫자 인덱스, 예: "venue.transport.0.title") */
  path: string;
  placeholder?: string;
  /** 입력 아래 도움말 (예: "예) 라루체 웨딩") */
  description?: string;
  /** datetime 전용 — 시간 선택 행의 라벨 (기본 "결혼식 시간") */
  timeLabel?: string;
};

/** 복잡한(가변 길이) 그룹은 전용 에디터 컴포넌트로 렌더 */
export type CustomEditorKind =
  | "accounts"
  | "transport"
  | "guestbook"
  | "gallery"
  | "parents"
  | "greeting"
  | "thanks";

export type EditDialogDef = {
  title: string;
  /** 일반 필드 목록 (custom 이 있으면 무시) */
  fields?: FieldSpec[];
  /** 전용 에디터 종류 + 대상 path */
  custom?: { kind: CustomEditorKind; path: string };
};

export const EDIT_DIALOGS: Record<FieldKey, EditDialogDef> = {
  "names.en": {
    title: "영문 이름",
    fields: [
      { label: "신랑 영문 이름", type: "text", path: "groom.en" },
      { label: "신부 영문 이름", type: "text", path: "bride.en" },
    ],
  },
  "names.ko": {
    title: "국문 이름",
    fields: [
      { label: "신랑 국문 이름", type: "text", path: "groom.ko" },
      { label: "신부 국문 이름", type: "text", path: "bride.ko" },
    ],
  },
  "cover.photos": {
    title: "표지 사진",
    fields: [
      { label: "신랑 사진", type: "image", path: "groom.photo" },
      { label: "신부 사진", type: "image", path: "bride.photo" },
    ],
  },
  "parents.groom": {
    title: "신랑 혼주 정보",
    custom: { kind: "parents", path: "groom.parents" },
  },
  "parents.bride": {
    title: "신부 혼주 정보",
    custom: { kind: "parents", path: "bride.parents" },
  },
  schedule: {
    title: "예식 일시",
    fields: [
      {
        label: "결혼식 일자",
        type: "datetime",
        timeLabel: "결혼식 시간",
        path: "schedule.weddingDate",
      },
      {
        label: "결혼식 장소 이름",
        type: "text",
        path: "venue.name",
        placeholder: "결혼식 장소의 이름을 입력해주세요.",
      },
    ],
  },
  greeting: {
    title: "인사말",
    custom: { kind: "greeting", path: "greeting" },
  },
  venue: {
    title: "예식 장소",
    fields: [
      {
        label: "결혼식 장소 이름",
        type: "text",
        path: "venue.name",
        placeholder: "결혼식 장소의 이름을 입력해주세요.",
      },
      {
        label: "결혼식 장소 전화번호",
        type: "tel",
        path: "venue.tel",
        placeholder: "결혼식 장소 전화번호를 입력해주세요.",
      },
      {
        label: "결혼식 장소 주소",
        type: "text",
        path: "venue.address",
        placeholder: "결혼식 장소의 주소를 입력해주세요.",
      },
      {
        label: "결혼식 상세 주소",
        type: "text",
        path: "venue.addressDetail",
        placeholder: "결혼식 장소 상세 주소를 입력해주세요.",
      },
    ],
  },
  "venue.transport": {
    title: "교통편 안내",
    custom: { kind: "transport", path: "venue.transport" },
  },
  "accounts.groom": {
    title: "신랑측 계좌",
    custom: { kind: "accounts", path: "accounts.groom" },
  },
  "accounts.bride": {
    title: "신부측 계좌",
    custom: { kind: "accounts", path: "accounts.bride" },
  },
  gallery: {
    title: "앨범 사진",
    custom: { kind: "gallery", path: "gallery.photos" },
  },
  guestbook: {
    title: "방명록",
    custom: { kind: "guestbook", path: "guestbook.messages" },
  },
  reception: {
    title: "피로연 안내",
    fields: [
      { label: "안내문 제목", type: "text", path: "reception.title" },
      { label: "안내문", type: "multiline", path: "reception.body" },
      { label: "피로연 일자", type: "date", path: "reception.date" },
      {
        label: "요일·시간",
        type: "text",
        path: "reception.dateDetail",
        placeholder: "예) 금요일ㅣ오후 5시 - 8시",
      },
      { label: "장소명", type: "text", path: "reception.placeName" },
      { label: "장소 전화번호", type: "tel", path: "reception.placeTel" },
      { label: "주소", type: "text", path: "reception.address" },
    ],
  },
  flower: {
    title: "화환 안내",
    fields: [
      { label: "화한 거절 안내문", type: "multiline", path: "flower.body" },
    ],
  },
  fullImage: {
    title: "풀 이미지",
    fields: [
      { label: "이미지", type: "image", path: "fullImage.image" },
      { label: "영문 문구", type: "multiline", path: "fullImage.quoteEn" },
    ],
  },
  share: {
    title: "공유 문구",
    fields: [{ label: "영문 RSVP 문구", type: "multiline", path: "share.rsvpQuoteEn" }],
  },
  "share.thanks": {
    title: "감사 인사",
    custom: { kind: "thanks", path: "share.thanks" },
  },
};

/* --------------------------- immutable path utils -------------------------- */

type AnyRecord = Record<string, unknown>;

/** dot-path 로 값 읽기 (없으면 undefined). 숫자 세그먼트는 배열 인덱스. */
export function getByPath(data: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null) return undefined;
    return (acc as AnyRecord)[key];
  }, data);
}

/** dot-path 위치에 값을 넣은 새 객체 반환 (경로 따라 얕은 복제). */
export function setByPath<T>(data: T, path: string, value: unknown): T {
  const keys = path.split(".");

  const recurse = (node: unknown, depth: number): unknown => {
    const key = keys[depth];
    const isIndex = /^\d+$/.test(key);
    const last = depth === keys.length - 1;

    if (isIndex) {
      const arr = Array.isArray(node) ? [...node] : [];
      const idx = Number(key);
      arr[idx] = last ? value : recurse(arr[idx], depth + 1);
      return arr;
    }

    const obj: AnyRecord = node && typeof node === "object" ? { ...(node as AnyRecord) } : {};
    obj[key] = last ? value : recurse(obj[key], depth + 1);
    return obj;
  };

  return recurse(data, 0) as T;
}

/** 여러 path 를 한 번에 적용 */
export function applyEdits<T>(data: T, edits: Record<string, unknown>): T {
  return Object.entries(edits).reduce(
    (acc, [path, value]) => setByPath(acc, path, value),
    data,
  );
}

/** path 가 가리키는 InvitationData 값의 타입 헬퍼(호출부 편의용) */
export type EditDraft = Record<string, unknown>;
export type { InvitationData };
