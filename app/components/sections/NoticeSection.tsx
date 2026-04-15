import CallButton from '../CallButton';
import CopyButton from '../CopyButton';
import { imgPiroyeonHeader, imgPiroyeonFrame, imgPiroyeonDot, imgLineDivider } from './assets';

export default function NoticeSection() {
    return (
        <section className="bg-[#fffcf5] flex flex-col items-center px-4 py-12 gap-5">
            <img
                src={'/images/notice/notice_arch_text.svg'}
                alt="Sent with all our love and heartfelt sincerity"
                className="h-12 w-auto"
            />

            {/* 피로연 안내 프레임 */}
            <div className="relative w-full flex items-center justify-center">
                <img src={'/images/notice/notice_art_frame.svg'} alt="" className="w-full object-contain" />
                <div className="absolute inset-0 flex flex-col items-center justify-center px-8 pt-10 pb-6 gap-4 text-center">
                    <p className="text-black text-[16px] font-medium tracking-[-0.64px]">신부측 피로연 안내</p>
                    <p className="text-[#99958f] text-[15px] leading-relaxed tracking-[-0.6px] break-keep">
                        거리가 멀어 예식에 참석하지 못하시는 분들을 위해 작은 식사자리를 마련하였습니다. 오셔서 축복해
                        주시면 더없는 기쁨이겠습니다.
                    </p>
                </div>
            </div>

            {/* 날짜 · 장소 */}
            <div className="flex flex-col items-center gap-1 w-full">
                <div className="py-2">
                    <img src={'/images/components/dot-line.svg'} alt="" className="w-full object-contain" />
                </div>
                <div className="flex items-end gap-1 py-3 " style={{ fontFamily: "'Soluga', serif" }}>
                    {(['05', '.', '15', '.', '2026'] as const).map((val, i) => (
                        <span
                            key={i}
                            className={`text-[#4b3a2a] tracking-widest ${
                                val === '.' ? 'text-[37px] font-serif' : 'text-[28px]'
                            }`}
                        >
                            {val}
                        </span>
                    ))}
                </div>
                <p className="text-black text-[16px] font-medium tracking-[-0.64px] text-center">
                    금요일&nbsp;&nbsp;ㅣ&nbsp;&nbsp;오후 5시 - 8시
                </p>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-black text-[16px] font-medium tracking-[-0.64px]">
                        남서울 웨딩홀 3층 연회장
                    </span>
                    <CallButton phone="054-0000-0000" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[#99958f] text-[16px] tracking-[-0.64px]">경북 영주시 광복로 32번길 16</span>
                    <CopyButton text="경북 영주시 광복로 32번길 16" />
                </div>
            </div>

            {/* 구분선 */}
            <div className="flex items-center justify-center py-6 w-full">
                <img src={'/images/components/flower-line.svg'} alt="" className="w-[242px] object-contain" />
            </div>

            {/* 화환 안내 */}
            <div className="flex flex-col items-center gap-4 text-center">
                <p className="text-black text-[16px] font-medium tracking-[-0.64px]">화환 안내</p>
                <p className="text-[#99958f] text-[15px] leading-relaxed tracking-[-0.6px] whitespace-pre-line">
                    {`웨딩홀 내부 규정에 의하여 화환 반입이 제한되오니,\n화환은 정중히 사양합니다.`}
                </p>
            </div>
        </section>
    );
}
