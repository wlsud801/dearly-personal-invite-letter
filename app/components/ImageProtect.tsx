'use client';

import { useEffect } from 'react';

export default function ImageProtect() {
  useEffect(() => {
    const prevent = (e: Event) => {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', prevent);
    document.addEventListener('dragstart', prevent);

    return () => {
      document.removeEventListener('contextmenu', prevent);
      document.removeEventListener('dragstart', prevent);
    };
  }, []);

  return null;
}
