
// Import Modules

const formatDuration = require("format-duration");
const { emojiConvert } = require("./emojis");

// Message Creator Function

function messageCreator(type, args) {
    if (type == "exit") {
		msg = [
			`Session Time: \`${formatDuration( args.STATS.endTime - args.STATS.startTime )}\``,
			"\n<:cc_coins:1071636319220019212> **Coin Stats**",
			`Total Coins: \`${args.STATS.totalCoins + args.STATS.activityCoins + args.STATS.marketCoins}\``,
			`Activity Coins: \`${args.STATS.activityCoins}\``,
			`Market Coins: \`${args.STATS.marketCoins}\``,
			"\n<:cc_exp:1071636352619257956> **EXP Stats**",
			`Total EXP: \`${args.STATS.totalExp + args.STATS.activityExp}\``,
			`Activity EXP: \`${args.STATS.activityExp}\``,
		].join("\n");
	} else if (type == "inactivityRewards") {
		msg = [
			`<:cc_coins:1071636319220019212> \`+${args.coins}\` has been rewarded for being afk!`,
			`<:cc_exp:1071636352619257956> \`+${args.exp}\` has been rewarded for being afk!`,
		].join("\n");
	} else if (type == "marketSold") {
		msg = `Your ${args.item} has sold to ${args.buyer} for ${args.amount} <:cc_coins:1071636319220019212>`;
	} else if (type == "message") {
		msg = args.message;
		if (msg.match(/[\W]/g)) {
			for (const emoji of msg.match(/[\W]/g)) {
				if (emojiConvert(emoji)) {
					msg = msg.replace(emoji, emojiConvert(emoji));
				}
			}
		}
	}
	return msg;
}

// Export Module

module.exports = { messageCreator };