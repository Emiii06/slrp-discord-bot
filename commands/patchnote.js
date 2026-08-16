const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

module.exports = async (client, message) => {
    if (!message.member.permissions.has("Administrator")) {
        return message.reply(
            "❌ You don't have permission to create patchnotes."
        );
    }

    const modal = new ModalBuilder()
        .setCustomId("patchnote_create")
        .setTitle("Create Patchnote");

    const titleInput = new TextInputBuilder()
        .setCustomId("patchnote_title")
        .setLabel("Patchnote Title")
        .setPlaceholder("Creative - TimeSperre")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(256);

    const contentInput = new TextInputBuilder()
        .setCustomId("patchnote_content")
        .setLabel("Patchnote")
        .setPlaceholder(
            "Write your complete patchnote here..."
        )
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(4000);

    modal.addComponents(
        new ActionRowBuilder().addComponents(titleInput),
        new ActionRowBuilder().addComponents(contentInput)
    );

    return message.showModal(modal);
};