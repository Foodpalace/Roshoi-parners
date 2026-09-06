import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as useT } from "./mark-k_MWpJPt.mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getRestaurant, c as updateRestaurantProfile, i as createRestaurantDraft, l as uploadDocument, o as loadSimulatedKitchen, r as VendorShell, s as submitForReview, u as useVendor } from "./vendor-shell-BlujHxVb.mjs";
import { t as Button } from "./button-BJZReGAe.mjs";
import { t as Card } from "./card-BlL678bI.mjs";
import { n as Label, r as Textarea, t as Input } from "./input-Dj6qv6Kf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-igvLk8GP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OnboardingPage() {
	const t = useT();
	const nav = useNavigate();
	const qc = useQueryClient();
	const vendor = useVendor();
	const restQ = useQuery({
		queryKey: ["restaurant", vendor.restaurantId],
		queryFn: () => getRestaurant({ data: { restaurantId: vendor.restaurantId } }),
		enabled: Boolean(vendor.restaurantId)
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		displayName: "",
		ownerName: "",
		phone: "",
		email: "",
		address: "",
		landmark: "",
		cuisine: "",
		diet: "NONVEG",
		description: "",
		gstin: "",
		fssaiNumber: "",
		pan: "",
		bankAccount: "",
		bankIfsc: ""
	});
	const r = restQ.data?.restaurant;
	async function loadDemo() {
		setBusy(true);
		setError(null);
		try {
			await loadSimulatedKitchen();
			await qc.invalidateQueries();
			nav({ to: "/dashboard" });
		} catch (e) {
			setError(e instanceof Error ? e.message : "Could not load demo");
		} finally {
			setBusy(false);
		}
	}
	async function createReal() {
		setBusy(true);
		setError(null);
		try {
			await createRestaurantDraft({ data: {
				name: form.name,
				displayName: form.displayName || form.name,
				ownerName: form.ownerName,
				phone: form.phone,
				email: form.email,
				address: form.address,
				landmark: form.landmark,
				cuisine: form.cuisine,
				diet: form.diet,
				description: form.description
			} });
			await qc.invalidateQueries();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Could not save");
		} finally {
			setBusy(false);
		}
	}
	async function saveMore() {
		if (!vendor.restaurantId) return;
		setBusy(true);
		setError(null);
		try {
			await updateRestaurantProfile({ data: {
				restaurantId: vendor.restaurantId,
				gstin: form.gstin,
				fssaiNumber: form.fssaiNumber,
				pan: form.pan,
				bankAccount: form.bankAccount,
				bankIfsc: form.bankIfsc,
				cuisine: form.cuisine,
				description: form.description
			} });
			await qc.invalidateQueries({ queryKey: ["restaurant"] });
		} catch (e) {
			setError(e instanceof Error ? e.message : "Could not save");
		} finally {
			setBusy(false);
		}
	}
	async function submit() {
		if (!vendor.restaurantId) return;
		setBusy(true);
		setError(null);
		try {
			await submitForReview({ data: { restaurantId: vendor.restaurantId } });
			await qc.invalidateQueries();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Could not submit");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VendorShell, {
		title: t("onboarding.title"),
		dataLabel: vendor.dataLabel,
		restaurantName: vendor.selected?.restaurantName,
		children: !vendor.restaurantId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: t("onboarding.demoCta")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: t("onboarding.demoHint")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy,
						onClick: () => void loadDemo(),
						children: t("onboarding.demoCta")
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: t("onboarding.realCta")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: t("onboarding.notVerified")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("onboarding.name"),
						value: form.name,
						onChange: (v) => setForm({
							...form,
							name: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("onboarding.displayName"),
						value: form.displayName,
						onChange: (v) => setForm({
							...form,
							displayName: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("onboarding.owner"),
						value: form.ownerName,
						onChange: (v) => setForm({
							...form,
							ownerName: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("onboarding.phone"),
						value: form.phone,
						onChange: (v) => setForm({
							...form,
							phone: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("onboarding.email"),
						value: form.email,
						onChange: (v) => setForm({
							...form,
							email: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("onboarding.address"),
						value: form.address,
						onChange: (v) => setForm({
							...form,
							address: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("onboarding.landmark"),
						value: form.landmark,
						onChange: (v) => setForm({
							...form,
							landmark: v
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t("onboarding.cuisine"),
						value: form.cuisine,
						onChange: (v) => setForm({
							...form,
							cuisine: v
						})
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy || !form.name,
						onClick: () => void createReal(),
						children: t("onboarding.saveDraft")
					})
				]
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-wide text-muted",
						children: t("onboarding.status")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-2xl",
						children: String(r?.verification_status ?? vendor.selected?.verificationStatus)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: t("onboarding.notVerified")
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "grid gap-3 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("onboarding.cuisine"),
							value: form.cuisine || String(r?.cuisine ?? ""),
							onChange: (v) => setForm({
								...form,
								cuisine: v
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("onboarding.gst"),
							value: form.gstin || String(r?.gstin ?? ""),
							onChange: (v) => setForm({
								...form,
								gstin: v
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("onboarding.fssai"),
							value: form.fssaiNumber || String(r?.fssai_number ?? ""),
							onChange: (v) => setForm({
								...form,
								fssaiNumber: v
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("onboarding.pan"),
							value: form.pan || String(r?.pan ?? ""),
							onChange: (v) => setForm({
								...form,
								pan: v
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("onboarding.bank"),
							value: form.bankAccount,
							onChange: (v) => setForm({
								...form,
								bankAccount: v
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: t("onboarding.ifsc"),
							value: form.bankIfsc,
							onChange: (v) => setForm({
								...form,
								bankIfsc: v
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("onboarding.description") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: form.description || String(r?.description ?? ""),
								onChange: (e) => setForm({
									...form,
									description: e.target.value
								})
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentUpload, { restaurantId: vendor.restaurantId }),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-danger",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						disabled: busy,
						onClick: () => void saveMore(),
						children: t("onboarding.saveDraft")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy || vendor.dataLabel === "SIMULATED",
						onClick: () => void submit(),
						children: t("onboarding.submit")
					})]
				})
			]
		})
	});
}
function Field({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		value,
		onChange: (e) => onChange(e.target.value)
	})] });
}
function DocumentUpload({ restaurantId }) {
	const t = useT();
	const [msg, setMsg] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-medium",
				children: t("onboarding.documents")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: t("onboarding.storageHint")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "file",
				accept: "application/pdf,image/jpeg,image/png,image/webp",
				className: "block w-full text-sm",
				onChange: async (e) => {
					const file = e.target.files?.[0];
					if (!file) return;
					const dataUrl = await new Promise((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = () => resolve(String(reader.result));
						reader.onerror = () => reject(/* @__PURE__ */ new Error("read failed"));
						reader.readAsDataURL(file);
					});
					try {
						const res = await uploadDocument({ data: {
							restaurantId,
							kind: "FSSAI",
							fileName: file.name,
							contentType: file.type || "application/octet-stream",
							dataUrl
						} });
						setMsg(`Uploaded (${res.storage}). Status ${res.verificationStatus}.`);
					} catch (err) {
						setMsg(err instanceof Error ? err.message : "Upload failed");
					}
				}
			}),
			msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: msg
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-faint",
				children: t("onboarding.notVerified")
			})
		]
	});
}
//#endregion
export { OnboardingPage as component };
