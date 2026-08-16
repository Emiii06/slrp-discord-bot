const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = async (client, message) => {
    if (!message.member.permissions.has("Administrator")) {
        return message.reply(
            "❌ You don't have permission to create patchnotes."
        );
    }

    const button = new ButtonBuilder()
        .setCustomId("patchnote_open")
        .setLabel("Create Patchnote")
        .setEmoji("📝")
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder()
        .addComponents(button);

    return message.reply({
        content: "📝 **Patchnote Creator**\nClick the button below to create a patchnote.",
        components: [row]
    });
};