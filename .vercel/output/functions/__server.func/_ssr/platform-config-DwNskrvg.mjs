//#region node_modules/.nitro/vite/services/ssr/assets/platform-config-DwNskrvg.js
var platformConfig = {
	brand: {
		appName: "Roshoi Partner",
		shortAppName: "Roshoi",
		tagline: "Your kitchen. Your orders. Your settlement.",
		restaurantFacingBrandName: "Roshoi Partner",
		customerFacingBrand: "Roshoi",
		adminFacingBrand: "Roshoi Command",
		legalCompanyName: "Roshoi Marketplace",
		domain: "roshoi.in",
		notificationSenderName: "Roshoi",
		invoiceFooter: "Thank you for cooking with Roshoi.",
		logo: "/brand/logo.svg",
		darkLogo: "/brand/logo-dark.svg",
		lightLogo: "/brand/logo-light.svg",
		favicon: "/favicon.svg",
		appIcon: "/brand/app-icon.svg",
		restaurantFacingLogo: "/brand/logo.svg"
	},
	theme: {
		primary: "#B33A1B",
		secondary: "#2F5D50",
		accent: "#B33A1B",
		background: "#F4EFE6",
		surface: "#FFFDF8",
		text: "#1C1714",
		textMuted: "#6F645B",
		border: "#E4D8C8",
		danger: "#9B1D1D",
		warning: "#8A5A12",
		success: "#2F5D50",
		typography: {
			display: "\"Fraunces\", \"Noto Serif Bengali\", serif",
			body: "\"Figtree\", \"Hind Siliguri\", system-ui, sans-serif"
		}
	},
	localization: {
		defaultLanguage: "en",
		supportedLanguages: ["en", "bn"],
		futureLanguages: ["as"]
	},
	restaurantSettings: {
		defaultPrepMinutes: 20,
		defaultPeakPrepMinutes: 30,
		defaultCommissionBps: 1e3,
		orderPollMs: 4e3,
		kitchenPollMs: 3e3,
		maxUploadBytes: 524288,
		allowedDocumentTypes: [
			"application/pdf",
			"image/jpeg",
			"image/png",
			"image/webp"
		],
		allowedImageTypes: [
			"image/jpeg",
			"image/png",
			"image/webp"
		]
	},
	fees: {
		currency: "INR",
		currencySymbol: "₹",
		moneyUnit: "paise",
		defaultPackingPaise: 0
	},
	commission: {
		targetBps: 1e3,
		allowedBps: [
			0,
			500,
			800,
			1e3,
			1200
		],
		allowCustom: true
	},
	notifications: {
		smsProvider: "NOT_CONNECTED",
		whatsappProvider: "NOT_CONNECTED",
		pushProvider: "NOT_CONNECTED",
		smsSender: "",
		whatsappSender: ""
	},
	legal: {
		gstInformation: "",
		fssaiInformation: "",
		supportPhone: "",
		supportEmail: "partners@roshoi.in",
		socialLinks: {
			instagram: "",
			facebook: "",
			x: ""
		}
	},
	support: {
		phone: "",
		email: "partners@roshoi.in",
		helpCenter: ""
	},
	featureFlags: {
		restaurant_ai: true,
		restaurant_analytics: true,
		promotions: true,
		advanced_inventory: false,
		multi_outlet: true,
		whatsapp_notifications: false,
		sms_notifications: false,
		pwa: true,
		offline_mode: true,
		new_order_sound: true
	},
	dataLabels: [
		"SIMULATED",
		"REAL",
		"VERIFIED"
	]
};
function isFeatureEnabled(flag) {
	return platformConfig.featureFlags[flag];
}
//#endregion
export { platformConfig as n, isFeatureEnabled as t };
