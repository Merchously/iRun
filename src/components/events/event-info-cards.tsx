"use client";

import { useEffect, useRef } from "react";

interface EventInfoCardsProps {
  terrain?: string | null;
  priceFromCad?: number | null;
  priceToCad?: number | null;
  elevationGainMetres?: number | null;
  avgTemperatureCelsius?: number | null;
  avgHumidityPercent?: number | null;
  avgWindKmh?: number | null;
  altitudeMetres?: number | null;
  weatherNotes?: string | null;
}

function getTerrainDetails(terrain: string | null | undefined) {
  switch (terrain) {
    case "road":
      return { value: "Road", subtitle: "100% Paved" };
    case "trail":
      return { value: "Trail", subtitle: "Off-road" };
    case "mixed":
      return { value: "Mixed", subtitle: "Road & Trail" };
    case "track":
      return { value: "Track", subtitle: "400m oval" };
    default:
      return { value: "Various", subtitle: "Mixed surfaces" };
  }
}

function getElevationLabel(metres: number) {
  if (metres <= 50) return "Flat";
  if (metres <= 200) return "Rolling";
  if (metres <= 500) return "Hilly";
  return "Mountainous";
}

function getHumidityLabel(percent: number) {
  if (percent <= 40) return "Low";
  if (percent <= 65) return "Moderate";
  if (percent <= 80) return "High";
  return "Very High";
}

function getWindLabel(kmh: number) {
  if (kmh <= 10) return "Calm";
  if (kmh <= 20) return "Gentle";
  if (kmh <= 35) return "Moderate";
  return "Strong";
}

function getAltitudeLabel(metres: number) {
  if (metres <= 100) return "Sea Level";
  if (metres <= 500) return "Low";
  if (metres <= 1500) return "Moderate";
  return "High";
}

function getTemperatureCondition(celsius: number) {
  if (celsius <= 0) return "Freezing";
  if (celsius <= 8) return "Cold";
  if (celsius <= 15) return "Cool";
  if (celsius <= 22) return "Mild";
  return "Warm";
}

function formatPrice(fromCad: number | null | undefined, toCad: number | null | undefined) {
  if (fromCad == null) return { value: "Free", subtitle: "No entry fee" };
  const from = Math.round(fromCad / 100);
  if (toCad && toCad !== fromCad) {
    const to = Math.round(toCad / 100);
    return { value: `$${from}–$${to}`, subtitle: "CAD" };
  }
  return { value: `$${from}`, subtitle: "CAD" };
}

/* ── Mini SVG visualizations ── */

function TerrainViz({ terrain }: { terrain: string | null | undefined }) {
  return (
    <svg width="40" height="24" viewBox="0 0 40 24" className="info-viz">
      {terrain === "trail" || terrain === "mixed" ? (
        <path
          d="M0 22 L8 10 L14 16 L22 4 L30 14 L40 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="viz-draw"
        />
      ) : (
        <path
          d="M0 16 L40 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="viz-draw"
        />
      )}
    </svg>
  );
}

function ElevationViz({ metres }: { metres: number }) {
  const max = 3000;
  const bars = [0.3, 0.5, 0.7, 1.0, 0.8];
  const scale = Math.min(metres / max, 1);
  return (
    <svg width="40" height="24" viewBox="0 0 40 24" className="info-viz">
      {bars.map((b, i) => {
        const h = b * scale * 20 + 2;
        return (
          <rect
            key={i}
            x={i * 9}
            y={24 - h}
            width="6"
            rx="1"
            height={h}
            fill="currentColor"
            opacity={0.6}
            className="viz-bar"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        );
      })}
    </svg>
  );
}

