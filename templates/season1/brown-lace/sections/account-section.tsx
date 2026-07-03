"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — account (마음 전하실 곳 / bank-info) section                      */
/*                                                                             */
/*  Figma frame 128:40588 "bank-info", file KTCSliL9f8oNYI3Lsu9NWL.              */
/*  상/하단 레이스 띠(account-deco) 사이에 "마음 전하실 곳" + 안내문 + 신랑측/신부측  */
/*  아코디언. 각 아코디언은 계좌행(역할/이름 + 은행/번호+복사, 행 사이 하트)을        */
/*  펼쳐 보여준다. 데이터 = accounts.groom / accounts.bride.                      */
/* -------------------------------------------------------------------------- */

import {
  Editable,
  copyWithToast,
  useInvitationData,
  type AccountGroup,
  type FieldKey,
} from "@/templates/shared";
import { Accordion } from "@/components/ui/accordion";
import { Fragment } from "react";
import { Copy } from "lucide-react";
import { ASSET } from "../assets";
import { CardReveal } from "../card-reveal";
import { useIntro } from "../intro-context";
import { COLOR, FONT } from "../theme";

const base = {
  fontFamily: FONT.pretendard,
  fontSize: 14,
  lineHeight: 1.4,
  letterSpacing: "-0.02em",
  color: COLOR.text,
} as const;

function AccountRow({ row }: { row: AccountGroup["rows"][number] }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      {/* 역할 + 이름 */}
      <div className="flex w-full items-center gap-2">
        <span className="flex-1 text-left" style={{ ...base, fontWeight: 500 }}>
          {row.role}
        </span>
        <span className="whitespace-nowrap" style={{ ...base, fontWeight: 700 }}>
          {row.name}
        </span>
      </div>
      {/* 은행 + 계좌번호 + 복사 */}
      <div className="flex w-full flex-col items-start">
        <span style={{ ...base, fontWeight: 400, opacity: 0.6 }}>{row.bank}</span>
        <div className="flex w-full items-center">
          <span className="flex-1 text-left" style={{ ...base, fontWeight: 500 }}>
            {row.number}
          </span>
          <button
            type="button"
            onClick={() => void copyWithToast(row.number, "계좌번호가 복사되었습니다.")}
            aria-label={`${row.role} 계좌번호 복사`}
            className="flex size-6 items-center justify-center"
            style={{ color: COLOR.text }}
          >
            <Copy className="size-[13px]" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AccountAccordion({ group, field }: { group: AccountGroup; field: FieldKey }) {
  return (
    <Accordion
      className="w-full drop-shadow-[2px_2px_2px_rgba(0,0,0,0.15)]"
      headerClassName="rounded-t-[10px] px-3 py-2 text-[#D7CEC6]"
      header={
        <span className="flex-1 text-left" style={{ ...base, fontWeight: 700, fontSize: 16 }}>
          {group.label}
        </span>
      }
    >
      <Editable field={field} label={group.label} className="flex w-full flex-col gap-5 p-3">
        {group.rows.map((row, i) => (
          <Fragment key={i}>
            {i > 0 && <img alt="" aria-hidden src={ASSET.decoHeart} className="size-2" />}
            <AccountRow row={row} />
          </Fragment>
        ))}
      </Editable>
    </Accordion>
  );
}

export function AccountSection() {
  const { accounts } = useInvitationData();
  const { isHorizontal } = useIntro();

  return (
    <section
      aria-label="마음 전하실 곳"
      className="relative flex w-full select-none flex-col items-center overflow-hidden"
      style={{
        backgroundColor: COLOR.background,
        // 가로(카드) 모드: 카드 높이만큼 채워 상/하단 레이스 띠가 화면 위·아래에 붙게 한다.
        // 내용이 짧으면 가운데 콘텐츠가 flex-1 로 공간을 차지해 하단 띠를 바닥으로 밀고,
        // 내용이 길면 섹션이 늘어나 하단 띠가 스크롤 맨 아래에 붙는다. (100cqh = 카드 높이)
        minHeight: isHorizontal ? "100cqh" : undefined,
      }}
    >
      {/* 상단 레이스 띠 */}
      <img
        alt=""
        aria-hidden
        src={ASSET.accountDeco}
        className="w-full shrink-0 opacity-80"
      />

      {/* 가로 모드: 상/하단 레이스 띠는 두고 콘텐츠만 페이드인 */}
      <CardReveal className="flex w-full flex-1 flex-col items-center justify-start gap-4 p-5">
        {/* 타이틀 + 안내문 */}
        <div className="flex w-full flex-col items-center gap-2 text-center">
          <p style={{ ...base, fontWeight: 700, fontSize: 20 }}>마음 전하실 곳</p>
          <p style={{ ...base, fontWeight: 400, opacity: 0.6 }}>
            <span className="block">참석이 어려우신 분들을 위해 기재하오니</span>
            <span className="block">너그러운 마음으로 양해 부탁드립니다.</span>
          </p>
        </div>

        {/* 신랑측 */}
        <AccountAccordion group={accounts.groom} field="accounts.groom" />

        {/* 구분선 */}
        <div
          className="h-px w-full"
          style={{ backgroundColor: COLOR.text, opacity: 0.2 }}
        />

        {/* 신부측 */}
        <AccountAccordion group={accounts.bride} field="accounts.bride" />
      </CardReveal>

      {/* 하단 레이스 띠 */}
      <img
        alt=""
        aria-hidden
        src={ASSET.accountDeco}
        className="w-full shrink-0 -scale-y-100 opacity-80"
      />
    </section>
  );
}
