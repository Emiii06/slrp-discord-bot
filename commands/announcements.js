const { EmbedBuilder } = require("discord.js");
const {
    ANNOUNCEMENT_CHANNEL,
    PS_ROLE
} = require("../config");

module.exports = async (client, message, args, command) => {


        if (command === "!sessionstartup") {
        return message.channel.send(
            "🚨 **State Line Roleplay | Session Startup**\n\n" +
            "This session is now officially beginning. All members are expected to follow server rules, maintain realistic roleplay, and comply with staff instructions at all times.\n\n" +
            "• 🟢 **Roleplay is now live**\n" +
            "• 📜 Follow all server rules\n" +
            "• 🚗 Speed limits are enforced\n" +
            "• 👮 Follow all staff instructions\n" +
            "• 🚓 LEO, 🚑 Fire/EMS, 🚧 DOT & Civilians may begin operations\n" +
            "• 📻 Keep radio communications professional"
        );
    }

    if (command === "!psonduty") {
        return message.channel.send(
            "🚔 **Public Safety Status Update**\n\n" +
            "@everyone\n\n" +
            "Public Safety is now **ON DUTY**.\n\n" +
            "• 👮 Officers are now available for calls\n" +
            "• 🚓 County patrols have begun\n" +
            "• 🚑 Fire/EMS are available for emergencies\n" +
            "• 🚧 DOT remains on standby\n\n" +
            "Please maintain realistic roleplay and follow all server rules."
        );
    }

    if (command === "!psoffduty") {
        return message.channel.send(
            "🚔 **Public Safety Status Update**\n\n" +
            "@everyone\n\n" +
            "Public Safety is now **OFF DUTY**.\n\n" +
            "• 🔴 Officers have ended their patrols\n" +
            "• 📋 Remaining departments continue normal operations\n" +
            "• 🤝 Thank you for participating in today's RP session\n\n" +
            "We appreciate everyone for keeping the roleplay enjoyable."
        );
    }

    await channel.send({
        embeds: [embed]
    });

    await message.react("✅");

};