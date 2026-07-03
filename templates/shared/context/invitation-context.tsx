"use client";

/* -------------------------------------------------------------------------- */
/*  InvitationProvider — feeds data + mode to template sections                */
/*  view 모드는 그냥 렌더, edit 모드(추후 (c))는 editor 훅으로 편집 연결        */
/* -------------------------------------------------------------------------- */

import { createContext, useContext } from "react";
import type { InvitationData } from "../model/invitation";

export type InvitationMode = "view" | "edit";

/** edit 모드에서만 주입 — <Editable>가 클릭 시 호출 ((c) 단계에서 사용) */
export type InvitationEditor = {
  onEditField: (field: string, anchor: HTMLElement) => void;
};

type InvitationContextValue = {
  data: InvitationData;
  mode: InvitationMode;
  editor?: InvitationEditor;
};

const InvitationContext = createContext<InvitationContextValue | null>(null);

export function InvitationProvider({
  data,
  mode = "view",
  editor,
  children,
}: {
  data: InvitationData;
  mode?: InvitationMode;
  editor?: InvitationEditor;
  children: React.ReactNode;
}) {
  return (
    <InvitationContext.Provider value={{ data, mode, editor }}>
      {children}
    </InvitationContext.Provider>
  );
}

export function useInvitation(): InvitationContextValue {
  const ctx = useContext(InvitationContext);
  if (!ctx) {
    throw new Error("useInvitation must be used within <InvitationProvider>");
  }
  return ctx;
}

/** convenience: data만 필요할 때 */
export function useInvitationData(): InvitationData {
  return useInvitation().data;
}
