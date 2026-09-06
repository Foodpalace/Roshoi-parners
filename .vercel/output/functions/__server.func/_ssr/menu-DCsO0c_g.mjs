import { o as __toESM } from "../_runtime.mjs";
import { n as can } from "./rbac-inyuxmFx.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as useT } from "./mark-k_MWpJPt.mjs";
import { r as VendorShell, u as useVendor } from "./vendor-shell-BlujHxVb.mjs";
import { t as Button } from "./button-BJZReGAe.mjs";
import { t as Card } from "./card-BlL678bI.mjs";
import { o as rupeesToPaise } from "./money-CtWHgB0v.mjs";
import { t as MoneyText } from "./money-text-DN_2BhPz.mjs";
import { n as Label, r as Textarea, t as Input } from "./input-Dj6qv6Kf.mjs";
import { a as saveCategory, i as saveAddon, n as duplicateItem, o as saveItem, r as getMenu, s as setAvailability } from "./router-Couwt5qG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/menu-DCsO0c_g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MenuPage() {
	const t = useT();
	const vendor = useVendor();
	const qc = useQueryClient();
	const menu = useQuery({
		queryKey: ["menu", vendor.restaurantId],
		queryFn: () => getMenu({ data: { restaurantId: vendor.restaurantId } }),
		enabled: Boolean(vendor.restaurantId)
	});
	const canEdit = vendor.role ? can(vendor.role, "menu.edit") : false;
	const canAvail = vendor.role ? can(vendor.role, "availability.edit") : false;
	const [catName, setCatName] = (0, import_react.useState)("");
	const [addonName, setAddonName] = (0, import_react.useState)("");
	const [addonPrice, setAddonPrice] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)([]);
	const [editor, setEditor] = (0, import_react.useState)(null);
	const grouped = (0, import_react.useMemo)(() => {
		const cats = menu.data?.categories ?? [];
		const items = menu.data?.items ?? [];
		return cats.map((c) => ({
			...c,
			items: items.filter((i) => i.category_id === c.id)
		}));
	}, [menu.data]);
	async function bulk(status) {
		if (!selected.length) return;
		await setAvailability({ data: {
			restaurantId: vendor.restaurantId,
			itemIds: selected,
			status
		} });
		setSelected([]);
		qc.invalidateQueries({ queryKey: ["menu"] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VendorShell, {
		title: t("menu.title"),
		dataLabel: menu.data?.dataLabel ?? vendor.dataLabel,
		restaurantName: vendor.selected?.restaurantName,
		children: [
			canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex gap-2",
				onSubmit: async (e) => {
					e.preventDefault();
					if (!catName.trim()) return;
					await saveCategory({ data: {
						restaurantId: vendor.restaurantId,
						name: catName
					} });
					setCatName("");
					qc.invalidateQueries({ queryKey: ["menu"] });
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: t("menu.addCategory"),
					value: catName,
					onChange: (e) => setCatName(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: t("menu.addCategory")
				})]
			}) : null,
			canAvail && selected.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: () => void bulk("sold_out"),
					children: t("menu.bulkSoldOut")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: () => void bulk("available"),
					children: t("menu.bulkAvailable")
				})]
			}) : null,
			grouped.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "text-sm text-muted",
				children: t("menu.noItems")
			}) : grouped.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: cat.name
					}), canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => setEditor({
							categoryId: cat.id,
							name: "",
							description: "",
							diet: "NONVEG",
							recommended: false,
							addonIds: [],
							variants: [{
								name: "Regular",
								price: ""
							}]
						}),
						children: t("menu.addItem")
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2",
					children: cat.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "flex flex-wrap items-center justify-between gap-3 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-11 items-start gap-3",
							children: [canAvail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: "mt-1 size-4",
								checked: selected.includes(item.id),
								onChange: (e) => setSelected((cur) => e.target.checked ? [...cur, item.id] : cur.filter((id) => id !== item.id))
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-medium",
									children: [
										item.name,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs uppercase text-muted",
											children: item.diet
										}),
										item.recommended ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-2 text-xs text-chili",
											children: t("menu.recommended")
										}) : null
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-muted",
									children: item.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 flex flex-wrap gap-2 text-sm",
									children: item.variants.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded-full bg-surface-2 px-2 py-0.5",
										children: [
											v.name,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyText, { paise: v.pricePaise })
										]
									}, v.id))
								})
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: item.availability === "available" ? "secondary" : "primary",
									onClick: () => void setAvailability({ data: {
										restaurantId: vendor.restaurantId,
										itemIds: [item.id],
										status: item.availability === "available" ? "sold_out" : "available"
									} }).then(() => qc.invalidateQueries({ queryKey: ["menu"] })),
									children: item.availability === "available" ? t("menu.soldOut") : t("menu.available")
								}),
								item.availability === "available" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => void setAvailability({ data: {
										restaurantId: vendor.restaurantId,
										itemIds: [item.id],
										status: "temporarily_unavailable"
									} }).then(() => qc.invalidateQueries({ queryKey: ["menu"] })),
									children: t("menu.unavailable")
								}) : null,
								canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => void duplicateItem({ data: {
										restaurantId: vendor.restaurantId,
										itemId: item.id
									} }).then(() => qc.invalidateQueries({ queryKey: ["menu"] })),
									children: t("menu.duplicate")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => setEditor({
										id: item.id,
										categoryId: item.category_id,
										name: item.name,
										description: item.description,
										diet: item.diet ?? "NONVEG",
										recommended: Boolean(item.recommended),
										addonIds: item.addonIds ?? [],
										variants: item.variants.map((v) => ({
											name: v.name,
											price: String(v.pricePaise / 100)
										}))
									}),
									children: t("menu.edit")
								})] }) : null
							]
						})]
					}, item.id))
				})]
			}, cat.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg",
						children: t("menu.addons")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "text-sm",
						children: (menu.data?.addons ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between border-b border-line py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyText, { paise: a.pricePaise })]
						}, a.id))
					}),
					canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "grid gap-2 md:grid-cols-[1fr_120px_auto]",
						onSubmit: async (e) => {
							e.preventDefault();
							if (!addonName.trim() || !addonPrice) return;
							await saveAddon({ data: {
								restaurantId: vendor.restaurantId,
								name: addonName,
								pricePaise: rupeesToPaise(Number(addonPrice))
							} });
							setAddonName("");
							setAddonPrice("");
							qc.invalidateQueries({ queryKey: ["menu"] });
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: t("menu.addAddon"),
								value: addonName,
								onChange: (e) => setAddonName(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "decimal",
								placeholder: t("menu.price"),
								value: addonPrice,
								onChange: (e) => setAddonPrice(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: t("menu.addAddon")
							})
						]
					}) : null
				]
			}),
			editor ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg",
						children: editor.id ? t("menu.edit") : t("menu.addItem")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("menu.name") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: editor.name,
						onChange: (e) => setEditor({
							...editor,
							name: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("menu.description") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: editor.description,
						onChange: (e) => setEditor({
							...editor,
							description: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("onboarding.vegStatus") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "h-11 w-full rounded-[12px] border border-line bg-surface px-3",
						value: editor.diet,
						onChange: (e) => setEditor({
							...editor,
							diet: e.target.value
						}),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "VEG",
								children: t("menu.veg")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "NONVEG",
								children: t("menu.nonveg")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "EGG",
								children: t("menu.egg")
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-11 items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: editor.recommended,
							onChange: (e) => setEditor({
								...editor,
								recommended: e.target.checked
							})
						}), t("menu.recommended")]
					}),
					editor.variants.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: v.name,
							onChange: (e) => {
								const variants = [...editor.variants];
								variants[i] = {
									...v,
									name: e.target.value
								};
								setEditor({
									...editor,
									variants
								});
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "decimal",
							placeholder: t("menu.price"),
							value: v.price,
							onChange: (e) => {
								const variants = [...editor.variants];
								variants[i] = {
									...v,
									price: e.target.value
								};
								setEditor({
									...editor,
									variants
								});
							}
						})]
					}, i)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						type: "button",
						onClick: () => setEditor({
							...editor,
							variants: [...editor.variants, {
								name: "",
								price: ""
							}]
						}),
						children: t("menu.variants")
					}),
					(menu.data?.addons.length ?? 0) > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("menu.addons") }), menu.data?.addons.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-11 items-center gap-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: editor.addonIds.includes(a.id),
									onChange: (e) => setEditor({
										...editor,
										addonIds: e.target.checked ? [...editor.addonIds, a.id] : editor.addonIds.filter((id) => id !== a.id)
									})
								}),
								a.name,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoneyText, { paise: a.pricePaise })
							]
						}, a.id))]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: async () => {
								await saveItem({ data: {
									restaurantId: vendor.restaurantId,
									id: editor.id,
									categoryId: editor.categoryId,
									name: editor.name,
									description: editor.description,
									diet: editor.diet,
									recommended: editor.recommended,
									addonIds: editor.addonIds,
									variants: editor.variants.filter((v) => v.name && v.price).map((v) => ({
										name: v.name,
										pricePaise: rupeesToPaise(Number(v.price))
									}))
								} });
								setEditor(null);
								qc.invalidateQueries({ queryKey: ["menu"] });
							},
							children: t("menu.save")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setEditor(null),
							children: t("common.cancel")
						})]
					})
				]
			}) : null
		]
	});
}
//#endregion
export { MenuPage as component };
