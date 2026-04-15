'use client'

import { Copy } from "lucide-react";
import { useToast } from "./Toast";

interface CopyButtonProps {
  text: string;
  size?: number;
  className?: string;
}

export default function CopyButton({ text, size = 12, className = "text-[#99958f]" }: CopyButtonProps) {
  const [toast, toastNode] = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    toast.show("복사되었습니다");
  };

  return (
    <>
      <button type="button" onClick={handleCopy} className="p-1 active:opacity-70">
        <Copy size={size} className={className} />
      </button>
      {toastNode}
    </>
  );
}
