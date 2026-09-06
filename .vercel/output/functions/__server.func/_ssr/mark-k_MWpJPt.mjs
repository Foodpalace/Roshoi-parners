import { t as authClient } from "./client-CVqXY6bk.mjs";
import { n as platformConfig } from "./platform-config-DwNskrvg.mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mark-k_MWpJPt.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var useClientState = create()(persist((set) => ({
	lang: platformConfig.localization.defaultLanguage,
	setLang: (lang) => set({ lang }),
	restaurantId: null,
	setRestaurantId: (restaurantId) => set({ restaurantId }),
	soundOn: true,
	setSoundOn: (soundOn) => set({ soundOn })
}), { name: "roshoi-partner-ui" }));
var bn = {
	app: {
		name: "রোসোই পার্টনার",
		tagline: "আপনার রান্নাঘর। আপনার অর্ডার। আপনার হিসাব।",
		simulated: "সিমুলেটেড",
		real: "আসল",
		verified: "যাচাইকৃত",
		notConnected: "সংযুক্ত নয়",
		estimate: "আনুমানিক",
		stale: "সংযোগ নেই — তথ্য পুরনো হতে পারে",
		simulatedHint: "ডেমো রেস্তোরাঁ। এটি কোনো লাইভ কিচেন নয়।"
	},
	auth: {
		signIn: "সাইন ইন",
		signUp: "অ্যাকাউন্ট খুলুন",
		signOut: "সাইন আউট",
		email: "ইমেইল",
		password: "পাসওয়ার্ড",
		name: "আপনার নাম",
		continueGoogle: "Google দিয়ে চালিয়ে যান",
		continueX: "X দিয়ে চালিয়ে যান",
		orEmail: "অথবা ইমেইল ব্যবহার করুন",
		haveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
		noAccount: "নতুন রান্নাঘর?",
		working: "অপেক্ষা করুন…",
		error: "সাইন ইন হয়নি। বিবরণ দেখে আবার চেষ্টা করুন।",
		passwordHint: "কমপক্ষে ৮ অক্ষর"
	},
	landing: {
		kicker: "রেস্তোরাঁ পরিচালনা ব্যবস্থা",
		title: "রান্নাঘর চালান। প্রতিটি টাকা দেখুন।",
		body: "অর্ডার নিন, খাবার রেডি করুন, আর কত পাবেন তা স্পষ্ট দেখুন — কমিশন, নিজের ছাড় ও প্ল্যাটফর্মের অফার আলাদা করে।",
		cta: "পার্টনার সাইন ইন",
		forOwners: "করিমগঞ্জ ও আশপাশের ছোট রান্নাঘরের জন্য। বড় বাটন। সহজ ভাষা। লুকানো কাটা নেই।"
	},
	nav: {
		home: "হোম",
		orders: "অর্ডার",
		kitchen: "কিচেন",
		menu: "মেনু",
		more: "আরও",
		promotions: "অফার",
		settlements: "হিসাব",
		analytics: "বিশ্লেষণ",
		reviews: "রিভিউ",
		notifications: "সতর্কতা",
		assistant: "সহায়ক",
		hours: "সময়",
		settings: "সেটিংস",
		onboarding: "রেস্তোরাঁর তথ্য",
		availability: "উপলব্ধতা"
	},
	dashboard: {
		today: "আজ",
		orders: "অর্ডার",
		sales: "বিক্রি",
		aov: "গড় অর্ডার",
		accepted: "গ্রহণ",
		pending: "অপেক্ষমাণ",
		cancelled: "বাতিল",
		refunds: "রিফান্ড",
		settlement: "আনুমানিক হিসাব",
		prep: "প্রস্তুতির সময়",
		unavailable: "নেই এমন আইটেম",
		rating: "রেটিং",
		repeat: "আবার আসা গ্রাহক",
		attention: "এখন দেখুন",
		noAttention: "কিছু অপেক্ষা করছে না। কিচেন পরিষ্কার।",
		greeting: "স্বাগতম",
		attnPending: "{n}টি অর্ডার গ্রহণের অপেক্ষায়",
		attnUnavailable: "{n}টি আইটেম নেই",
		attnClosing: "রেস্তোরাঁ {n} মিনিটে বন্ধ",
		attnVerify: "কিচেনের অবস্থা {status} — গ্রাহক দেখবেন না",
		attnFssai: "FSSAI নম্বর নেই",
		attnDelay: "{n}টি অর্ডার দেরি",
		attnSettle: "হিসাব প্রস্তুত",
		open: "খোলা",
		closed: "বন্ধ",
		seeOrders: "চলমান অর্ডার খুলুন"
	},
	orders: {
		incoming: "নতুন",
		live: "চলমান অর্ডার",
		history: "ইতিহাস",
		accept: "গ্রহণ",
		reject: "প্রত্যাখ্যান",
		preparing: "রান্না শুরু",
		ready: "রেডি",
		rejectTitle: "কেন প্রত্যাখ্যান করছেন?",
		rejectHint: "কারণ আবশ্যক। চুপচাপ প্রত্যাখ্যান করা যাবে না।",
		special: "বিশেষ নির্দেশ",
		payment: "পেমেন্ট",
		cod: "ক্যাশ অন ডেলিভারি",
		paid: "অনলাইনে পরিশোধিত",
		total: "মোট",
		discount: "ছাড়",
		platformPromo: "প্ল্যাটফর্মের অফার",
		restaurantPromo: "রেস্তোরাঁর অফার",
		empty: "এখন কোনো অর্ডার নেই।",
		received: "এসেছে",
		items: "আইটেম",
		prepTime: "প্রস্তুতির সময়",
		simulateRider: "রাইডার এগিয়ে নিন (সিমুলেটেড)",
		simulateRiderHint: "শুধু সিমুলেটেড কিচেনের জন্য। আসল রাইডার আসবে রাইডার সিস্টেম থেকে।"
	},
	kitchen: {
		title: "কিচেন মোড",
		new: "নতুন",
		accepted: "গ্রহণ",
		preparing: "রান্না",
		ready: "রেডি",
		pickup: "পিকআপ",
		soundOn: "শব্দ চালু",
		soundOff: "শব্দ বন্ধ",
		empty: "কোনো টিকিট নেই।"
	},
	menu: {
		title: "মেনু",
		categories: "ক্যাটাগরি",
		addCategory: "ক্যাটাগরি যোগ",
		addItem: "আইটেম যোগ",
		duplicate: "কপি",
		soldOut: "শেষ",
		available: "আছে",
		unavailable: "সাময়িকভাবে নেই",
		scheduled: "সময়সূচি",
		veg: "নিরামিষ",
		nonveg: "আমিষ",
		egg: "ডিম আছে",
		price: "দাম",
		variants: "সাইজ / ভ্যারিয়েন্ট",
		addons: "অ্যাড-অন",
		save: "সেভ",
		edit: "সম্পাদনা",
		bulk: "একসাথে উপলব্ধতা",
		bulkSoldOut: "নির্বাচিতগুলো শেষ",
		bulkAvailable: "নির্বাচিতগুলো আছে",
		addAddon: "অ্যাড-অন যোগ",
		recommended: "রিকমেন্ডেড",
		noItems: "এখনো কোনো আইটেম নেই। প্রথম খাবার যোগ করুন।",
		name: "নাম",
		description: "বিবরণ",
		prep: "প্রস্তুতির মিনিট"
	},
	promotions: {
		title: "অফার",
		restaurantFunded: "রেস্তোরাঁর খরচে",
		platformFunded: "প্ল্যাটফর্মের খরচে",
		estimate: "দিনে {n} অর্ডারে এই অফার রেস্তোরাঁর আয় প্রায় {amount} কমাতে পারে। এটি একটি আনুমানিক হিসাব।",
		activate: "চালু",
		pause: "থামান",
		create: "নতুন অফার",
		percent: "শতাংশ ছাড়",
		fixed: "নির্দিষ্ট ছাড়",
		item: "আইটেম ছাড়",
		bogo: "এক কিনলে এক ফ্রি",
		minOrder: "সর্বনিম্ন অর্ডার",
		maxDiscount: "সর্বোচ্চ ছাড়"
	},
	settlements: {
		title: "হিসাব",
		payable: "এখন পাওনা",
		pending: "বকেয়া হিসাব",
		completed: "সম্পন্ন",
		exportCsv: "CSV নামান",
		exportJson: "JSON নামান",
		food: "খাবারের মূল্য",
		restDisc: "রেস্তোরাঁর ছাড়",
		commission: "কমিশন",
		packing: "প্যাকেজিং",
		platformDisc: "প্ল্যাটফর্মের ছাড়",
		refund: "রিফান্ড সমন্বয়",
		payableLine: "রেস্তোরাঁর পাওনা",
		other: "অন্য অনুমোদিত কর্তন",
		empty: "এখনো কোনো হিসাব নেই।",
		simulatedNote: "সিমুলেটেড অঙ্ক। আসল পেমেন্ট নয়।",
		formula: "কত পাবেন — হিসাব",
		formulaHint: "খাবার + প্যাকিং − নিজের ছাড় − কমিশন − অনুমোদিত অন্য কাটা + প্ল্যাটফর্মের অফার ± রিফান্ড = রেস্তোরাঁর প্রাপ্য।"
	},
	analytics: {
		title: "বিশ্লেষণ",
		sales: "বিক্রি",
		orders: "অর্ডার",
		items: "আইটেম",
		time: "সময়",
		customers: "গ্রাহক",
		promos: "অফার",
		real: "আসল তথ্য",
		simulated: "সিমুলেটেড তথ্য",
		estimated: "আনুমানিক তথ্য",
		best: "সবচেয়ে চলা",
		low: "কম চলা",
		peak: "ব্যস্ত সময়",
		avgPrep: "গড় প্রস্তুতি"
	},
	reviews: {
		title: "রিভিউ",
		respond: "উত্তর",
		empty: "এখনো কোনো রিভিউ নেই।",
		cannotDelete: "রেস্তোরাঁ রিভিউ মুছতে বা বদলাতে পারে না।"
	},
	assistant: {
		title: "কিচেন সহায়ক",
		placeholder: "আজকের বিক্রি, কম চলা আইটেম বা হিসাব নিয়ে জিজ্ঞাসা করুন…",
		send: "জিজ্ঞাসা",
		disclaimer: "উত্তর শুধু এই রেস্তোরাঁর অনুমোদিত সংখ্যা থেকে। সহায়ক আর্থিক অঙ্ক তৈরি করবে না।",
		unavailable: "এই পরিবেশে AI সংযুক্ত নয়।",
		examples: "আজকের সেরা বিক্রি কোনগুলো?|কোন সময় সবচেয়ে ব্যস্ত?|আমার হিসাব বুঝিয়ে দিন।|কোন আইটেম প্রায়ই থাকে না?"
	},
	onboarding: {
		title: "আপনার রান্নাঘরের কথা বলুন",
		demoCta: "সিমুলেটেড কিচেন দেখুন",
		demoHint: "অনুশীলনের জন্য DEMO তথ্য লোড হয়। এটি লাইভ রেস্তোরাঁ নয়।",
		realCta: "আমার রেস্তোরাঁ নিবন্ধন",
		status: "যাচাইয়ের অবস্থা",
		notVerified: "যাচাই হয়নি। অ্যাডমিন যাচাই না করা পর্যন্ত গ্রাহক এটি দেখবেন না।",
		name: "রেস্তোরাঁর নাম",
		displayName: "দেখানো নাম",
		owner: "মালিকের নাম",
		phone: "ফোন",
		email: "ইমেইল",
		address: "ঠিকানা",
		landmark: "ল্যান্ডমার্ক",
		cuisine: "রান্নার ধরন",
		vegStatus: "খাবারের ধরন",
		description: "বিবরণ",
		gst: "GSTIN",
		fssai: "FSSAI নম্বর",
		pan: "PAN",
		bank: "ব্যাংক অ্যাকাউন্ট",
		ifsc: "IFSC",
		submit: "রিভিউয়ের জন্য পাঠান",
		saveDraft: "খসড়া সেভ",
		submitted: "পাঠানো হয়েছে। প্ল্যাটফর্ম অ্যাডমিন নথি দেখবেন।",
		documents: "নথি",
		storageHint: "ফাইল স্টোরেজ সংযুক্ত নয়। ফাইল স্থানীয়ভাবে PENDING যাচাই অবস্থায় রাখা হয়।"
	},
	hours: {
		title: "সময়",
		closed: "বন্ধ",
		emergency: "জরুরি বন্ধ",
		vacation: "ছুটি মোড",
		split: "ভাগ করা শিফট",
		save: "সময় সেভ",
		peak: "ব্যস্ত সময়ের প্রস্তুতি",
		day0: "রবিবার",
		day1: "সোমবার",
		day2: "মঙ্গলবার",
		day3: "বুধবার",
		day4: "বৃহস্পতিবার",
		day5: "শুক্রবার",
		day6: "শনিবার"
	},
	settings: {
		title: "সেটিংস",
		language: "ভাষা",
		english: "English",
		bengali: "বাংলা",
		commission: "কমিশন",
		staff: "স্টাফ",
		financialLocked: "আপনার ভূমিকায় ব্যাংক ও কমিশন সেটিংস বন্ধ।",
		role: "ভূমিকা",
		add: "যোগ",
		adapters: "সংযোগ",
		snapshotHint: "প্রতি অর্ডারে স্ন্যাপশট। পরে কমিশন বদলালে পুরনো অর্ডার বদলায় না।"
	},
	notifications: {
		title: "সতর্কতা",
		empty: "কোনো সতর্কতা নেই।",
		smsOff: "SMS সংযুক্ত নয়।",
		waOff: "WhatsApp সংযুক্ত নয়।",
		markRead: "পড়া হয়েছে"
	},
	common: {
		save: "সেভ",
		cancel: "বাতিল",
		confirm: "নিশ্চিত",
		loading: "লোড হচ্ছে…",
		retry: "আবার চেষ্টা",
		search: "খুঁজুন",
		minutes: "মিনিট",
		today: "আজ",
		week: "এই সপ্তাহ",
		month: "এই মাস",
		yes: "হ্যাঁ",
		no: "না",
		required: "আবশ্যক",
		close: "বন্ধ",
		back: "পেছনে",
		next: "পরবর্তী",
		filter: "ফিল্টার",
		all: "সব",
		none: "কিছু নয়"
	},
	rejectReasons: {
		item_unavailable: "আইটেম নেই",
		kitchen_overloaded: "কিচেন ব্যস্ত",
		restaurant_closed: "রেস্তোরাঁ বন্ধ",
		technical_issue: "টেকনিক্যাল সমস্যা",
		other: "অন্য"
	},
	status: {
		DRAFT: "খসড়া",
		SUBMITTED: "জমা",
		UNDER_REVIEW: "রিভিউ চলছে",
		VERIFIED: "যাচাইকৃত",
		REJECTED: "প্রত্যাখ্যাত",
		SUSPENDED: "স্থগিত",
		PLACED: "নতুন",
		ACCEPTED: "গ্রহণ",
		PREPARING: "রান্না",
		READY: "রেডি",
		RIDER_ASSIGNED: "রাইডার নিযুক্ত",
		PICKED_UP: "তুলে নিয়েছে",
		ON_THE_WAY: "পথে",
		DELIVERED: "পৌঁছেছে",
		CANCELLED: "বাতিল",
		REFUNDED: "রিফান্ড",
		PARTIAL_REFUND: "আংশিক রিফান্ড",
		FAILED_PAYMENT: "পেমেন্ট হয়নি",
		DELIVERY_FAILED: "ডেলিভারি হয়নি"
	}
};
var en = {
	app: {
		name: "Roshoi Partner",
		tagline: "Your kitchen. Your orders. Your settlement.",
		simulated: "SIMULATED",
		real: "REAL",
		verified: "VERIFIED",
		notConnected: "NOT CONNECTED",
		estimate: "Estimate",
		stale: "CONNECTION LOST — DATA MAY BE OUTDATED",
		simulatedHint: "DEMO RESTAURANT. Not a live kitchen."
	},
	auth: {
		signIn: "Sign in",
		signUp: "Create account",
		signOut: "Sign out",
		email: "Email",
		password: "Password",
		name: "Your name",
		continueGoogle: "Continue with Google",
		continueX: "Continue with X",
		orEmail: "Or use email",
		haveAccount: "Already have an account?",
		noAccount: "New kitchen?",
		working: "Please wait…",
		error: "Could not sign in. Check your details and try again.",
		passwordHint: "At least 8 characters"
	},
	landing: {
		kicker: "Restaurant operating system",
		title: "Run the kitchen. Keep every rupee visible.",
		body: "Accept orders, mark food ready, and see exactly what you will be paid — commission, restaurant discounts and platform-funded offers, separately.",
		cta: "Partner sign in",
		forOwners: "Built for small kitchens in Karimganj and beyond. Large buttons. Plain language. No hidden deductions."
	},
	nav: {
		home: "Home",
		orders: "Orders",
		kitchen: "Kitchen",
		menu: "Menu",
		more: "More",
		promotions: "Offers",
		settlements: "Settlement",
		analytics: "Analytics",
		reviews: "Reviews",
		notifications: "Alerts",
		assistant: "Assistant",
		hours: "Hours",
		settings: "Settings",
		onboarding: "Restaurant profile",
		availability: "Availability"
	},
	dashboard: {
		today: "Today",
		orders: "Orders",
		sales: "Sales",
		aov: "Average order",
		accepted: "Accepted",
		pending: "Waiting",
		cancelled: "Cancelled",
		refunds: "Refunds",
		settlement: "Estimated settlement",
		prep: "Prep performance",
		unavailable: "Unavailable items",
		rating: "Customer rating",
		repeat: "Repeat customers",
		attention: "What needs attention",
		noAttention: "Nothing waiting. Kitchen is clear.",
		greeting: "Good to see you",
		attnPending: "{n} order(s) waiting for acceptance",
		attnUnavailable: "{n} item(s) unavailable",
		attnClosing: "Restaurant closing in {n} minutes",
		attnVerify: "Kitchen is {status} — not shown to customers",
		attnFssai: "FSSAI number missing",
		attnDelay: "{n} delayed order(s)",
		attnSettle: "Settlement available",
		open: "Open",
		closed: "Closed",
		seeOrders: "Open live orders"
	},
	orders: {
		incoming: "Incoming",
		live: "Live orders",
		history: "History",
		accept: "Accept",
		reject: "Reject",
		preparing: "Start preparing",
		ready: "Mark ready",
		rejectTitle: "Why are you rejecting?",
		rejectHint: "A reason is required. Silent rejection is not allowed.",
		special: "Special instructions",
		payment: "Payment",
		cod: "Cash on delivery",
		paid: "Paid online",
		total: "Total",
		discount: "Discount",
		platformPromo: "Platform-funded offer",
		restaurantPromo: "Restaurant-funded offer",
		empty: "No orders right now.",
		received: "Received",
		items: "Items",
		prepTime: "Prep time",
		simulateRider: "Advance rider (simulated)",
		simulateRiderHint: "Only for simulated kitchens. Real rider assignment comes from the rider system."
	},
	kitchen: {
		title: "Kitchen mode",
		new: "NEW",
		accepted: "ACCEPTED",
		preparing: "PREPARING",
		ready: "READY",
		pickup: "PICKUP",
		soundOn: "Sound on",
		soundOff: "Sound off",
		empty: "No tickets."
	},
	menu: {
		title: "Menu",
		categories: "Categories",
		addCategory: "Add category",
		addItem: "Add item",
		duplicate: "Duplicate",
		soldOut: "Sold out",
		available: "Available",
		unavailable: "Temporarily unavailable",
		scheduled: "Scheduled",
		veg: "Veg",
		nonveg: "Non-veg",
		egg: "Contains egg",
		price: "Price",
		variants: "Sizes / variants",
		addons: "Add-ons",
		save: "Save",
		edit: "Edit",
		bulk: "Bulk availability",
		bulkSoldOut: "Mark selected sold out",
		bulkAvailable: "Mark selected available",
		addAddon: "Add add-on",
		recommended: "Recommended",
		noItems: "No items yet. Add your first dish.",
		name: "Name",
		description: "Description",
		prep: "Prep minutes"
	},
	promotions: {
		title: "Offers",
		restaurantFunded: "Restaurant-funded",
		platformFunded: "Platform-funded",
		estimate: "At {n} orders/day, this offer may reduce restaurant revenue by approximately {amount}. This is an estimate.",
		activate: "Activate",
		pause: "Pause",
		create: "New offer",
		percent: "Percentage off",
		fixed: "Fixed amount off",
		item: "Item discount",
		bogo: "Buy one get one",
		minOrder: "Minimum order",
		maxDiscount: "Maximum discount"
	},
	settlements: {
		title: "Settlement",
		payable: "Current payable",
		pending: "Pending settlement",
		completed: "Completed",
		exportCsv: "Download CSV",
		exportJson: "Download JSON",
		food: "Food value",
		restDisc: "Restaurant discount",
		commission: "Commission",
		packing: "Packaging",
		platformDisc: "Platform-funded discount",
		refund: "Refund adjustment",
		payableLine: "Restaurant payable",
		other: "Other authorised deduction",
		empty: "No settlement lines yet.",
		simulatedNote: "Simulated figures. Not a real payout.",
		formula: "How payable is calculated",
		formulaHint: "Food + packing − restaurant discount − commission − other authorised deduction + platform-funded offer ± refund = restaurant payable."
	},
	analytics: {
		title: "Analytics",
		sales: "Sales",
		orders: "Orders",
		items: "Items",
		time: "Time",
		customers: "Customers",
		promos: "Offers",
		real: "REAL DATA",
		simulated: "SIMULATED DATA",
		estimated: "ESTIMATED DATA",
		best: "Best sellers",
		low: "Low performers",
		peak: "Peak hours",
		avgPrep: "Average preparation"
	},
	reviews: {
		title: "Reviews",
		respond: "Reply",
		empty: "No reviews yet.",
		cannotDelete: "Reviews cannot be deleted or altered by the restaurant."
	},
	assistant: {
		title: "Kitchen assistant",
		placeholder: "Ask about today’s sales, slow items, or your settlement…",
		send: "Ask",
		disclaimer: "Answers use only this restaurant’s authorised numbers. The assistant will not invent financial figures.",
		unavailable: "AI is not connected in this environment.",
		examples: "What were my best-selling items today?|Which hours were busiest?|Explain my settlement.|Which items are often unavailable?"
	},
	onboarding: {
		title: "Tell us about your kitchen",
		demoCta: "Explore a simulated kitchen",
		demoHint: "Loads labelled DEMO data so you can practise orders. It is not a live restaurant.",
		realCta: "Register my restaurant",
		status: "Verification status",
		notVerified: "Not verified. Customers will not see this kitchen until a platform admin verifies it.",
		name: "Restaurant name",
		displayName: "Display name",
		owner: "Owner name",
		phone: "Phone",
		email: "Email",
		address: "Address",
		landmark: "Landmark",
		cuisine: "Cuisine",
		vegStatus: "Food type",
		description: "Description",
		gst: "GSTIN",
		fssai: "FSSAI number",
		pan: "PAN",
		bank: "Bank account",
		ifsc: "IFSC",
		submit: "Submit for review",
		saveDraft: "Save draft",
		submitted: "Submitted. A platform admin will review your documents.",
		documents: "Documents",
		storageHint: "File storage is NOT CONNECTED. The file is recorded locally with PENDING verification."
	},
	hours: {
		title: "Hours",
		closed: "Closed",
		emergency: "Emergency close",
		vacation: "Vacation mode",
		split: "Split shift",
		save: "Save hours",
		peak: "Peak prep minutes",
		day0: "Sunday",
		day1: "Monday",
		day2: "Tuesday",
		day3: "Wednesday",
		day4: "Thursday",
		day5: "Friday",
		day6: "Saturday"
	},
	settings: {
		title: "Settings",
		language: "Language",
		english: "English",
		bengali: "বাংলা",
		commission: "Commission",
		staff: "Staff",
		financialLocked: "Bank and commission settings are restricted for your role.",
		role: "Role",
		add: "Add",
		adapters: "Connections",
		snapshotHint: "Snapshot per order. Changing commission later does not rewrite history."
	},
	notifications: {
		title: "Alerts",
		empty: "No alerts.",
		smsOff: "SMS is not connected.",
		waOff: "WhatsApp is not connected.",
		markRead: "Mark read"
	},
	common: {
		save: "Save",
		cancel: "Cancel",
		confirm: "Confirm",
		loading: "Loading…",
		retry: "Try again",
		search: "Search",
		minutes: "min",
		today: "Today",
		week: "This week",
		month: "This month",
		yes: "Yes",
		no: "No",
		required: "Required",
		close: "Close",
		back: "Back",
		next: "Next",
		filter: "Filter",
		all: "All",
		none: "None"
	},
	rejectReasons: {
		item_unavailable: "Item unavailable",
		kitchen_overloaded: "Kitchen overloaded",
		restaurant_closed: "Restaurant closed",
		technical_issue: "Technical issue",
		other: "Other"
	},
	status: {
		DRAFT: "Draft",
		SUBMITTED: "Submitted",
		UNDER_REVIEW: "Under review",
		VERIFIED: "Verified",
		REJECTED: "Rejected",
		SUSPENDED: "Suspended",
		PLACED: "New",
		ACCEPTED: "Accepted",
		PREPARING: "Preparing",
		READY: "Ready",
		RIDER_ASSIGNED: "Rider assigned",
		PICKED_UP: "Picked up",
		ON_THE_WAY: "On the way",
		DELIVERED: "Delivered",
		CANCELLED: "Cancelled",
		REFUNDED: "Refunded",
		PARTIAL_REFUND: "Partial refund",
		FAILED_PAYMENT: "Payment failed",
		DELIVERY_FAILED: "Delivery failed"
	}
};
var dictionaries = {
	en,
	bn
};
function lookup(tree, path) {
	let cur = tree;
	for (const part of path.split(".")) {
		if (typeof cur !== "object" || cur == null) return void 0;
		cur = cur[part];
	}
	return typeof cur === "string" ? cur : void 0;
}
function translate(lang, key, vars) {
	let text = lookup(dictionaries[lang] ?? dictionaries[platformConfig.localization.defaultLanguage], key) ?? lookup(en, key) ?? key;
	if (vars) for (const [k, v] of Object.entries(vars)) text = text.replaceAll(`{${k}}`, String(v));
	return text;
}
function useT() {
	const lang = useClientState((s) => s.lang);
	return (key, vars) => translate(lang, key, vars);
}
function RoshoiMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className,
		"aria-hidden": "true",
		fill: "none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "32",
				height: "32",
				rx: "8",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M8 20c0-3 2.4-6.5 8-6.5S24 17 24 20",
				stroke: "#FFFDF8",
				strokeWidth: "1.8",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M10 20.5h12c.4 3.2-2.6 5.5-6 5.5s-6.4-2.3-6-5.5Z",
				fill: "#FFFDF8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M14 9.5c0 2-.8 3-1.6 3.5",
				stroke: "#FFFDF8",
				strokeWidth: "1.4",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M18 8.5c0 2.2-.7 3.4-1.5 4",
				stroke: "#FFFDF8",
				strokeWidth: "1.4",
				strokeLinecap: "round"
			})
		]
	});
}
//#endregion
export { useT as a, useCurrentUserState as i, useClientState as n, useCurrentUser as r, RoshoiMark as t };
