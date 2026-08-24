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

    new SlashCommandBuilder()
        .setName("announce")
        .setDescription("Send a session announcement.")
        .addStringOption(option =>
            option
                .setName("type")
                .setDescription("Announcement type.")
                .setRequired(true)
                .addChoices(
                    {
                        name: "Session Start",
                        value: "sessionstart"
                    },
                    {
                        name: "Session End",
                        value: "sessionend"
                    },
                    {
                        name: "Public Safety On Duty",
                        value: "psonduty"
                    },
                    {
                        name: "Public Safety Off Duty",
                        value: "psoffduty"
                    }
                )
        )
        .addStringOption(option =>
            option
                .setName("session")
                .setDescription("Session type.")
                .setRequired(false)
                .addChoices(
                    {
                        name: "FRP",
                        value: "FRP"
                    }
                )
        )
        .addStringOption(option =>
            option
                .setName("peacetime")
                .setDescription("Current peacetime status.")
                .setRequired(false)
                .addChoices(
                    {
                        name: "Strict Peacetime",
                        value: "Strict Peacetime"
                    },
                    {
                        name: "Normal Peacetime",
                        value: "Normal Peacetime"
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
    new SlashCommandBuilder()
        .setName("birthday")
        .setDescription("Manage birthdays.")
        .addStringOption(option =>
            option
                .setName("action")
                .setDescription("Birthday action.")
                .setRequired(true)
                .addChoices(
                    {
                        name: "🎂 My Birthday",
                        value: "me"
                    },
                    {
                        name: "📅 Set Birthday",
                        value: "set"
                    },
                    {
                        name: "🗑️ Remove Birthday",
                        value: "remove"
                    },
                    {
                        name: "🎉 Upcoming Birthdays",
                        value: "list"
                    },
                    {
                        name: "🧪 Birthday Test",
                        value: "test"
                    }
                )
        )
        .addStringOption(option =>
            option
                .setName("date")
                .setDescription("Your birthday, e.g. 1 October 2006.")
                .setRequired(false)
        ),
    new SlashCommandBuilder()
        .setName("apply-continue")
        .setDescription("Continue your saved application."),
    new SlashCommandBuilder()
        .setName("sos")
        .setDescription("Lock all server channels."),
    new SlashCommandBuilder()
        .setName("unsos")
        .setDescription("Unlock all server channels."),

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