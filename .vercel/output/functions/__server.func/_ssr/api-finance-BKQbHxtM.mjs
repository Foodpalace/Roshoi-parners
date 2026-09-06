import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-N6mvOH4Q.mjs";
import { c as createSsrRpc } from "./router-Couwt5qG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-finance-BKQbHxtM.js
var getSettlements = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("b4a89ad8c279ff3f65672681374676267580eb7b7165cea1a33dfcfdbe3e515d"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("b1d22ffe45f397340c3aa93a7581b535584eff22dbd3d1e1c80a240eec8dc4c6"));
var getPromotions = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("222ae520961227a0ad7cde97da0fda59ca2967c2184764c7154f1f3ca74607be"));
var savePromotion = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("3cd1f44a3d815457bb1c18462e9cbbe76e06ad65a85a9c7dc41482d588a8ec63"));
var getAnalytics = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("5ccc90aeb213c330650b3b2aae0688f44acb3bd3b8bbcb2107ccc44f3701f677"));
//#endregion
export { savePromotion as i, getPromotions as n, getSettlements as r, getAnalytics as t };
