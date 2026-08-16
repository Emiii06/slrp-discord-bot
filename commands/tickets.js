const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");

const { TICKET_SYSTEMS } = require("../config");

const ticketTypes = {
    tickets: {
        key: "tickets",
        buttonLabel: "Open Ticket",
        buttonEmoji: "🎫",
        color: "#5865F2",
        description:
            "Need help with something? Open a support ticket and our staff team will assist you."
    },

    banAppeals: {
        key: "banAppeals",
        buttonLabel: "Appeal a Ban",
        buttonEmoji: "⚖️",
        color: "#ED4245",
        description:
            "If you believe you were banned unfairly, you can submit a ban appeal here."
    },

    staffHelp: {
        key: "staffHelp",
        buttonLabel: "Contact Staff",
        buttonEmoji: "🛡️",
        color: "#FEE75C",
        description:
            "Please click the button below to create a support ticket. This will open a private channel where you can speak directly with SLRP Staff, provide details about your issue, and receive assistance as soon as possible. Make sure to include any information or evidence that can help our team resolve your request quickly and professionally."
    }
};

module.exports = async (client, message, args) => {

    /*
    ========================================
    PERMISSION
    ========================================
    */

    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return message.reply("❌ You don't have permission to use this command.");
    }

    /*
    ========================================
    GET TYPE
    ========================================
    */

    const type = args[1];

    if (!type || !ticketTypes[type]) {
        return message.reply(
            "❌ Invalid ticket type.\n\n" +
            "Available types:\n" +
            "`tickets`\n" +
            "`banAppeals`\n" +
            "`staffHelp`"
        );
    }

    const system = TICKET_SYSTEMS[type];
    const ticket = ticketTypes[type];

    /*
    ========================================
    FETCH PANEL CHANNEL
    ========================================
    */

    const channel = await client.channels
        .fetch(system.panelChannel)
        .catch(() => null);

    if (!channel) {
        return message.reply(
            "❌ The configured panel channel could not be found."
        );
    }

    /*
    ========================================
    PANEL EMBED
    ========================================
    */

    const embed = new EmbedBuilder()
        .setColor(ticket.color)
        .setTitle(
            `${ticket.buttonEmoji} ${system.name}`
        )
        .setDescription(ticket.description)
        .setFooter({
            text: "State Line Roleplay • Support"
        });

    /*
    ========================================
    BUTTON
    ========================================
    */

    const button = new ButtonBuilder()
        .setCustomId(`ticket_open_${type}`)
        .setLabel(ticket.buttonLabel)
        .setEmoji(ticket.buttonEmoji)
        .setStyle(
            type === "banAppeals"
                ? ButtonStyle.Danger
                : ButtonStyle.Primary
        );

    const row = new ActionRowBuilder()
        .addComponents(button);

    /*
    ========================================
    SEND PANEL
    ========================================
    */

    await channel.send({
        embeds: [embed],
        components: [row]
    });

    return message.reply(
        `✅ ${system.name} ticket panel created in ${channel}.`
    );
};