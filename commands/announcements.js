const { EmbedBuilder } = require("discord.js");

const {
    ANNOUNCEMENT_CHANNEL,
    PS_ROLE,
    STAFF_ROLES
} = require("../config");

module.exports = async (client, message, args, command) => {

    const channel = await client.channels
        .fetch(ANNOUNCEMENT_CHANNEL)
        .catch(() => null);

    if (!channel) {
        return message.reply("❌ Announcement channel could not be found.");
    }

    if (
        !message.member.roles.cache.has(PS_ROLE) &&
        !message.member.permissions.has(STAFF_ROLES)
    ) {
        return message.reply(
            "❌ You don't have permission to use this command."
        );
    }

    /*
    ========================================
    SESSION STARTUP
    ========================================
    */

    if (command === "!sessionstartup") {

        const fs = require("fs");

        fs.writeFileSync(
            "./data/session.json",
            JSON.stringify({
                startedAt: Date.now()
            }, null, 4)
        );

        const SessionStartupembed = new EmbedBuilder()
            .setColor("#57F287")
            .setTitle("🚨 State Line Roleplay | Session Startup")
            .setDescription(
                "The roleplay session is now officially **LIVE!**\n\n" +
                "All members are expected to follow server rules, maintain realistic roleplay, and comply with staff instructions throughout the session."
            )
            .addFields({
                name: "📋 Session Information",
                value:
                    "🟢 **Roleplay is now live**\n" +
                    "📜 Follow all server rules\n" +
                    "🚗 Speed limits are enforced\n" +
                    "👮 Follow all staff instructions\n" +
                    "🚓 LEO, 🚑 Fire/EMS, 🚧 DOT & Civilians may begin operations\n" +
                    "📻 Keep radio communications professional"
            })
            .setFooter({
                text: "State Line Roleplay"
            })
            .setTimestamp();

        await channel.send({
            content: "@here",
            embeds: [SessionStartupembed]
        });

        return message.react("✅");
    }

    /*
    ========================================
    SESSION END
    ========================================
    */

    if (command === "!sessionend") {

        const fs = require("fs");

        const session = JSON.parse(
            fs.readFileSync("./data/session.json", "utf8")
        );

        const duration = Date.now() - session.startedAt;

        const hours = Math.floor(duration / 3600000);

        const minutes = Math.floor(
            (duration % 3600000) / 60000
        );

        const sessionTime = `${hours}h ${minutes}m`;

        const sessionEndembed = new EmbedBuilder()
            .setColor("#ED4245")
            .setTitle("🔴 State Line Roleplay | Session Ended")
            .setDescription(
                "Today's roleplay session has officially concluded.\n\n" +
                "Thank you to everyone who participated and helped create an enjoyable experience for the community.\n\n" +
                `⏱️ **Session Duration:** ${sessionTime}\n\n` +
                "We appreciate everyone who joined and look forward to seeing you in the next session!"
            )
            .addFields({
                name: "📊 Session Summary",
                value:
                    `• Duration: **${sessionTime}**\n` +
                    "• Session Status: **Ended**\n" +
                    "• Thank you for playing!"
            })
            .setFooter({
                text: "State Line Roleplay"
            })
            .setTimestamp();

        await channel.send({
            content: "@here",
            embeds: [sessionEndembed]
        });

        return message.react("✅");
    }

    /*
    ========================================
    PUBLIC SAFETY ON DUTY
    ========================================
    */

    if (command === "!psonduty") {

        const PSDutyOnembed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🚔 Public Safety Status Update")
            .setDescription(
                "Public Safety is now officially **ON DUTY**.\n\n" +
                "Departments are active and ready to respond to incidents. Please cooperate with all emergency services and continue to follow server rules throughout the session."
            )
            .addFields({
                name: "🚨 Active Operations",
                value:
                    "👮 Officers are now available for calls\n" +
                    "🚓 County patrols have begun\n" +
                    "🚑 Fire/EMS are available for emergencies\n" +
                    "🚧 DOT remains on standby"
            })
            .setFooter({
                text: "State Line Roleplay"
            })
            .setTimestamp();

        await channel.send({
            content: "@here",
            embeds: [PSDutyOnembed]
        });

        return message.react("✅");
    }

    /*
    ========================================
    PUBLIC SAFETY OFF DUTY
    ========================================
    */

    if (command === "!psoffduty") {

        const PSDutyOffembed = new EmbedBuilder()
            .setColor("#ED4245")
            .setTitle("🚔 Public Safety Status Update")
            .setDescription(
                "Public Safety is now officially **OFF DUTY**.\n\n" +
                "Law Enforcement has concluded active patrols for this session. We thank everyone for their cooperation and contribution to a realistic roleplay experience."
            )
            .addFields({
                name: "📋 Duty Status",
                value:
                    "🔴 Officers have ended their patrols\n" +
                    "📋 Remaining departments continue normal operations\n" +
                    "🤝 Thank you for participating in today's RP session"
            })
            .setFooter({
                text: "State Line Roleplay"
            })
            .setTimestamp();

        await channel.send({
            content: "@here",
            embeds: [PSDutyOffembed]
        });

        return message.react("✅");
    }

};