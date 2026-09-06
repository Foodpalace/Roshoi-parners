import { n as platformConfig } from "./platform-config-DwNskrvg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-thG64ck_.js
function notificationChannelStatus() {
	return [
		{
			channel: "in_app",
			connected: true,
			provider: "platform"
		},
		{
			channel: "push",
			connected: false,
			provider: platformConfig.notifications.pushProvider
		},
		{
			channel: "sms",
			connected: false,
			provider: platformConfig.notifications.smsProvider
		},
		{
			channel: "whatsapp",
			connected: false,
			provider: platformConfig.notifications.whatsappProvider
		}
	];
}
//#endregion
export { notificationChannelStatus as t };
