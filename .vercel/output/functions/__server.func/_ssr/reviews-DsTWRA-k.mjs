import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as useT } from "./mark-k_MWpJPt.mjs";
import { r as VendorShell, u as useVendor } from "./vendor-shell-BlujHxVb.mjs";
import { t as Button } from "./button-BJZReGAe.mjs";
import { t as Card } from "./card-BlL678bI.mjs";
import { r as Textarea } from "./input-Dj6qv6Kf.mjs";
import { i as getReviews, s as respondToReview } from "./api-more-BGAOS9o2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reviews-DsTWRA-k.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReviewsPage() {
	const t = useT();
	const vendor = useVendor();
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["reviews", vendor.restaurantId],
		queryFn: () => getReviews({ data: { restaurantId: vendor.restaurantId } }),
		enabled: Boolean(vendor.restaurantId)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(VendorShell, {
		title: t("nav.reviews"),
		dataLabel: q.data?.dataLabel ?? vendor.dataLabel,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: t("reviews.cannotDelete")
		}), (q.data?.reviews.length ?? 0) === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "text-sm text-muted",
			children: t("reviews.empty")
		}) : q.data?.reviews.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewRow, {
			review: r,
			canRespond: Boolean(q.data?.canRespond),
			restaurantId: vendor.restaurantId,
			onSaved: () => void qc.invalidateQueries({ queryKey: ["reviews"] })
		}, r.id))]
	});
}
function ReviewRow({ review, canRespond, restaurantId, onSaved }) {
	const t = useT();
	const [text, setText] = (0, import_react.useState)(review.response ?? "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-semibold tabular",
					children: [review.rating, "/5"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted",
					children: new Date(review.createdAt).toLocaleDateString("en-IN")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: review.body }),
			review.response ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-[12px] bg-surface-2 p-2 text-sm",
				children: review.response
			}) : null,
			canRespond ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: text,
					onChange: (e) => setText(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: () => void respondToReview({ data: {
						restaurantId,
						reviewId: review.id,
						body: text
					} }).then(onSaved),
					children: t("reviews.respond")
				})]
			}) : null
		]
	});
}
//#endregion
export { ReviewsPage as component };
