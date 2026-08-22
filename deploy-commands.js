require("dotenv").config();
const {
    REST,
    Routes,
    SlashCommandBuilder
} = require("discord.js");

const {
    TOKEN,
    CLIENT_ID,
    GUILD_ID
} = require("./config");

const commands = [

    /*
    ========================================
    CLEAR
    ========================================
    */

    new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Delete messages from the current channel.")
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("Number of messages to delete.")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        ),

    /*
    ========================================
    LOGS
    ========================================
    */

    new SlashCommandBuilder()
        .setName("logs")
        .setDescription("Create an in-game moderation log.")
        .addStringOption(option =>
            option
                .setName("type")
                .setDescription("Type of moderation action.")
                .setRequired(true)
                .addChoices(
                    {
                        name: "⚠️ Warn",
                        value: "warn"
                    },
                    {
                        name: "👢 Kick",
                        value: "kick"
                    },
                    {
                        name: "🔨 Ban",
                        value: "ban"
                    }
                )
        )
        .addStringOption(option =>
            option
                .setName("name")
                .setDescription("In-game username.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for the action.")
                .setRequired(true)
        )

].map(command => command.toJSON());

const rest = new REST({ version: "10" })
    .setToken(TOKEN);

(async () => {

    try {

        console.log("Registering slash commands...");

        await rest.put(
            Routes.applicationGuildCommands(
                CLIENT_ID,
                GUILD_ID
            ),
            {
                body: commands
            }
        );

        console.log("Slash commands registered successfully.");

    } catch (error) {

        console.error(
            "Failed to register slash commands:",
            error
        );

    }

})();