function ThermometerViz({ celsius }: { celsius: number }) {
  const fill = Math.min(Math.max((celsius + 10) / 50, 0.05), 1);
  return (
    <svg width="40" height="24" viewBox="0 0 40 24" className="info-viz">
      <rect x="4" y="2" width="32" height="6" rx="3" fill="currentColor" opacity={0.15} />
      <rect
        x="4"
        y="2"
        width={32 * fill}
        height="6"
        rx="3"
        fill="currentColor"
        opacity={0.6}
        className="viz-fill"
      />
      <circle cx={4 + 32 * fill} cy="5" r="3" fill="currentColor" className="viz-dot" />
      <rect x="4" y="16" width="32" height="2" rx="1" fill="currentColor" opacity={0.1} />
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <rect
          key={i}
          x={4 + 32 * t - 0.5}
          y="14"
          width="1"
          height="6"
          fill="currentColor"
          opacity={0.2}
        />
      ))}
    </svg>
  );
}

function HumidityViz({ percent }: { percent: number }) {
  const fill = percent / 100;
  return (
    <svg width="40" height="24" viewBox="0 0 40 24" className="info-viz">
      <rect x="4" y="8" width="32" height="6" rx="3" fill="currentColor" opacity={0.15} />
      <rect
        x="4"
        y="8"
        width={32 * fill}
        height="6"
        rx="3"
        fill="currentColor"
        opacity={0.6}
        className="viz-fill"
      />
      <circle cx={4 + 32 * fill} cy="11" r="3.5" fill="currentColor" className="viz-dot" />
    </svg>
  );
}

function WindViz({ kmh }: { kmh: number }) {
  const speed = Math.min(kmh / 50, 1);
  return (
    <svg width="40" height="24" viewBox="0 0 40 24" className="info-viz">
      <path
        d={`M2 12 Q10 ${12 - 6 * speed} 20 12 Q30 ${12 + 6 * speed} 38 12`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity={0.6}
        className="viz-draw"
      />
      <path
        d={`M2 18 Q10 ${18 - 4 * speed} 20 18 Q30 ${18 + 4 * speed} 38 18`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.3}
        className="viz-draw"
        style={{ animationDelay: "100ms" }}
      />
      <path
        d={`M2 6 Q10 ${6 - 4 * speed} 20 6 Q30 ${6 + 4 * speed} 38 6`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.3}
        className="viz-draw"
        style={{ animationDelay: "200ms" }}
      />
    </svg>
  );
}

function AltitudeViz({ metres }: { metres: number }) {
  const scale = Math.min(metres / 2000, 1);
  return (
    <svg width="40" height="24" viewBox="0 0 40 24" className="info-viz">
      <path
        d="M0 24 L12 24 L20 4 L28 24 L40 24"
        fill="currentColor"
        opacity={0.15}
      />
      <path
        d={`M0 24 L12 24 L20 ${24 - 20 * scale} L28 24 L40 24`}
        fill="currentColor"
        opacity={0.4}
        className="viz-mountain"
      />
    </svg>
  );
}

/* ── Icons ── */

function TerrainIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 20 L10 8 L15 14 L21 4" />
    </svg>
  );
}

function PriceIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12M8 10h8M8 14h8" />
    </svg>
  );
}

function ElevationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20 L8 8 L14 14 L22 4" />
    </svg>
  );
}

function TemperatureIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2v14M8 12a4 4 0 1 0 8 0" />
      <circle cx="12" cy="18" r="2" fill="currentColor" />
    </svg>
  );
}

function HumidityIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C12 2 6 10 6 14a6 6 0 0 0 12 0c0-4-6-12-6-12Z" />
    </svg>
  );
}

function WindIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M2 12h14a3 3 0 1 0-3-3" />
      <path d="M2 6h8a3 3 0 1 1-3 3" />
      <path d="M2 18h10a3 3 0 1 1-3 3" />
    </svg>
  );
}

function AltitudeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 20L2 20L10 4L14 12L18 6L22 20L16 20" />
    </svg>
  );
}

/* ── Card Component ── */

