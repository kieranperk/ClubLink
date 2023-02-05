
// Import Modules

const fm = require('kleur');
const clientId = "993171417807990887"
const DiscordRPC = require("discord-rpc");
const RPC = new DiscordRPC.Client({ transport: "ipc" });
DiscordRPC.register(clientId);

// Update Status Function

async function updateStatus(username, state, startTime) {
  if (!RPC) return;

  RPC.setActivity({
    details: username,
    state: state,
    startTimestamp: startTime,
    largeImageKey: "icon",
	  largeImageText: 'play.clubchunk.com',
    instance: false,
    buttons: [
      {
        label: `Get ClubLink!`,
        url: `https://github.com/kieranperk/clublink`,
      },
    ]
  });
};

// Start Status Function

function discordStatus(username, state, startTime) {
	RPC.on("ready", async () => {
		setInterval(async () => {
			await updateStatus(username, state, startTime);
		}, 5000);
	});
	RPC.login({ clientId });
}

// Error Handling

process.on("unhandledRejection", (err) => {
	if (err.message === "Could not connect") {
		console.log(fm.red("Unable to start Discord Status. Make sure Discord is open for this to run (ClubLink will continue to run, but Discord status has been disabled)"));
		return;
	}
});

// Export Module

module.exports = { discordStatus };