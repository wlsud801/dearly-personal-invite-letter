/* -------------------------------------------------------------------------- */
/*  MapButton — shared map-app launch button                                   */
/*  Icons are fixed per provider (brand logos, identical across templates);    */
/*  visual style is supplied by each template via `className`.                 */
/* -------------------------------------------------------------------------- */

import type { MapProvider } from "../lib/actions";

const MAP_ICON: Record<MapProvider, string> = {
  naver: "/assets/images/icons/naver-map.svg",
  tmap: "/assets/images/icons/t-map.svg",
};

type MapButtonProps = {
  provider: MapProvider;
  label: string;
  onClick: () => void;
  /** template-specific button style */
  className?: string;
  /** template-specific icon style */
  iconClassName?: string;
};

export function MapButton({
  provider,
  label,
  onClick,
  className = "",
  iconClassName = "size-5 object-contain",
}: MapButtonProps) {
  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
      <img src={MAP_ICON[provider]} alt="" aria-hidden className={iconClassName} />
    </button>
  );
}
