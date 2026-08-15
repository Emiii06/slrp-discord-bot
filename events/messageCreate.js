const { ALLOWED_CHANNELS } = require("../config");

const application = require("../commands/application");
const moderation = require("../commands/moderation");
const duty = require("../commands/duty");
const birthdays = require("../commands/birthdays");
const leaderboardFactory = require("../commands/leaderboard");
const announcements = require("../commands/announcements");
const automod = require("../commands/automod");
const continueApplication = require("../commands/continueapplication");


console.log("MESSAGE CREATE MODULE LOADED");

module.exports = (client) => {

    console.log("MESSAGE CREATE HANDLER REGISTERED");

    const leaderboard = leaderboardFactory(client);

    client.on("messageCreate", async (message) => {

        if (message.author.bot) return;
        await automod(client, message);

        console.log("MESSAGE RECEIVED:", message.content);

        const args = message.content.trim().split(/\s+/);
        const command = args[0].toLowerCase();

        if (!["!", "?"].includes(message.content[0])) {
            return;
        }

        console.log("MESSAGE:", message.content);
        console.log("CHANNEL ID:", message.channel.id);
        console.log("ALLOWED CHANNELS:", ALLOWED_CHANNELS);

        /*
        APPLICATIONS
        */

        if (command === "!apply") {

            console.log("APPLICATION COMMAND DETECTED");

            await application(
                client,
                message,
                args,
                command
            );

            return;
        }

        if (command === "!continueapplication") {
            await continueApplication(client, message);
            return;
        }


        /*
        NORMAL COMMAND CHANNEL CHECK
        */



        if (!ALLOWED_CHANNELS.includes(message.channel.id)) {
            return;
        }

        await moderation(
            client,
            message,
            args,
            command
        );

        await duty(
            client,
            message,
            args,
            command
        );

        await leaderboard(
            message,
            args,
            command
        );

        await birthdays(
            client,
            message,
            args,
            command
        );

        await announcements(
            client,
            message,
            args,
            command
        );
    });
};