export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Shift = {
  weekday: Weekday;
  openMinutes: number;
  closeMinutes: number;
};

export type Closure = {
  startsAt: string;
  endsAt: string;
  kind: "holiday" | "temporary" | "emergency" | "vacation";
};

function parseHm(hhmm: string): number {
  const [h, m] = hhmm.split(":").map((n) => Number(n));
  if (!Number.isInteger(h) || !Number.isInteger(m) || h < 0 || h > 23 || m < 0 || m > 59) {
    throw new Error("Invalid time");
  }
  return h * 60 + m;
}

export function minutesOfDay(iso: string, timeZone = "Asia/Kolkata"): number {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = fmt.formatToParts(new Date(iso));
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return hour * 60 + minute;
}

export function weekdayInZone(iso: string, timeZone = "Asia/Kolkata"): Weekday {
  const fmt = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" });
  const map: Record<string, Weekday> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[fmt.format(new Date(iso))] ?? 0;
}

export function isOpenAt(opts: {
  nowIso: string;
  shifts: Shift[];
  closures: Closure[];
  weeklyHolidays: Weekday[];
  emergencyClosed?: boolean;
  adminOverride?: boolean;
  timeZone?: string;
}): boolean {
  if (opts.adminOverride) return true;
  if (opts.emergencyClosed) return false;
  const tz = opts.timeZone ?? "Asia/Kolkata";
  const now = new Date(opts.nowIso).getTime();
  for (const c of opts.closures) {
    const a = new Date(c.startsAt).getTime();
    const b = new Date(c.endsAt).getTime();
    if (now >= a && now <= b) return false;
  }
  const day = weekdayInZone(opts.nowIso, tz);
  if (opts.weeklyHolidays.includes(day)) return false;
  const mins = minutesOfDay(opts.nowIso, tz);
  const today = opts.shifts.filter((s) => s.weekday === day);
  if (today.length === 0) return false;
  return today.some((s) => {
    if (s.closeMinutes > s.openMinutes) {
      return mins >= s.openMinutes && mins < s.closeMinutes;
    }
    // overnight shift
    return mins >= s.openMinutes || mins < s.closeMinutes;
  });
}

export function hmToMinutes(hhmm: string): number {
  return parseHm(hhmm);
}

export function minutesToHm(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function minutesUntilClose(opts: {
  nowIso: string;
  shifts: Shift[];
  timeZone?: string;
}): number | null {
  const tz = opts.timeZone ?? "Asia/Kolkata";
  const day = weekdayInZone(opts.nowIso, tz);
  const mins = minutesOfDay(opts.nowIso, tz);
  const open = opts.shifts.filter((s) => {
    if (s.weekday !== day) return false;
    if (s.closeMinutes > s.openMinutes) return mins >= s.openMinutes && mins < s.closeMinutes;
    return mins >= s.openMinutes || mins < s.closeMinutes;
  });
  if (open.length === 0) return null;
  const remaining = open.map((s) => {
    if (s.closeMinutes > s.openMinutes) return s.closeMinutes - mins;
    if (mins >= s.openMinutes) return 24 * 60 - mins + s.closeMinutes;
    return s.closeMinutes - mins;
  });
  return Math.min(...remaining);
}
