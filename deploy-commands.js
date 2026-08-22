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
        ),

    /*
    PATCHNOTES
    */
    new SlashCommandBuilder()
        .setName("patchnote")
        .setDescription("Open the patchnote creator."),

    /*
    ANNOUNCEMENTS
    */
    new SlashCommandBuilder()
        .setName("session")
        .setDescription("Manage the current roleplay session.")
        .addStringOption(option =>
            option
                .setName("action")
                .setDescription("Session action to perform.")
                .setRequired(true)
                .addChoices(
                    {
                        name: "🚨 Session Startup",
                        value: "startup"
                    },
                    {
                        name: "🔴 Session End",
                        value: "end"
                    },
                    {
                        name: "🚔 Public Safety On Duty",
                        value: "ps-on"
                    },
                    {
                        name: "🚔 Public Safety Off Duty",
                        value: "ps-off"
                    }
                )
        ),
    new SlashCommandBuilder()
        .setName("duty")
        .setDescription("Manage staff duty status.")
        .addStringOption(option =>
            option
                .setName("action")
                .setDescription("Duty action.")
                .setRequired(true)
                .addChoices(
                    {
                        name: "🟢 Login",
                        value: "login"
                    },
                    {
                        name: "🔴 Logout",
                        value: "logout"
                    },
                    {
                        name: "👥 Currently On Duty",
                        value: "loggedin"
                    },
                    {
                        name: "📅 My Weekly Time",
                        value: "week"
                    },
                    {
                        name: "⏳ My Total Time",
                        value: "time"
                    },
                    {
                        name: "📊 My Statistics",
                        value: "stats"

                    },
                    {
                        name: "👤 Login User",
                        value: "login-user"
                    },
                    {
                        name: "👤 Logout User",
                        value: "logout-user"
                    },
                    {
                        name: "➕ Add Duty Time",
                        value: "add-time"
                    },
                    {
                        name: "➖ Remove Duty Time",
                        value: "remove-time"
                    }
                )

        )
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Select a user.")
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("time")
                .setDescription("Duration, e.g. 2h30m or 45m.")
                .setRequired(false)
        ),



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