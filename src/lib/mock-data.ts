// Mock data generators mimicking a PZEM-004T + ESP32 backend

export type LiveReading = {
  timestamp: number;
  voltage: number;
  current: number;
  power: number;
  energy: number;
  frequency: number;
  pf: number;
};

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

let energyAccumulator = 42.318;

export function generateLive(): LiveReading {
  const current = +rand(0.4, 8.5).toFixed(2);
  const voltage = +rand(228, 232).toFixed(1);
  const pf = +rand(0.85, 1).toFixed(2);
  const power = +(voltage * current * pf).toFixed(1);
  energyAccumulator += power / 3600 / 1000; // approx per tick
  return {
    timestamp: Date.now(),
    voltage,
    current,
    power,
    energy: +energyAccumulator.toFixed(3),
    frequency: +rand(49.8, 50.2).toFixed(2),
    pf,
  };
}

export function generateSeries(count = 30): LiveReading[] {
  const now = Date.now();
  const arr: LiveReading[] = [];
  let e = 40;
  for (let i = count - 1; i >= 0; i--) {
    const voltage = +rand(228, 232).toFixed(1);
    const current = +rand(0.4, 8.5).toFixed(2);
    const pf = +rand(0.85, 1).toFixed(2);
    const power = +(voltage * current * pf).toFixed(1);
    e += power / 3600 / 1000;
    arr.push({
      timestamp: now - i * 3000,
      voltage,
      current,
      power,
      energy: +e.toFixed(3),
      frequency: +rand(49.8, 50.2).toFixed(2),
      pf,
    });
  }
  return arr;
}

export function generateHourly(): { hour: string; power: number; energy: number }[] {
  return Array.from({ length: 24 }, (_, i) => {
    const base = i >= 6 && i <= 9 ? 1400 : i >= 18 && i <= 22 ? 1800 : 400;
    const p = +rand(base * 0.6, base * 1.2).toFixed(0);
    return { hour: `${String(i).padStart(2, "0")}:00`, power: p, energy: +(p / 1000).toFixed(2) };
  });
}

export function generateDaily(days = 7): { day: string; energy: number; cost: number }[] {
  const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return Array.from({ length: days }, (_, i) => {
    const e = +rand(6, 18).toFixed(2);
    return { day: names[i % 7], energy: e, cost: +(e * 8.5).toFixed(2) };
  });
}

export function generateMonthly(): { month: string; energy: number; bill: number }[] {
  const m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return m.map((month) => {
    const e = +rand(180, 420).toFixed(0);
    return { month, energy: e, bill: +(e * 8.5).toFixed(0) };
  });
}

export const mockAlerts = [
  { id: 1, level: "critical", title: "Power Surge Detected", desc: "Power spiked to 2150 W at 19:42", time: "2 min ago" },
  { id: 2, level: "warning", title: "High Voltage", desc: "Voltage reached 234 V", time: "18 min ago" },
  { id: 3, level: "info", title: "Daily Peak", desc: "Peak usage 1.9 kW at 20:15", time: "1 hr ago" },
  { id: 4, level: "warning", title: "Standby Consumption", desc: "Detected 12 W standby load overnight", time: "6 hr ago" },
  { id: 5, level: "critical", title: "Current Spike", desc: "Current briefly hit 9.2 A", time: "1 day ago" },
] as const;

export const mockRecommendations = [
  { id: 1, icon: "Timer", title: "Reduce runtime by 20%", desc: "Cut daily runtime from 6h to 4.8h to save ~₹85/month.", impact: "₹85" },
  { id: 2, icon: "Power", title: "Turn appliance OFF after use", desc: "Standby draws 12 W constantly (~9 kWh/mo).", impact: "₹75" },
  { id: 3, icon: "Sun", title: "Avoid peak hours", desc: "Shift laundry to 11 AM – 3 PM off-peak window.", impact: "₹120" },
  { id: 4, icon: "TrendingDown", title: "Reduce monthly bill by ₹350", desc: "Apply top 3 recommendations to cut bill 14%.", impact: "₹350" },
];

export const mockDevice = {
  esp32: { status: "online", firmware: "v1.4.2", uptime: "3d 14h 22m" },
  pzem: { status: "online", firmware: "v3.1", lastComm: "just now" },
  wifi: { ssid: "EnergyLab-5G", signal: -52, quality: 82 },
};
