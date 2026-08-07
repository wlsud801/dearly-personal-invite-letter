/* -------------------------------------------------------------------------- */
/*  Sample invitation content (UI only, no data layer)                         */
/*  Used by template previews; real screens pass fetched data of the same shape.*/
/* -------------------------------------------------------------------------- */

import type { InvitationData } from "@/templates/shared/model/invitation";

export const SAMPLE_INVITATION: InvitationData = {
  groom: {
    ko: "지훈",
    en: "Jihoon",
    parents: { father: "박유곤", mother: "김정악", role: "장남" },
    phone: "010-7422-9663",
    photo: "/assets/templates/brown-lace/sample-img-2.jpg",
  },
  bride: {
    ko: "진영",
    en: "Jinyoung",
    parents: { father: "김동춘", mother: "심은주", role: "장녀" },
    phone: "010-4773-4954",
    photo: "/assets/templates/brown-lace/sample-img.jpg",
  },

  schedule: {
    weddingDate: "2026-09-05T11:00:00+09:00",
    dateLabel: "2026. 09. 05",
    dateKo: "2026년 9월 5일 토요일 오전 11시 00분",
    dateEn: "05 September 2026, Saturday AM 11:00",
  },

  greeting: {
    intro: [
      "있는 그대로의 서로를 사랑하고,",
      "서로의 존재에 늘 감사하는 마음으로",
      "함께 같은 방향을 걸어가겠습니다.",
    ],
    blessing: [
      "그 첫걸음에 함께해 주신다면",
      "더없이 큰 기쁨으로 간직하겠습니다.",
    ],
    closingEn: [
      "We would be delighted to have you join us",
      "in celebrating our love and the beginning of our forever.",
    ],
  },

  reception: {
    title: "",
    body: [],
    date: "",
    dateDetail: "",
    placeName: "",
    placeTel: "",
    address: "",
  },

  flower: {
    title: "화환 안내",
    body: [
      "예식홀 내부 규정에 의하여",
      "화환 반입이 제한되오니,",
      "소중한 마음만 감사히 받겠습니다.",
    ],
  },

  gallery: {
    photos: [],
  },

  guestbook: {
    messages: [],
  },

  fullImage: {
    // 실제 청첩장에서는 사용자가 업로드한 커플 사진 URL이 들어감.
    // 샘플에선 공통 sample-img 세트에서 한 장 사용(비우면 sage 플레이스홀더로 폴백).
    image: "/assets/templates/brown-lace/sample-img-4.jpg",
    quoteEn: [
      "For you I have found the love of my life,",
      "and my dearest friend.",
    ],
  },

  venue: {
    name: "루클라비 더 화이트 2층 단독홀",
    address: "서울시 강남구 논현로 742",
    /* 카카오 로컬 API "루클라비더화이트" 검색 결과 좌표 */
    lat: 37.518284,
    lng: 127.029223,
    transport: [
      {
        title: "자차",
        items: [
          {
            head: "네비게이션 : 서울 강남구 논현로 742 또는 루클라비더화이트 검색",
            sub: "주차장이 협소하오니 대중교통을 이용하시는 것이 훨씬 편리합니다.",
          },
        ],
      },
      {
        title: "지하철",
        items: [{ head: "7호선 학동역 8번 출구", sub: "도보 7분" }],
      },
      {
        title: "셔틀버스",
        items: [
          {
            head: "학동역 8번 출구, 신사역 1번 출구에서 상시 운행",
            sub: "",
          },
        ],
      },
    ],
  },

  accounts: {
    groom: {
      label: "신랑측",
      rows: [
        {
          role: "신랑",
          name: "박지훈",
          bank: "신한은행",
          number: "110-562-658257",
        },
        {
          role: "신랑 모",
          name: "김정악",
          bank: "새마을금고",
          number: "9002-2062-9929-6",
        },
      ],
    },
    bride: {
      label: "신부측",
      rows: [
        {
          role: "신부",
          name: "김진영",
          bank: "국민은행",
          number: "026401-04-253740",
        },
      ],
    },
  },

  share: {
    rsvpQuoteEn: [
      "Celebrate with us as we step",
      "into our happiest moments together",
    ],
    // 바깥 배열 = 문단, 안쪽 배열 = 문단 내 줄. 문단 사이엔 렌더링 gap 이 들어간다.
    thanks: [
      ["보내주시는 따뜻한 축복과 응원에", "진심으로 감사드립니다."],
      [
        "그 마음에 보답할 수 있도록",
        "오래도록 다정한 부부로",
        "행복하게 살아가겠습니다.",
      ],
    ],
  },
};
