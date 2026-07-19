import { useEffect, useState } from "react";
import { generateLive, generateSeries, type LiveReading } from "@/lib/mock-data";

export function useLive(intervalMs = 3000) {
  const [current, setCurrent] = useState<LiveReading | null>(null);
  const [series, setSeries] = useState<LiveReading[]>([]);

  useEffect(() => {
    const init = generateSeries(30);
    setSeries(init);
    setCurrent(init[init.length - 1]);
    const id = setInterval(() => {
      const next = generateLive();
      setCurrent(next);
      setSeries((prev) => [...prev.slice(-59), next]);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return { current, series };
}

export function useCountUp(value: number, duration = 600) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const start = display;
    const delta = value - start;
    if (delta === 0) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setDisplay(start + delta * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return display;
}
