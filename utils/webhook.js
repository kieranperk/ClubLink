
// Import Modules

const c = require("centra");
const WEBHOOK_URL = require("../settings").webhookURL;

// Send Webhook

async function sendWebhook(type, args) {
    if (type == "join") {
		await c(WEBHOOK_URL, "POST")
			.body({
				username: `ClubLink [${args.BOT.username}]`,
				avatar_url: `https://crafatar.com/renders/head/${args.BOT.player.uuid}?overlay`,
				embeds: [
					{	
						footer: {
							text: "Powered by ClubLink | By Mountain#4644"
						},
						title: "Connected to ClubChunk",
						color: 0x74fb82,
					},
				],
			})
			.send();
		return;
	}
	if (type == "inactivityRewards") {
		await c(WEBHOOK_URL, "POST")
			.body({
				username: `ClubLink [${args.BOT.username}]`,
				avatar_url: `https://crafatar.com/renders/head/${args.BOT.player.uuid}?overlay`,
				embeds: [
					{
						title: "Inactivity Rewards Recieved",
						color: 0x249dda,
						description: args.msg,
					},
				],
			})
			.send();
		return;
	}
	if (type == "marketSold") {
		await c(WEBHOOK_URL, "POST")
			.body({
				username: `ClubLink [${args.BOT.username}]`,
				avatar_url: `https://crafatar.com/renders/head/${args.BOT.player.uuid}?overlay`,
				embeds: [
					{
						title: "Item sold!",
						color: 0xffc850,
						description: args.msg,
					},
				],
			})
			.send();
		return;
	}
	if (type == "dm") {
		await c(WEBHOOK_URL, "POST")
			.body({
				username: `ClubLink [${args.BOT.username}]`,
				avatar_url: `https://crafatar.com/renders/head/${args.BOT.player.uuid}?overlay`,
				embeds: [
					{
						title: `${args.username} -> ME`,
						color: 0x6f6f6f,
						description: args.msg,
					},
				],
			})
			.send();
		return;
	}
	if (type == "kick") {
		await c(WEBHOOK_URL, "POST")
			.body({
				username: `ClubLink [${args.BOT.username}]`,
				avatar_url: `https://crafatar.com/renders/head/${args.BOT.player.UUID}?overlay`,
				embeds: [
					{
						footer: {
							text: "Powered by ClubLink | By Mountain#4644"
						},
						title: "Kicked from ClubChunk",
						color: 0xff0000,
						description: [
							`Kick reason: \`${args.reason}\``,
							`\n**Stats**`,
							args.msg
						].join("\n"),
					},
				],
			})
			.send();
		return;
	}
	if (type == "disconnect") {
		await c(WEBHOOK_URL, "POST")
			.body({
				username: `ClubLink [${args.BOT.username}]`,
				avatar_url: `https://crafatar.com/renders/head/${args.BOT.player.UUID}?overlay`,
				embeds: [
					{
						footer: {
							text: "Powered by ClubLink | By Mountain#4644"
						},
						title: "Disconnected from ClubChunk",
						color: 0x4fabed,
						description: args.msg,
					},
				],
			})
			.send();
		return;
	}
}

// Export Module

module.exports = { sendWebhook };