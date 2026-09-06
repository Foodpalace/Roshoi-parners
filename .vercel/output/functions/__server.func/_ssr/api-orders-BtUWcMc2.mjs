import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-N6mvOH4Q.mjs";
import { c as createSsrRpc } from "./router-Couwt5qG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-orders-BtUWcMc2.js
var listOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("c8c37c09ba07ecfe2b47463f962436c7847d47e407b9d51f39b43b3139795738"));
var transitionOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("5569ef6de87d66d0c31f7774a5a299e351ec275421056a6dedfaecd46e62204e"));
var advanceSimulatedRider = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("1b734824599414618d62e0e2a27f257918eabfd5fad2b14500ff2f024a5be314"));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("45eecb9802db3a8af9d742694b69311436aa7d0ce13249e32932ee78afc3bab7"));
var getOperatingSnapshot = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("ffa61d595de0c2d85935c70833c9e8a639508e781b0d12e54ab23e265a5a80ce"));
var saveHours = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("fd97d75f6fb3e2ec2fb9024c8f8be9544fcf58a644712948f5d9eef1a4cc79af"));
//#endregion
export { saveHours as a, listOrders as i, getDashboard as n, transitionOrder as o, getOperatingSnapshot as r, advanceSimulatedRider as t };
