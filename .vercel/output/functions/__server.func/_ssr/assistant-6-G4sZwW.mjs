import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as useT } from "./mark-k_MWpJPt.mjs";
import { r as VendorShell, u as useVendor } from "./vendor-shell-BlujHxVb.mjs";
import { t as Button } from "./button-BJZReGAe.mjs";
import { t as Card } from "./card-BlL678bI.mjs";
import { r as Textarea } from "./input-Dj6qv6Kf.mjs";
import { n as askAssistant } from "./api-more-BGAOS9o2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assistant-6-G4sZwW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AssistantPage() {
	const t = useT();
	const vendor = useVendor();
	const [q, setQ] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [log, setLog] = (0, import_react.useState)([]);
	const examples = t("assistant.examples").split("|");
	const connected = vendor.adapters?.ai.connected;
	async function send(text) {
		if (!text.trim()) return;
		setBusy(true);
		setLog((l) => [...l, {
			role: "user",
			text
		}]);
		try {
			const res = await askAssistant({ data: {
				restaurantId: vendor.restaurantId,
				question: text
			} });
			const reply = typeof res === "object" && res && "text" in res ? String(res.text) : t("assistant.unavailable");
			setLog((l) => [...l, {
				role: "assistant",
				text: reply
			}]);
		} catch (e) {
			setLog((l) => [...l, {
				role: "assistant",
				text: e instanceof Error ? e.message : t("assistant.unavailable")
			}]);
		} finally {
			setBusy(false);
			setQ("");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VendorShell, {
		title: t("nav.assistant"),
		dataLabel: vendor.dataLabel,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: t("assistant.disclaimer")
			}),
			!connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[12px] bg-warn-soft px-3 py-2 text-sm text-warn",
				children: [
					t("app.notConnected"),
					" — ",
					t("assistant.unavailable")
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: examples.map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: () => void send(ex),
					children: ex
				}, ex))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: log.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: m.role === "user" ? "bg-chili-soft" : "",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "whitespace-pre-wrap text-sm",
						children: m.text
					})
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					send(q);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					className: "min-h-14",
					placeholder: t("assistant.placeholder"),
					value: q,
					onChange: (e) => setQ(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy,
					children: t("assistant.send")
				})]
			})
		]
	});
}
//#endregion
export { AssistantPage as component };
