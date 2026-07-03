"use client";

/* -------------------------------------------------------------------------- */
/*  brown-lace — BGM 토글 버튼 (좌측 상단)                                       */
/*                                                                             */
/*  RSVP 씰과 짝을 이루는 프레임 고정 플로팅 버튼. 표지(cover) 모션이 끝난 뒤       */
/*  좌측 상단에 페이드인된다. 오디오는 첫 탭에서 생성/재생(luop) — 4MB WAV 를      */
/*  초기 로드에 미리 받지 않기 위해서다. 자동재생은 브라우저 정책상 불가하므로      */
/*  항상 사용자 탭으로 시작한다.                                                 */
/* -------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";
import { MusicToggle } from "@/templates/shared";
import { useIntro } from "./intro-context";
import { COLOR } from "./theme";

const BGM_SRC = "/bgm/NewZhilla_Be-My-Valentine_loop-01.wav";

export function MusicButton() {
  const { coverDone } = useIntro();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 언마운트 시 재생 정지 (페이지 전환 후 소리만 남는 것 방지)
  useEffect(
    () => () => {
      audioRef.current?.pause();
    },
    [],
  );

  const toggle = () => {
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio(BGM_SRC);
      audio.loop = true;
      audioRef.current = audio;
    }
    if (audio.paused) {
      void audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <MusicToggle
      isPlaying={isPlaying}
      onToggle={toggle}
      playingColor={COLOR.text}
      pausedColor={COLOR.text}
      className={`absolute left-4 top-4 z-40 flex size-9 items-center justify-center rounded-full bg-[#3A312A]/45 shadow backdrop-blur-sm transition-all duration-700 ease-out ${
        coverDone ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    />
  );
}
