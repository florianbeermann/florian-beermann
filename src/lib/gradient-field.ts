const TAU = Math.PI * 2;
const morphCycleOffsets = [-2, 3, 0, 2, -1];
export const morphSpeedMultiplier = 2;

export const gradientPalette = {
  blue: "var(--gradient-blue)",
  ink: "var(--gradient-ink)",
  ice: "var(--gradient-ice)",
  sky: "var(--_sky)",
  pale: "var(--_pale)",
  mid: "var(--_mid)",
  deep: "var(--_deep)",
  navy: "var(--_navy)",
  start1: "color-mix(in srgb, var(--gradient-blue) 86%, var(--gradient-ice))",
  start2: "color-mix(in srgb, var(--gradient-blue) 90%, var(--gradient-ice))",
  start3: "color-mix(in srgb, var(--gradient-blue) 80%, var(--gradient-ice))",
  start4: "color-mix(in srgb, var(--gradient-blue) 63%, var(--gradient-ink))",
  start5: "color-mix(in srgb, var(--gradient-blue) 48%, var(--gradient-ink))",
};

export type GradientColor = readonly [number, number, number];
export type GradientColors = Record<keyof typeof gradientPalette, GradientColor>;
export type MorphedStop = { position: number; color: GradientColor };

type ColumnDefinition = {
  travel: number;
  morph: number;
  stops: [number, keyof GradientColors][];
};

const definitions: ColumnDefinition[] = [
  {
    travel: 6, morph: 4,
    stops: [[0, "start1"], [5.5, "sky"], [7, "sky"], [15, "blue"], [24, "deep"],
      [26.5, "deep"], [33, "blue"], [39.9, "pale"], [39.9, "deep"], [49, "blue"],
      [57, "blue"], [66, "mid"], [77, "navy"], [85, "ink"], [89, "ink"],
      [89, "blue"], [95, "blue"], [100, "start1"]],
  },
  {
    travel: -4, morph: 3,
    stops: [[0, "start2"], [5, "sky"], [10.5, "pale"], [13.45, "ice"], [13.45, "deep"],
      [20, "blue"], [28, "sky"], [34, "sky"], [44, "blue"], [53, "blue"],
      [61, "mid"], [69, "mid"], [77, "navy"], [83.5, "ink"], [87, "ink"],
      [87, "blue"], [96, "blue"], [100, "start2"]],
  },
  {
    travel: -3, morph: 6,
    stops: [[0, "start3"], [5.5, "sky"], [11, "start3"], [24, "blue"], [35, "mid"],
      [47, "blue"], [56, "blue"], [56, "ink"], [61, "navy"], [69, "blue"],
      [79, "sky"], [87, "pale"], [91, "ice"], [91, "blue"], [97, "blue"], [100, "start3"]],
  },
  {
    travel: 2, morph: 4,
    stops: [[0, "start4"], [10, "mid"], [19, "mid"], [28, "deep"], [33, "navy"],
      [35.35, "navy"], [35.35, "blue"], [47, "deep"], [57, "blue"], [65, "blue"],
      [74, "sky"], [81, "pale"], [86, "ice"], [89, "ice"], [89, "deep"], [100, "start4"]],
  },
  {
    travel: 5, morph: 3,
    stops: [[0, "start5"], [8, "mid"], [20, "deep"], [30, "blue"], [33.7, "blue"],
      [33.7, "deep"], [40, "ink"], [44, "ink"], [52, "navy"], [61, "blue"],
      [71, "sky"], [81, "pale"], [85, "ice"], [88, "ice"], [88, "navy"], [100, "start5"]],
  },
];

export const gradientColumns = definitions.map((gradient) => {
  const cuts = [0];
  gradient.stops.forEach(([position], index, stops) => {
    if (index > 0 && position === stops[index - 1][0]) cuts.push(position);
  });
  cuts.push(100);
  let block = 0;
  return {
    ...gradient,
    stops: gradient.stops.map(([position, color], index, stops) => {
      if (index > 0 && position === stops[index - 1][0]) block++;
      return {
        position: position / 100, color, block,
        start: cuts[block] / 100, end: cuts[block + 1] / 100,
        local: (position - cuts[block]) / (cuts[block + 1] - cuts[block]),
      };
    }),
  };
});

export function morphTiming(column: number, block: number, phase: number) {
  const seed = column * 1.19 + block * 0.93;
  const rateCycles = 1 + (column + block) % 3;
  const slowCycles = 1 + (column * 2 + block) % 2;
  const rateSeed = seed * 0.83 + 1.2;
  const slowSeed = seed * 1.61;
  // Periodic speed ramps stay positive (0.12x-1.88x), preserving loop velocity.
  const progress = phase
    + 0.72 * (Math.sin(TAU * phase * rateCycles + rateSeed) - Math.sin(rateSeed)) / (TAU * rateCycles)
    + 0.16 * (Math.sin(TAU * phase * slowCycles + slowSeed) - Math.sin(slowSeed)) / (TAU * slowCycles);
  const cycles = gradientColumns[column].morph
    + morphCycleOffsets[(column + block * 2) % morphCycleOffsets.length];
  const angle = TAU * progress * morphSpeedMultiplier;
  return { seed, main: angle * cycles, ripple: angle * (cycles + 4) };
}

function luminance(color: GradientColor) {
  return color[0] * 0.2126 + color[1] * 0.7152 + color[2] * 0.0722;
}

export function morphStops(colors: GradientColors, column: number, phase: number): MorphedStop[] {
  const gradient = gradientColumns[column];
  const timings = Array.from(
    { length: gradient.stops[gradient.stops.length - 1].block + 1 },
    (_, block) => morphTiming(column, block, phase),
  );
  const blueLuminance = luminance(colors.blue);
  return gradient.stops.map((stop) => {
    const timing = timings[stop.block];
    const { seed, main, ripple } = timing;
    const drift = 0.21 * (Math.sin(main + seed) - Math.sin(seed)) / 2;
    const width = 0.045 * (Math.sin(ripple + seed * 0.7) - Math.sin(seed * 0.7)) / 2;
    const local = stop.local;
    // Warp only interiors: the positive derivative keeps stops from crossing.
    const warped = local === 0 || local === 1 ? local
      : local + drift * Math.sin(Math.PI * local) + width * Math.sin(TAU * local);
    const position = stop.start + (stop.end - stop.start) * warped;
    // Tile ends share phase and tempo even when their blocks differ.
    const atJoin = stop.position === 0 || stop.position === 1;
    const colorSeed = atJoin ? column * 1.19 : seed + local * 2.4;
    const colorTiming = atJoin ? timings[0] : timing;
    const wave = (Math.sin(colorTiming.main + colorSeed) - Math.sin(colorSeed)) / 2;
    const base = colors[stop.color];
    const light = luminance(base);
    const target = wave >= 0
      ? light < blueLuminance * 0.72 ? colors.blue : colors.ice
      : light > blueLuminance * 1.18 ? colors.blue : colors.ink;
    const amount = Math.abs(wave) * 0.85;
    return {
      position,
      color: [
        base[0] + (target[0] - base[0]) * amount,
        base[1] + (target[1] - base[1]) * amount,
        base[2] + (target[2] - base[2]) * amount,
      ],
    };
  });
}
