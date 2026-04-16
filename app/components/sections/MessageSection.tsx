import { getMessages } from "@/app/actions/messages";
import MessagePenButton from "../MessagePenButton";
import ScrollReveal from "../ScrollReveal";
import MessageSectionClient from "./MessageSectionClient";

export default async function MessageSection() {
  const messages = await getMessages();
  const preview = messages.slice(0, 3);

  return (
    <section className="flex flex-col items-center px-12 py-12 gap-5 relative">
      <img
        src={"/images/message/message_bg.svg"}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      <div className="relative flex flex-col gap-5 w-full items-center">
        {/* Leave your heart in a message 펜 이미지 */}
        <ScrollReveal>
          <img
            src={"/images/message/message-header.svg"}
            alt="Leave your heart in a message"
            className="w-full h-auto"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2
            className="text-[#4b3a2a] text-[36px] text-center"
            style={{ fontFamily: "'Soluga', serif" }}
          >
            Message
          </h2>
        </ScrollReveal>

        {/* 웨딩 사진 */}
        <ScrollReveal delay={0.2}>
          <div className="relative w-[278px] h-[384px]  shadow-md">
            <div className="relative w-full h-full rounded-[10px] overflow-hidden">
              <img
                src={"/images/original/hyebin_15.jpeg"}
                alt="웨딩 사진"
                className="w-full h-full object-cover"
              />
            </div>
            {/* 방명록 작성 버튼 */}
            <MessagePenButton />
          </div>
        </ScrollReveal>

        {/* 메세지 카드 미리보기 */}
        <div className="flex flex-col gap-[5px] w-full">
          {preview.map((msg, i) => (
            <ScrollReveal key={msg.id} delay={0.1 * i}>
              <div className="bg-[#fff6e2] rounded-[10px] p-5 w-full flex flex-col gap-5">
                <p className="text-black text-[14px] leading-relaxed tracking-[-0.308px] whitespace-pre-line">
                  {msg.text}
                </p>
                <p className="text-[#7a7a7a] text-[14px] leading-relaxed tracking-[-0.308px]">
                  From. {msg.from_name}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* 전체보기 버튼 + 모달 (Client) */}
        <ScrollReveal delay={0.1} className="w-full">
          <MessageSectionClient messages={messages} />
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p
            className="text-[#99958f] text-[14px] text-center leading-relaxed whitespace-pre-line"
            style={{ fontFamily: "'Badoney', cursive" }}
          >
            {`Celebrate with us as we step \ninto our happiest moments together`}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
