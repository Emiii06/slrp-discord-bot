const { EmbedBuilder } = require("discord.js");
const { MOD_LOG_CHANNEL } = require("../config");

const ACTIONS = {
    kick: {
        title: "🚨 SLRP Kick Log",
        color: "#FF3B30"
    },
    warn: {
        title: "⚠️ SLRP Warning Log",
        color: "#F1C40F"
    },
    ban: {
        title: "⛔ SLRP Ban Log",
        color: "#8B0000"
    },
    mute: {
        title: "🔇 SLRP Mute Log",
        color: "#3498DB"
    }
};

async function sendModLog(client, message, action, player, reason) {

    const config = ACTIONS[action];

    if (!config) return;

    const embed = new EmbedBuilder()
        .setColor(config.color)
        .setTitle(config.title)
        .addFields(
            {
                name: "👤 Player",
                value: player,
                inline: true
            },
            {
                name: "🛡️ Staff",
                value: message.member.displayName,
                inline: true
            },
            {
                name: "📝 Action",
                value: action.toUpperCase(),
                inline: true
            },
            {
                name: "📌 Reason",
                value: reason,
                inline: false
            }
        )
        .setFooter({
            text: "State Line Roleplay • Moderation Log"
        })
        .setTimestamp();

    const channel = await client.channels.fetch(MOD_LOG_CHANNEL);

    await channel.send({
        embeds: [embed]
    });

}

module.exports = {
    sendModLog
};