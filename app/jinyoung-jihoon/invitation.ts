/* -------------------------------------------------------------------------- */
/*  진영 ♥ 지훈 청첩장 데이터                                                    */
/*                                                                             */
/*  기본값은 dearly-frontend 의 SAMPLE_INVITATION (이미 진영·지훈 정보로 작성됨).  */
/*  문구·사진·계좌 등을 수정할 때는 여기서 필드를 덮어쓰면 된다.                    */
/*  방명록(guestbook)은 page.tsx 에서 Supabase 데이터로 채워지므로 여기 값은        */
/*  사용되지 않는다.                                                            */
/* -------------------------------------------------------------------------- */

import { SAMPLE_INVITATION } from "@/templates/season1/constant/sample-invitation";
import type { InvitationData } from "@/templates/shared/model/invitation";

/* 갤러리(앨범) 사진 — public/assets/templates/gallery 의 이미지를 이름 순서대로 */
const GALLERY_BASE = "/assets/templates/gallery";

const GALLERY_PHOTOS = [
  "1.JPG",
  "2.JPG",
  "3.JPG",
  "4.JPG",
  "5.JPG",
  "6.JPG",
  "7.JPG",
  "8.JPG",
  "9.JPG",
  "10.JPG",
  "11.JPG",
  "12.JPG",
  "13.JPG",
  "s1.jpeg",
  "s2.jpeg",
  "s3.jpg",
  "s4.jpeg",
  "s5.jpeg",
  "s6.jpeg",
  "s7.jpg",
  "s8.jpeg",
  "s9.jpg",
  "s10.jpg",
  "s11.JPG",
  "s12.JPG",
].map((name) => `${GALLERY_BASE}/${name}`);

export const INVITATION: InvitationData = {
  ...SAMPLE_INVITATION,
  /* 축하 연락하기 — 양가 부모님 연락처 */
  groom: {
    ...SAMPLE_INVITATION.groom,
    parents: {
      ...SAMPLE_INVITATION.groom.parents,
      fatherPhone: "010-6799-0192",
      motherPhone: "010-3382-3614",
    },
  },
  bride: {
    ...SAMPLE_INVITATION.bride,
    parents: {
      ...SAMPLE_INVITATION.bride.parents,
      fatherPhone: "010-9366-4954",
      motherPhone: "010-9198-4954",
    },
  },
  gallery: { photos: GALLERY_PHOTOS },
  guestbook: { messages: [] },
};
