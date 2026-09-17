import { describe, expect, it } from "vitest";
import {
  gradientColumns, morphSpeedMultiplier, morphStops, morphTiming,
  type GradientColor, type GradientColors,
} from "./gradient-field";

const mix = (a: GradientColor, b: GradientColor, amount: number): GradientColor => [
  a[0] * amount + b[0] * (1 - amount),
  a[1] * amount + b[1] * (1 - amount),
  a[2] * amount + b[2] * (1 - amount),
];
const blue: GradientColor = [48 / 255, 92 / 255, 222 / 255];
const ink = mix(blue, [0, 0, 0], 0.06);
const ice = mix(blue, [1, 1, 1], 0.1);
const colors: GradientColors = {
  blue, ink, ice,
  sky: mix(blue, ice, 0.66), pale: mix(blue, ice, 0.24),
  mid: mix(blue, ink, 0.78), deep: mix(blue, ink, 0.48), navy: mix(blue, ink, 0.22),
  start1: mix(blue, ice, 0.86), start2: mix(blue, ice, 0.9),
  start3: mix(blue, ice, 0.8), start4: mix(blue, ink, 0.63), start5: mix(blue, ink, 0.48),
};

describe("approved signature-blue gradient field", () => {
  it("retains all five travel rates and the approved double-speed internal morph", () => {
    expect(gradientColumns.map(({ travel }) => travel)).toEqual([6, -4, -3, 2, 5]);
    expect(gradientColumns.map(({ morph }) => morph)).toEqual([4, 3, 6, 4, 3]);
    expect(morphSpeedMultiplier).toBe(2);
    expect(gradientColumns.map(({ stops }) => stops.length)).toEqual([18, 18, 16, 16, 16]);
  });

  it("independently moves interior stops and changes colours without moving block boundaries", () => {
    for (let column = 0; column < 5; column++) {
      const initial = morphStops(colors, column, 0);
      const changed = morphStops(colors, column, 0.137);
      let drifting = 0;
      let recolored = 0;
      gradientColumns[column].stops.forEach((stop, index) => {
        if (stop.local === 0 || stop.local === 1) {
          expect(changed[index].position).toBeCloseTo(initial[index].position, 12);
        } else if (Math.abs(changed[index].position - initial[index].position) > 0.001) {
          drifting++;
        }
        if (changed[index].color.some((value, channel) => Math.abs(value - initial[index].color[channel]) > 0.01)) {
          recolored++;
        }
      });
      expect(drifting).toBeGreaterThan(3);
      expect(recolored).toBeGreaterThan(5);
    }
  });

  it("keeps stops ordered, colours bounded and tile endpoints identical throughout the cycle", () => {
    for (let sample = 0; sample <= 240; sample++) {
      for (let column = 0; column < 5; column++) {
        const stops = morphStops(colors, column, sample / 240);
        expect(stops[0].position).toBe(0);
        expect(stops[stops.length - 1].position).toBe(1);
        expect(stops[0].color).toEqual(stops[stops.length - 1].color);
        stops.forEach((stop, index) => {
          if (index) expect(stop.position).toBeGreaterThanOrEqual(stops[index - 1].position);
          for (const channel of stop.color) {
            expect(channel).toBeGreaterThanOrEqual(0);
            expect(channel).toBeLessThanOrEqual(1);
          }
        });
      }
    }
  });

  it("returns to the same field and velocity at the 24-second seam", () => {
    const epsilon = 1e-7;
    for (let column = 0; column < 5; column++) {
      const start = morphStops(colors, column, 0);
      const end = morphStops(colors, column, 1);
      const after = morphStops(colors, column, epsilon);
      const before = morphStops(colors, column, 1 - epsilon);
      start.forEach((stop, index) => {
        expect(end[index].position).toBeCloseTo(stop.position, 12);
        stop.color.forEach((value, channel) => {
          expect(end[index].color[channel]).toBeCloseTo(value, 12);
        });
        const startVelocity = (after[index].position - stop.position) / epsilon;
        const endVelocity = (end[index].position - before[index].position) / epsilon;
        expect(startVelocity).toBeCloseTo(endVelocity, 3);
      });
      for (let block = 0; block < 3; block++) {
        const a = morphTiming(column, block, 0);
        const b = morphTiming(column, block, 1);
        for (const layer of ["main", "ripple"] as const) {
          const cycles = (b[layer] - a[layer]) / (2 * Math.PI);
          expect(cycles).toBeCloseTo(Math.round(cycles), 12);
          const startRate = (morphTiming(column, block, epsilon)[layer] - a[layer]) / epsilon;
          const endRate = (b[layer] - morphTiming(column, block, 1 - epsilon)[layer]) / epsilon;
          expect(startRate).toBeCloseTo(endRate, 2);
        }
      }
    }
  });

  it("gives each block distinct positive slow/fast ramps and faster ripples", () => {
    const signatures: string[] = [];
    for (let column = 0; column < 5; column++) {
      for (let block = 0; block < 3; block++) {
        const speeds = Array.from({ length: 240 }, (_, index) => {
          const a = morphTiming(column, block, index / 240);
          const b = morphTiming(column, block, index / 240 + 1e-6);
          const speed = (b.main - a.main) / 1e-6;
          expect(speed).toBeGreaterThan(0);
          expect((b.ripple - a.ripple) / 1e-6).toBeGreaterThan(speed);
          return speed;
        });
        expect(Math.max(...speeds) / Math.min(...speeds)).toBeGreaterThan(3);
        signatures.push(speeds.map((speed) => speed.toFixed(3)).join(","));
      }
    }
    expect(new Set(signatures).size).toBe(15);
  });
});
