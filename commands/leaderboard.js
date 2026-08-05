const { EmbedBuilder } = require("discord.js");
const cron = require("node-cron");

const {
    users,
    saveData
} = require("../database");

const {
    ANNOUNCEMENT_CHANNEL
} = require("../config");

const {
    isStaff,
    isAdmin
} = require("../utils/permissions");

module.exports = (client) => {

    async function sendWeeklyLeaderboard(reset = false) {

        const channel = await client.channels.fetch(ANNOUNCEMENT_CHANNEL);

        if (!channel) return;

        const leaderboard = [];

        for (const [id, user] of users.entries()) {
            leaderboard.push({
                id,
                weekTime: user.weekTime
            });
        }

        leaderboard.sort((a, b) => b.weekTime - a.weekTime);

        let description = "";
        let totalTime = 0;
        let activeUsers = 0;

        const medals = ["🥇", "🥈", "🥉"];

        for (let i = 0; i < leaderboard.length; i++) {

            const entry = leaderboard[i];

            if (entry.weekTime <= 0) continue;

            totalTime += entry.weekTime;
            activeUsers++;

            const totalSeconds = Math.floor(entry.weekTime / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);

            const place = medals[i] ?? `**${i + 1}.**`;

            description += `${place} <@${entry.id}> • **${hours}h ${minutes}m**\n`;
        }

        if (description === "") {
            description = "*Nobody has been on duty this week.*";
        }

        const totalHours = Math.floor(totalTime / 1000 / 3600);
        const totalMinutes = Math.floor((totalTime / 1000 % 3600) / 60);

        const embed = new EmbedBuilder()
            .setColor("#2B2D31")
            .setTitle("📊 Weekly Staff Activity")
            .setDescription(description)
            .addFields(
                {
                    name: "👥 Active Staff",
                    value: `${activeUsers}`,
                    inline: true
                },
                {
                    name: "⏳ Total Duty Time",
                    value: `${totalHours}h ${totalMinutes}m`,
                    inline: true
                }
            )
            .setFooter({
                text: "State Line Roleplay • Weekly Activity"
            })
            .setTimestamp();

        await channel.send({
            embeds: [embed]
        });

        if (reset) {

            for (const user of users.values()) {
                user.weekTime = 0;
            }

            saveData();
        }

    }

    cron.schedule("0 20 * * 0", async () => {
        await sendWeeklyLeaderboard(true);
    });

    return async (message, args, command) => {

        if (command === "!weekly") {

            if (!isStaff(message.member))
                return message.reply("❌ You don't have permission.");

            await sendWeeklyLeaderboard(false);
        }

        if (command === "!weeklyreset") {

            if (!isAdmin(message.member))
                return message.reply("❌ You don't have permission.");

            await sendWeeklyLeaderboard(true);
        }

    };

};