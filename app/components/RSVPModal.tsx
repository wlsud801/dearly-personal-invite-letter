'use client';

import { useActionState, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Modal from './Modal';
import { submitRSVP } from '@/app/actions/rsvp';

type Props = { onClose: () => void };

type ToggleGroupProps = {
    name: string;
    options: { label: string; value: string }[];
    value: string;
    onChange: (v: string) => void;
};

function ToggleGroup({ name, options, value, onChange }: ToggleGroupProps) {
    return (
        <div className="flex gap-[10px] w-full">
            {options.map((opt) => {
                const selected = value === opt.value;
                return (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={`flex-1 py-4 rounded-[8px] text-[14px] font-medium tracking-[-0.56px] transition-colors ${
                            selected
                                ? 'bg-[#2c4221] text-white'
                                : 'border border-[#2c4221] text-[#2c4221] bg-transparent'
                        }`}
                    >
                        {opt.label}
                    </button>
                );
            })}
            {/* hidden inputs for form submission */}
            <input type="hidden" name={name} value={value} />
        </div>
    );
}

export default function RSVPModal({ onClose }: Props) {
    const [state, formAction, pending] = useActionState(submitRSVP, null);

    const [side, setSide] = useState('신랑측');
    const [attendance, setAttendance] = useState('참석');
    const [meal, setMeal] = useState('식사예정');

    useEffect(() => {
        if (state?.success) onClose();
    }, [state, onClose]);

    return (
        <Modal onClose={onClose}>
            <div className="relative bg-[#fffbf1] flex flex-col w-[calc(100vw-48px)] max-w-[402px] max-h-[90vh] overflow-y-auto rounded-[10px] shadow-[0px_4px_30px_0px_rgba(0,0,0,0.25)]">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 text-[#99958f] active:opacity-70 z-10"
                >
                    <X size={20} />
                </button>

                <form action={formAction} className="flex flex-col gap-[30px] items-center p-12 w-full">
                    {/* 헤더 */}
                    <div className="flex flex-col items-center">
                        <p className="text-black text-[16px] font-medium tracking-[-0.64px] text-center py-5">
                            참석여부 전달하기
                        </p>
                        <p className="text-[#99958f] text-[15px] tracking-[-0.6px] text-center py-5">
                            참석 여부를 알려주시면 참고하겠습니다.
                        </p>
                    </div>

                    <div className="flex flex-col gap-[40px] w-full">
                        {/* 신랑측 / 신부측 */}
                        <ToggleGroup
                            name="side"
                            options={[
                                { label: '신랑측', value: '신랑측' },
                                { label: '신부측', value: '신부측' },
                            ]}
                            value={side}
                            onChange={setSide}
                        />

                        {/* 입력 필드 */}
                        <div className="flex flex-col gap-[6px] w-full">
                            <input
                                name="name"
                                type="text"
                                placeholder="성함"
                                required
                                maxLength={20}
                                className="w-full border border-[#dadcbe] rounded-[8px] px-[10px] py-[14px] text-[14px] text-black placeholder:text-[#99958f] tracking-[-0.56px] outline-none focus:border-[#2c4221] bg-transparent"
                            />
                            <input
                                name="phone"
                                type="tel"
                                placeholder="전화번호"
                                required
                                maxLength={20}
                                className="w-full border border-[#dadcbe] rounded-[8px] px-[10px] py-[14px] text-[14px] text-black placeholder:text-[#99958f] tracking-[-0.56px] outline-none focus:border-[#2c4221] bg-transparent"
                            />
                            <input
                                name="headcount"
                                type="number"
                                placeholder="총 인원"
                                required
                                min={1}
                                max={99}
                                className="w-full border border-[#dadcbe] rounded-[8px] px-[10px] py-[14px] text-[14px] text-black placeholder:text-[#99958f] tracking-[-0.56px] outline-none focus:border-[#2c4221] bg-transparent"
                            />
                        </div>

                        {/* 참석 여부 / 식사 여부 */}
                        <div className="flex flex-col gap-[10px] w-full">
                            <ToggleGroup
                                name="attendance"
                                options={[
                                    { label: '참석', value: '참석' },
                                    { label: '불참석', value: '불참석' },
                                ]}
                                value={attendance}
                                onChange={setAttendance}
                            />
                            <ToggleGroup
                                name="meal"
                                options={[
                                    { label: '식사예정', value: '식사예정' },
                                    { label: '불참석', value: '불참석' },
                                ]}
                                value={meal}
                                onChange={setMeal}
                            />
                        </div>

                        {/* 에러 메세지 */}
                        {state?.error && <p className="text-red-400 text-[13px] text-center">{state.error}</p>}

                        {/* 제출 버튼 */}
                        <button
                            type="submit"
                            disabled={pending}
                            className="w-full h-[50px] bg-[#d0bfa8] rounded-[8px] text-white text-[14px] font-medium tracking-[-0.56px] disabled:opacity-60 active:opacity-80"
                        >
                            {pending ? '전송 중...' : '참석 여부 전달하기'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
