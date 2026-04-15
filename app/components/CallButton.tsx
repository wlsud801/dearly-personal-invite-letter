'use client'

import { Phone } from 'lucide-react';

interface CallButtonProps {
  phone: string;
  size?: number;
  className?: string;
}

export default function CallButton({ phone, size = 12, className = 'text-black' }: CallButtonProps) {
  return (
    <a href={`tel:${phone}`} className="p-1 active:opacity-70">
      <Phone size={size} className={className} />
    </a>
  );
}
