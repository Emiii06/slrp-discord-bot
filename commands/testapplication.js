const fs = require("fs");
const path = require("path");

const applicationSessionsPath = path.join(
    __dirname,
    "../data/applicationSessions.json"
);

const applications = require("./applicationData");

module.exports = async (client, message, args) => {
    if (!message.member.permissions.has("Administrator")) {
        return message.reply("❌ You don't have permission.");
    }

    const member = message.mentions.members.first();

    if (!member) {
        return message.reply(
            "Usage: `!testapplication @User staff`"
        );
    }

    const type = (args[1] || "staff").toLowerCase();

    if (!applications[type]) {
        return message.reply(
            "❌ Invalid application type.\n\n" +
            "Available types: `staff`, `police`, `fire`, `ems`, `dot`"
        );
    }

    let sessions = {};

    if (fs.existsSync(applicationSessionsPath)) {
        sessions = JSON.parse(
            fs.readFileSync(applicationSessionsPath, "utf8")
        );
    }

    sessions[member.id] = {
        type,
        answers: {
            discord_username: member.user.username,
            roblox_username: "TestUser",
            age: "19",
            timezone: "CET"
        },
        currentIndex: 4
    };

    fs.writeFileSync(
        applicationSessionsPath,
        JSON.stringify(sessions, null, 2)
    );

    return message.reply(
        `✅ Test **${applications[type].name}** application created for ${member}.\n\n` +
        `Progress is set to **Question 5**.\n` +
        `Use \`!continueapplication\` to continue it.`
    );
};