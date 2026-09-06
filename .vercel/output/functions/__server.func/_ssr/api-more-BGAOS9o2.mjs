import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-N6mvOH4Q.mjs";
import { c as createSsrRpc } from "./router-Couwt5qG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-more-BGAOS9o2.js
var getReviews = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("97f0195818fa8377df5ba02495defe179825ffad561fb06d1d4979c1386fa1d1"));
var respondToReview = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("3949ded01f3542891e4383bf55a1fd4f7bb03aebafec895dbc7b674ce59ac2eb"));
var getNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("bb0f648dc5dbed736f5cf92af846d6c28bc5528ea3d573255c9f04f3e1d0289d"));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("fb53a015bd2b5921aeba204027d456deee251a57814d3d260aff89ae1900df40"));
var listStaff = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("cabaac85081f4afce2dc4b8f4c63ffcb51c2bfb969ef30ea472de824c3750661"));
var addStaff = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("90588cb3d1682925fa229a104ea5bc4054ae21dba15e7232ef2cc0ae7a5bfcac"));
var askAssistant = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("41b310d83ba4c9c41dc718ec1c3f9cd7187c26b60e89c614951b33d156bc6d3a"));
//#endregion
export { listStaff as a, getReviews as i, askAssistant as n, markNotificationsRead as o, getNotifications as r, respondToReview as s, addStaff as t };
