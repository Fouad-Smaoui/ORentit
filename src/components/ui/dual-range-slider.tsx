interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function DualRangeSlider({ min, max, step = 1, value, onChange }: DualRangeSliderProps) {
  const [lo, hi] = value;
  const pctLo = ((lo - min) / (max - min)) * 100;
  const pctHi = ((hi - min) / (max - min)) * 100;

  return (
    <div className="relative w-full h-5 flex items-center">
      <div className="absolute w-full h-1.5 rounded-full bg-gray-200 pointer-events-none" />
      <div
        className="absolute h-1.5 rounded-full bg-[#a100ff] pointer-events-none"
        style={{ left: `${pctLo}%`, right: `${100 - pctHi}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={lo}
        onChange={(e) => onChange([Math.min(Number(e.target.value), hi - step), hi])}
        className="dual-range-thumb absolute w-full h-5"
        aria-label="Minimum price"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={hi}
        onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo + step)])}
        className="dual-range-thumb absolute w-full h-5"
        aria-label="Maximum price"
      />
    </div>
  );
}
