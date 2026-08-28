import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format watts as a kW number string (always ÷1000). */
export function formatKw(w: number, digits = 2): string {
  return (w / 1000).toFixed(digits);
}

export function formatPower(w: number): string {
  const abs = Math.abs(w);
  if (abs >= 1_000_000) return `${(w / 1_000_000).toFixed(2)} MW`;
  if (abs >= 1000) return `${(w / 1000).toFixed(2)} kW`;
  return `${w.toFixed(0)} W`;
}

export function formatPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function formatA(a: number): string {
  return `${a.toFixed(1)} A`;
}

export function formatV(v: number): string {
  return `${v.toFixed(1)} V`;
}
