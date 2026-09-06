import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as cn } from "./utils-BZJZXT5Z.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-BJZReGAe.js
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium transition-[opacity,transform,background-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none", {
	variants: {
		variant: {
			primary: "bg-chili text-surface hover:bg-chili-dark shadow-soft",
			secondary: "bg-surface text-ink border border-line hover:bg-surface-2",
			ghost: "bg-transparent text-ink hover:bg-chili-soft",
			danger: "bg-danger text-surface hover:opacity-90",
			leaf: "bg-leaf text-surface hover:opacity-90"
		},
		size: {
			md: "h-11 min-h-11 px-4 text-sm rounded-[12px]",
			lg: "h-14 min-h-14 px-5 text-base rounded-[16px]",
			xl: "h-16 min-h-16 px-6 text-lg rounded-[20px]",
			icon: "size-11 rounded-[12px]"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
export { Button as t };
