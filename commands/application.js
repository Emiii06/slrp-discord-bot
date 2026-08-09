const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = async (client, message, args, command) => {

    if (command !== "!apply") return;

    const embed = new EmbedBuilder()
        .setColor("#2B2D31")
        .setTitle("📋 State Line Roleplay | Applications")
        .setDescription(
            "Welcome to the State Line Roleplay application center.\n\n" +
            "Please select the department or position you would like to apply for below.\n\n" +
            "⚠️ **Important:**\n" +
            "All application answers must be your own.\n" +
            "Using AI, ChatGPT, answer generators, copied answers, " +
            "or having another person complete your application may result " +
            "in immediate disqualification.\n\n" +
            "Please take your time and provide honest, thoughtful answers."
        )
        .setFooter({
            text: "State Line Roleplay • Applications"
        })
        .setTimestamp();

    const row1 = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
                .setCustomId("application_staff")
                .setLabel("Staff & Moderator")
                .setEmoji("🛡️")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("application_fire")
                .setLabel("Fire Department")
                .setEmoji("🔥")
                .setStyle(ButtonStyle.Danger)

        );

    const row2 = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
                .setCustomId("application_ems")
                .setLabel("EMS Department")
                .setEmoji("🚑")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("application_dot")
                .setLabel("DOT Department")
                .setEmoji("🚧")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("application_police")
                .setLabel("Police Department")
                .setEmoji("🚓")
                .setStyle(ButtonStyle.Primary)

        );

    await message.channel.send({
        embeds: [embed],
        components: [row1, row2]
    });

    return;
};