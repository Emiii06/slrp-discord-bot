
const { ALLOWED_CHANNELS } = require("../config");

const moderation = require("../commands/moderation");
const duty = require("../commands/duty");
const birthdays = require("../commands/birthdays")
const leaderboard = require("../commands/leaderboard");

module.exports = (client) => {

    const leaderboard = require("../commands/leaderboard")(client);
    client.on("messageCreate", async (message) => {

        if (message.author.bot) return;

        const args = message.content.trim().split(/\s+/);
        const command = args[0].toLowerCase();

        if (!["!", "?"].includes(message.content[0])) return;

        if (!ALLOWED_CHANNELS.includes(message.channel.id)) {
            return;
        }

        await moderation(client, message, args, command);
        await duty(client, message, args, command);
        await leaderboard(message, args, command);

        console.log("Calling birthdays:", command);
        await birthdays(client, message, args, command);
        console.log("Finished birthdays");
    });

};