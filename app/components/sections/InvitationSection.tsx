import { imgInviteLeft, imgInviteRight, imgHeartIcon } from './assets';

export default function InvitationSection() {
    return (
        <section id="invitation-section" className="bg-[#f8f5f0] flex flex-col items-center px-8 py-12 gap-5">
            {/* INVITATION 헤더 */}
            <div className="flex items-center gap-3 px-2.5">
                <img src={imgInviteLeft} alt="" className="h-[65px] w-[48px]" />
                <span className="text-[#99958f] text-[30px] tracking-wide" style={{ fontFamily: "'Soluga', serif" }}>
                    INVITATION
                </span>
                <img src={imgInviteRight} alt="" className="h-[66px] w-[48px]" />
            </div>

            {/* 청첩 본문 */}
            <div className="flex flex-col items-center w-full">
                <div className="px-6 py-5 text-center">
                    <p className="text-[#99958f] text-[15px] leading-relaxed tracking-[-0.6px] whitespace-pre-line">
                        {`평생을 함께하고 싶은\n사람을 만났습니다.\n서로를 아껴주고 사랑하며 살겠습니다.`}
                    </p>
                </div>
                <div className="px-6 py-5 text-center">
                    <p className="text-black text-[16px] leading-relaxed tracking-[-0.64px] whitespace-pre-line font-medium">
                        {`우리 약속 위에\n따뜻한 격려로 축복해 주셔서\n힘찬 출발의 디딤이 되어주십시오`}
                    </p>
                </div>

                {/* 신랑 신부 */}
                <div className="flex items-center gap-3.5 px-4 py-5">
                    <div className="flex items-center gap-1.5 text-black text-[16px] font-medium tracking-[-0.64px]">
                        <span>신랑</span>
                        <span>재환</span>
                    </div>
                    <img src={imgHeartIcon} alt="♥" className="w-[18px] h-5" />
                    <div className="flex items-center gap-1.5 text-black text-[16px] font-medium tracking-[-0.64px]">
                        <span>신부</span>
                        <span>혜빈</span>
                    </div>
                </div>
            </div>

            {/* 영문 부제 */}
            <p
                className="text-[#99958f] text-[14px] text-center leading-relaxed whitespace-pre-line"
                style={{ fontFamily: "'Badoney', cursive" }}
            >
                {`We would be delighted to have you join us \nin celebrating our love and the beginning of our forever.`}
            </p>
        </section>
    );
}
