'use client';

import { useState } from 'react';
import CopyButton from '../CopyButton';
import { imgGiftHeader, imgAngelIcon, imgChevron } from './assets';

type AccountItemProps = {
    label: string;
    name: string;
    bank: string;
    account: string;
};

function AccountItem({ label, name, bank, account }: AccountItemProps) {
    return (
        <div className="flex flex-col gap-[20px]">
            <div className="flex justify-between items-center text-[14px] font-medium tracking-[-0.56px]">
                <span>{label}</span>
                <span>{name}</span>
            </div>
            <div className="bg-white rounded-[8px] p-[20px]">
                <div className="flex flex-col gap-[4px]">
                    <div className="flex justify-between items-center h-[20px]">
                        <span className="text-[#99958f] text-[14px] tracking-[-0.56px]">{bank}</span>
                        <CopyButton text={account} />
                    </div>
                    <div className="flex items-center py-[5px]">
                        <p className="flex-1 text-[14px] text-black tracking-[-0.56px]">{account}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

type AccordionProps = {
    label: string;
    open: boolean;
    onToggle: () => void;
    children: React.ReactNode;
};

function Accordion({ label, open, onToggle, children }: AccordionProps) {
    return (
        <div className="w-full shadow-[2px_2px_4px_0px_rgba(0,0,0,0.15)] rounded-[10px]">
            <button
                type="button"
                onClick={onToggle}
                className={`flex items-center justify-between bg-white h-[50px] px-5 w-full shadow-[0px_0px_2px_0px_rgba(0,0,0,0.15)] ${open ? 'rounded-t-[10px]' : 'rounded-[10px]'}`}
            >
                <span className="text-black text-[15px] font-medium tracking-[-0.6px]">{label}</span>
                <img
                    src={imgChevron}
                    alt=""
                    className={`w-[7px] h-[15px] transition-transform duration-300 ${open ? '-rotate-90' : 'rotate-90'}`}
                />
            </button>
            {/* grid 트릭으로 높이 애니메이션 */}
            <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <div className="bg-[#f7f1e3] rounded-b-[10px] px-[10px] py-[30px] flex flex-col gap-[30px]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function GiftSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => setOpenIndex(prev => prev === index ? null : index);

    return (
        <section className="bg-[#fffbf1] flex flex-col items-center px-12 py-12 gap-5">
            <img
                src={imgGiftHeader}
                alt="Sent with all our love and heartfelt sincerity"
                className="h-12 w-auto"
            />
            <div className="flex items-center justify-center w-[150px] h-[150px]">
                <img src={imgAngelIcon} alt="" className="h-[141px] w-auto" />
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
                <p className="text-black text-[16px] font-medium tracking-[-0.64px]">마음 전하실 곳</p>
                <p className="text-[#99958f] text-[15px] leading-relaxed tracking-[-0.6px] whitespace-pre-line">
                    {`참석이 어려우신 분들을 위해 기재하오니\n너그러운 마음으로 양해 부탁드립니다.`}
                </p>
            </div>

            <div className="flex flex-col gap-2.5 w-full">
                <Accordion label="신랑측" open={openIndex === 0} onToggle={() => toggle(0)}>
                    <AccountItem label="신랑" name="손재환" bank="우리은행" account="1002-939-574815" />
                    <AccountItem label="신랑 부" name="손세호" bank="기업은행" account="080-011878-02-030" />
                    <AccountItem label="신랑 모" name="이은정" bank="기업은행" account="484-003282-01-019" />
                </Accordion>
                <Accordion label="신부측" open={openIndex === 1} onToggle={() => toggle(1)}>
                    <AccountItem label="신부" name="김혜빈" bank="국민은행" account="611602-04-123103" />
                    <AccountItem label="신부 부" name="김철규" bank="농협" account="754-02-015598" />
                    <AccountItem label="신부 모" name="권영희" bank="기업은행" account="484-003282-01-019" />
                </Accordion>
            </div>

            <p
                className="text-[#99958f] text-[14px] text-center leading-relaxed whitespace-pre-line"
                style={{ fontFamily: "'Badoney', cursive" }}
            >
                {`We are truly grateful for your warm \nand heartfelt kindness`}
            </p>
        </section>
    );
}
