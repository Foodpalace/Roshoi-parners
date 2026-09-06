//#region node_modules/.nitro/vite/services/ssr/assets/hours-CQlwh30e.js
function parseHm(hhmm) {
	const [h, m] = hhmm.split(":").map((n) => Number(n));
	if (!Number.isInteger(h) || !Number.isInteger(m) || h < 0 || h > 23 || m < 0 || m > 59) throw new Error("Invalid time");
	return h * 60 + m;
}
function minutesOfDay(iso, timeZone = "Asia/Kolkata") {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone,
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).formatToParts(new Date(iso));
	const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
	const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
	return hour * 60 + minute;
}
function weekdayInZone(iso, timeZone = "Asia/Kolkata") {
	return {
		Sun: 0,
		Mon: 1,
		Tue: 2,
		Wed: 3,
		Thu: 4,
		Fri: 5,
		Sat: 6
	}[new Intl.DateTimeFormat("en-US", {
		timeZone,
		weekday: "short"
	}).format(new Date(iso))] ?? 0;
}
function isOpenAt(opts) {
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
		if (s.closeMinutes > s.openMinutes) return mins >= s.openMinutes && mins < s.closeMinutes;
		return mins >= s.openMinutes || mins < s.closeMinutes;
	});
}
function hmToMinutes(hhmm) {
	return parseHm(hhmm);
}
function minutesToHm(mins) {
	const h = Math.floor(mins / 60) % 24;
	const m = mins % 60;
	return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function minutesUntilClose(opts) {
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
		if (mins >= s.openMinutes) return 1440 - mins + s.closeMinutes;
		return s.closeMinutes - mins;
	});
	return Math.min(...remaining);
}
//#endregion
export { minutesUntilClose as i, isOpenAt as n, minutesToHm as r, hmToMinutes as t };
