
// Import Modules

const settings = require("./settings");
const fm = require('kleur');
const mineflayer = require("mineflayer");
const { messageCreator } = require("./utils/message");
const { sendWebhook } = require("./utils/webhook");
const { discordStatus } = require("./utils/status");

// Bot Settings

const SETTINGS = {
	host: "play.clubchunk.com",
    auth: "microsoft",
	username: settings.username,
	password: "",
	version: settings.version
};

// Setting Checks

if (!SETTINGS.username) { console.log(fm.red("Username required!")); return; }
if (!SETTINGS.password && SETTINGS.auth != "microsoft") { console.log(fm.red("Password required!")); return; }
if (!SETTINGS.auth) { console.log(fm.red("AuthType required!")); return; }
if (!settings.webhookURL) { console.log(fm.red("Webhook URL required!")); return; }

// Session Stats

const STATS = {
    startTime: 0,
	endTime: 0,
    totalCoins: 0,
    activityCoins: 0,
    marketCoins: 0,
    totalExp: 0,
    activityExp: 0,
    goodnights: 0,
    pings: 0,
}

// Bot

function createBot() {
    const BOT = mineflayer.createBot(SETTINGS);
    console.log(fm.yellow("Waiting for connection..."));

    BOT.once("spawn", async () => {
        if (STATS.startTime === 0) { STATS.startTime = Date.now(); }
        BOT.acceptResourcePack();
        discordStatus(BOT.username, "In Lobby", STATS.startTime)
        await sendWebhook("join", { BOT });
        console.log(fm.green("Connected to \'play.clubchunk.com\'"));
    });

	BOT.on("messagestr", async (message) => {
        if (message.includes("公 +5 Inactive Playtime")) {
            const COINS = 5; const EXP = 10;
            STATS.activityCoins+= COINS; STATS.activityExp+= EXP;
            if (settings.notifications.inactivityRewards.enabled === true) {
                console.log(fm.blue("Inactive Playtime Rewards: +5 Coins, +10 EXP"));
                const MSG = await messageCreator("inactivityRewards", { coins: COINS, exp: EXP, STATS });
                sendWebhook("inactivityRewards", { BOT, msg: MSG  });
            }
        } else if (message.match(/矣 Your (.*) has sold to (.*) for (.*)ꌅ公/) && settings.notifications.market.enabled == true) {
            var [, ITEM, BUYER, AMOUNT] = message.match(/矣 Your (.*) has sold to (.*) for (.*)ꌅ公/);
            ITEM = ITEM.replace(/[^\w\s]/gi, ''); BUYER = BUYER.replace(/[^\w\s]/gi, ''); AMOUNT = parseInt(AMOUNT);
            STATS.marketCoins+= AMOUNT;
            const MSG = messageCreator("marketSold", { item: ITEM, buyer: BUYER, amount: AMOUNT });
            await sendWebhook("marketSold", { msg: MSG, BOT });
        } else if (message.match(/[\W]+(\w+) -> ME: ([\w\W]+)/g) && settings.notifications.dms.enabled == true) {
            const MSG = messageCreator("message", { message: message.replace(/[\W]+(\w+) -> ME: ([\w\W]+)/g, "$2" )});
            const USERNAME = message.replace(/[\W]+(\w+) -> ME: ([\w\W]+)/g, "$1");
            await sendWebhook("dm", { msg: MSG, username: USERNAME, BOT });
            if (settings.notifications.dms.autoresponder != null) { BOT.chat("/reply " + settings.notifications.dms.autoresponder) }
        
        }
    });

    BOT.on("kicked", async (reason, loggedIn) => {
        STATS.endTime = Date.now();
        reason = JSON.parse(reason).extra[0].translate;
        const MSG = messageCreator("exit", { STATS });
        await sendWebhook("kick", { BOT, reason, msg: MSG });
		process.exit();
	});

    process.on("SIGINT", () => shutdown());
	process.on("SIGTERM", () => shutdown());

	async function shutdown(){
        console.log(fm.yellow("Disconnecting from server..."));
		STATS.endTime = Date.now();
		const MSG = messageCreator("exit", { STATS });
		await sendWebhook("disconnect", { BOT, msg: MSG });
        console.log(fm.red("Disconnected"));
		process.exit();
	}
}

createBot();
