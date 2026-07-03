/* -------------------------------------------------------------------------- */
/*  MusicToggle — shared BGM play/pause toggle button                          */
/*  Icon/shape is identical across templates; stroke colors are supplied per   */
/*  template (playing vs paused), and `className` overrides placement/shape.   */
/* -------------------------------------------------------------------------- */

type MusicToggleProps = {
  isPlaying: boolean;
  onToggle: () => void;
  /** stroke color while playing (template accent) */
  playingColor: string;
  /** stroke color while paused (template muted) */
  pausedColor: string;
  /** template-specific placement/shape style */
  className?: string;
};

export function MusicToggle({
  isPlaying,
  onToggle,
  playingColor,
  pausedColor,
  className = "absolute top-4 left-4 z-50 w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm shadow flex items-center justify-center",
}: MusicToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={className}
      aria-label={isPlaying ? "음악 끄기" : "음악 켜기"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke={isPlaying ? playingColor : pausedColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
        {!isPlaying && (
          <line x1="2" y1="2" x2="22" y2="22" stroke={pausedColor} strokeWidth="2" />
        )}
      </svg>
    </button>
  );
}
