export const dynamic = "force-dynamic";

import BrownLaceTemplate from "@/templates/season1/brown-lace";
import type { InvitationData } from "@/templates/shared/model/invitation";
import type { Metadata } from "next";
import { getMessages } from "./actions";
import { INVITATION } from "./invitation";

export const metadata: Metadata = {
  title: "진영 ❤️ 지훈 결혼합니다.",
  description: "따뜻한 가을의 문턱에서, 저희의 첫걸음을 함께 축복해 주세요.",
  openGraph: {
    title: "진영 ❤️ 지훈 결혼합니다.",
    description: "따뜻한 가을의 문턱에서, 저희의 첫걸음을 함께 축복해 주세요.",
  },
};

export default async function Page() {
  const messages = await getMessages();

  const data: InvitationData = {
    ...INVITATION,
    guestbook: {
      messages: messages.map((m) => ({
        id: m.id,
        text: m.text,
        from: m.from_name,
        // 비밀번호를 설정한 메시지만 삭제(X) 노출 — 비밀번호 자체는 클라이언트로 보내지 않는다
        mine: !!m.password,
      })),
    },
  };

  return (
    <div className="h-dvh w-full">
      <BrownLaceTemplate data={data} scrollMode="horizontal" />
    </div>
  );
}
