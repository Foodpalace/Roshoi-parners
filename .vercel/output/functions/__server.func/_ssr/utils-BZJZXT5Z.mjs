import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-BZJZXT5Z.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function newId(prefix) {
	return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}`;
}
function asIso(value) {
	if (value instanceof Date) return value.toISOString();
	if (typeof value === "string") return value;
	if (value == null) return "";
	return String(value);
}
function asInt(value, fallback = 0) {
	if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
	if (typeof value === "string" && value.trim()) {
		const n = Number(value);
		if (Number.isFinite(n)) return Math.trunc(n);
	}
	return fallback;
}
function asBool(value) {
	return value === true || value === "t" || value === "true" || value === 1 || value === "1";
}
//#endregion
export { newId as a, cn as i, asInt as n, asIso as r, asBool as t };