function InfoCard({
  icon,
  label,
  value,
  subtitle,
  viz,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  viz: React.ReactNode;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    const timeout = setTimeout(() => {
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <div
      ref={ref}
      className="flex min-w-[140px] flex-none flex-col justify-between rounded-2xl bg-[#1a1a1a] p-4 text-white dark:bg-white/[0.06]"
    >
      <div className="flex items-center gap-1.5 text-white/50">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-lg font-semibold leading-tight">{value}</p>
      <div className="mt-3 flex items-end justify-between">
        <span className="text-xs text-white/40">{subtitle}</span>
        <div className="text-white/40">{viz}</div>
      </div>
    </div>
  );
}

/* ── Main Component ── */

export function EventInfoCards({
  terrain,
  priceFromCad,
  priceToCad,
  elevationGainMetres,
  avgTemperatureCelsius,
  avgHumidityPercent,
  avgWindKmh,
  altitudeMetres,
  weatherNotes,
}: EventInfoCardsProps) {
  const terrainInfo = getTerrainDetails(terrain);
  const priceInfo = formatPrice(priceFromCad, priceToCad);

  const cards = [
    {
      icon: <TerrainIcon />,
      label: "Terrain",
      value: terrainInfo.value,
      subtitle: terrainInfo.subtitle,
      viz: <TerrainViz terrain={terrain} />,
    },
    {
      icon: <PriceIcon />,
      label: "Price",
      value: priceInfo.value,
      subtitle: priceInfo.subtitle,
      viz: null,
    },
    ...(elevationGainMetres != null
      ? [
          {
            icon: <ElevationIcon />,
            label: "Elevation",
            value: getElevationLabel(elevationGainMetres),
            subtitle: `${elevationGainMetres}m`,
            viz: <ElevationViz metres={elevationGainMetres} />,
          },
        ]
      : []),
    ...(avgTemperatureCelsius != null
      ? [
          {
            icon: <TemperatureIcon />,
            label: "Temperature",
            value: `${avgTemperatureCelsius}\u00B0C`,
            subtitle: getTemperatureCondition(avgTemperatureCelsius),
            viz: <ThermometerViz celsius={avgTemperatureCelsius} />,
          },
        ]
      : []),
    ...(avgHumidityPercent != null
      ? [
          {
            icon: <HumidityIcon />,
            label: "Humidity",
            value: getHumidityLabel(avgHumidityPercent),
            subtitle: `${avgHumidityPercent}%`,
            viz: <HumidityViz percent={avgHumidityPercent} />,
          },
        ]
      : []),
    ...(avgWindKmh != null
      ? [
          {
            icon: <WindIcon />,
            label: "Wind",
            value: getWindLabel(avgWindKmh),
            subtitle: `${avgWindKmh}km/h`,
            viz: <WindViz kmh={avgWindKmh} />,
          },
        ]
      : []),
    ...(altitudeMetres != null
      ? [
          {
            icon: <AltitudeIcon />,
            label: "Altitude",
            value: getAltitudeLabel(altitudeMetres),
            subtitle: `${altitudeMetres}m`,
            viz: <AltitudeViz metres={altitudeMetres} />,
          },
        ]
      : []),
  ];

  return (
    <>
      <style>{`
        .viz-bar {
          animation: vizBarGrow 0.6s ease-out both;
        }
        .viz-fill {
          animation: vizFill 0.8s ease-out both;
        }
        .viz-draw {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: vizDraw 1s ease-out 0.3s both;
        }
        .viz-dot {
          animation: vizDot 0.4s ease-out 0.6s both;
        }
        .viz-mountain {
          animation: vizMountain 0.8s ease-out 0.2s both;
        }
        @keyframes vizBarGrow {
          from { transform: scaleY(0); transform-origin: bottom; }
          to { transform: scaleY(1); transform-origin: bottom; }
        }
        @keyframes vizFill {
          from { width: 0; }
        }
        @keyframes vizDraw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes vizDot {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes vizMountain {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 0.4; transform: translateY(0); }
        }
      `}</style>
      <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
        {cards.map((card, i) => (
          <InfoCard
            key={card.label}
            icon={card.icon}
            label={card.label}
            value={card.value}
            subtitle={card.subtitle}
            viz={card.viz}
            delay={i * 80}
          />
        ))}
      </div>
      {weatherNotes && (
        <p className="mt-2 text-right text-xs text-muted-foreground">
          Weather based on historical averages.
        </p>
      )}
    </>
  );
}
