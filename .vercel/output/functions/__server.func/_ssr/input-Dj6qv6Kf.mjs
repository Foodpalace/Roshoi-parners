import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as cn } from "./utils-BZJZXT5Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-Dj6qv6Kf.js
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-[12px] border border-line bg-surface px-3 text-base text-ink placeholder:text-faint", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-24 w-full rounded-[12px] border border-line bg-surface px-3 py-2 text-base text-ink placeholder:text-faint", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("mb-1 block text-sm font-medium text-muted", className),
		...props
	});
}
//#endregion
export { Label as n, Textarea as r, Input as t };
