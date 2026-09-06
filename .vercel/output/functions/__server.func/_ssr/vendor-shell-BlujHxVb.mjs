import { o as __toESM } from "../_runtime.mjs";
import { n as can } from "./rbac-inyuxmFx.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as signOut } from "./client-CVqXY6bk.mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as useT, i as useCurrentUserState, n as useClientState, r as useCurrentUser, t as RoshoiMark } from "./mark-k_MWpJPt.mjs";
import { d as useRouterState, v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-N6mvOH4Q.mjs";
import { i as cn } from "./utils-BZJZXT5Z.mjs";
import { _ as ChartLine, c as Star, d as Languages, f as House, g as ChefHat, h as ClipboardList, i as UtensilsCrossed, l as Sparkles, m as Clock3, o as Tag, p as Ellipsis, s as Store, t as Wallet, u as Settings, v as Bell } from "../_libs/lucide-react.mjs";
import { c as createSsrRpc } from "./router-Couwt5qG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vendor-shell-BlujHxVb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of).
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
function DataBanner({ label }) {
	const t = useT();
	if (!label) return null;
	const simulated = label === "SIMULATED";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "status",
		className: cn("rounded-[12px] px-3 py-2 text-xs font-semibold tracking-wide", simulated ? "bg-warn-soft text-warn" : "bg-leaf-soft text-leaf"),
		children: [simulated ? t("app.simulated") : label === "VERIFIED" ? t("app.verified") : t("app.real"), simulated ? ` — ${t("app.simulatedHint")}` : null]
	});
}
function OfflineBanner({ stale }) {
	const t = useT();
	const [offline, setOffline] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const sync = () => setOffline(!navigator.onLine);
		sync();
		window.addEventListener("online", sync);
		window.addEventListener("offline", sync);
		return () => {
			window.removeEventListener("online", sync);
			window.removeEventListener("offline", sync);
		};
	}, []);
	if (!offline && !stale) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "alert",
		className: "rounded-[12px] bg-danger-soft px-3 py-2 text-sm font-medium text-danger",
		children: t("app.stale")
	});
}
var getBootstrap = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9c1bad14012eb0b06c25983a232ff2eb8000d5f62d816034701a770075c5cd56"));
var loadSimulatedKitchen = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("6959e681cc533b3259723efc1a8789361db530f08c008273cd1d59351c0120fd"));
var createRestaurantDraft = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("99b1301f0f002401e907c4d9e8a32e8bbb0eef33897dc777e41ee33da401aa47"));
var updateRestaurantProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("3bbd82d73174bb02f6a6d906d653d997f3b0a21b26eb2f3272b0878b5084887b"));
var submitForReview = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("61ba3f2fe94f1d62d1ac095a8699c55e036ac0bf9d788cdc2a5a0d0b7aa0d8c3"));
var getRestaurant = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("968a877661d5b7d685f4dd76ae577b3bbe89e9d147677736739a0e152a0f6ba4"));
var uploadDocument = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("ed4703c65195865594064f74168b871f976f5070255c999d796b23fd712a33cc"));
function useVendor() {
	const restaurantId = useClientState((s) => s.restaurantId);
	const setRestaurantId = useClientState((s) => s.setRestaurantId);
	const q = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap(),
		staleTime: 15e3
	});
	const memberships = q.data?.memberships ?? [];
	const selected = memberships.find((m) => m.restaurantId === restaurantId) ?? memberships[0] ?? null;
	(0, import_react.useEffect)(() => {
		if (selected && selected.restaurantId !== restaurantId) setRestaurantId(selected.restaurantId);
	}, [
		selected,
		restaurantId,
		setRestaurantId
	]);
	return {
		...q,
		memberships,
		selected,
		restaurantId: selected?.restaurantId,
		dataLabel: selected?.dataLabel,
		role: selected?.role,
		adapters: q.data?.adapters,
		featureFlags: q.data?.featureFlags
	};
}
var PRIMARY_NAV = [
	{
		to: "/dashboard",
		key: "nav.home",
		icon: House,
		perm: "dashboard.view"
	},
	{
		to: "/orders",
		key: "nav.orders",
		icon: ClipboardList,
		perm: "orders.view"
	},
	{
		to: "/kitchen",
		key: "nav.kitchen",
		icon: ChefHat,
		perm: "kitchen.view"
	},
	{
		to: "/menu",
		key: "nav.menu",
		icon: UtensilsCrossed,
		perm: "menu.view"
	}
];
var MORE_NAV = [
	{
		to: "/promotions",
		key: "nav.promotions",
		icon: Tag,
		perm: "promotions.view"
	},
	{
		to: "/settlements",
		key: "nav.settlements",
		icon: Wallet,
		perm: "settlements.view"
	},
	{
		to: "/analytics",
		key: "nav.analytics",
		icon: ChartLine,
		perm: "analytics.view"
	},
	{
		to: "/reviews",
		key: "nav.reviews",
		icon: Star,
		perm: "reviews.view"
	},
	{
		to: "/hours",
		key: "nav.hours",
		icon: Clock3,
		perm: "hours.edit"
	},
	{
		to: "/assistant",
		key: "nav.assistant",
		icon: Sparkles,
		perm: "assistant.use"
	},
	{
		to: "/notifications",
		key: "nav.notifications",
		icon: Bell,
		perm: "notifications.view"
	},
	{
		to: "/onboarding",
		key: "nav.onboarding",
		icon: Store,
		perm: "onboarding.edit"
	},
	{
		to: "/settings",
		key: "nav.settings",
		icon: Settings,
		perm: "settings.view"
	}
];
function VendorShell({ children, title, dataLabel, stale, restaurantName }) {
	const t = useT();
	const { user, isPending } = useCurrentUserState();
	const vendor = useVendor();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const lang = useClientState((s) => s.lang);
	const setLang = useClientState((s) => s.setLang);
	const role = vendor.role;
	const primary = PRIMARY_NAV.filter((item) => !role || can(role, item.perm));
	const more = MORE_NAV.filter((item) => !role || can(role, item.perm));
	const mobilePrimary = (primary.length >= 4 ? primary : [...primary, ...more]).slice(0, 4);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-bg p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-md space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-xl text-ink",
					children: t("app.name")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-40 animate-pulse rounded-full bg-line" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-32 animate-pulse rounded-[24px] bg-line" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-32 animate-pulse rounded-[24px] bg-line" })
			]
		})
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-dvh max-w-6xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-line p-4 md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoshoiMark, { className: "size-8 text-chili" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-base leading-tight",
							children: t("app.name")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted",
							children: restaurantName ?? t("app.tagline")
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex flex-1 flex-col gap-1",
						"aria-label": "Main",
						children: [
							primary.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
								to: item.to,
								active: pathname.startsWith(item.to),
								icon: item.icon,
								children: t(item.key)
							}, item.to)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-3 h-px bg-line" }),
							more.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
								to: item.to,
								active: pathname.startsWith(item.to),
								icon: item.icon,
								children: t(item.key)
							}, item.to))
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col pb-24 md:pb-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-bg px-4 py-3 md:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 md:hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoshoiMark, { className: "size-7 shrink-0 text-chili" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate font-display text-lg",
								children: restaurantName ?? t("app.name")
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "hidden font-display text-2xl md:block",
							children: title
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "inline-flex h-11 items-center gap-1 rounded-[12px] border border-line bg-surface px-3 text-sm",
								onClick: () => setLang(lang === "en" ? "bn" : "en"),
								"aria-label": t("settings.language"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, { className: "size-4" }), lang === "en" ? "বাং" : "EN"]
							}),
							(!role || can(role, "notifications.view")) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/notifications",
								className: "grid size-11 place-items-center rounded-[12px] border border-line bg-surface",
								"aria-label": t("nav.notifications"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden md:block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "flex-1 space-y-4 px-4 py-4 md:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl md:hidden",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfflineBanner, { stale }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataBanner, { label: dataLabel })]
						}),
						children
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden",
			"aria-label": "Mobile",
			children: [mobilePrimary.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				className: cn("flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px]", pathname.startsWith(item.to) ? "text-chili" : "text-muted"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5" }), t(item.key)]
			}, item.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/more",
				className: cn("flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px]", pathname === "/more" || more.some((m) => pathname.startsWith(m.to)) ? "text-chili" : "text-muted"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-5" }), t("nav.more")]
			})]
		})]
	});
}
function NavLink({ to, active, icon: Icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: cn("flex min-h-11 items-center gap-2 rounded-[12px] px-3 text-sm", active ? "bg-chili-soft text-chili-dark" : "text-muted hover:bg-surface-2 hover:text-ink"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), children]
	});
}
//#endregion
export { getRestaurant as a, updateRestaurantProfile as c, createRestaurantDraft as i, uploadDocument as l, UserButton as n, loadSimulatedKitchen as o, VendorShell as r, submitForReview as s, MORE_NAV as t, useVendor as u };
