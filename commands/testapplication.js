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

    const type = args
        .map((arg) => arg.toLowerCase())
        .find((arg) => applications[arg]);

    if (!type) {
        return message.reply(
            "❌ Invalid application type.\n\n" +
            "Available types: `staff`, `police`, `fire`, `ems`, `dot`"
        );
    }

    const application = applications[type];

    let sessions = {};

    if (fs.existsSync(applicationSessionsPath)) {
        sessions = JSON.parse(
            fs.readFileSync(applicationSessionsPath, "utf8")
        );
    }

    const fields = [
        ...(application.information || []),
        ...(application.questions || [])
    ];

    const answers = {};

    for (const field of fields) {
        answers[field.id] = "TEST APPLICATION ANSWER";
    }

    answers.discord_username = member.user.username;
    answers.roblox_username = "TestRobloxUser";
    answers.age = "19";
    answers.timezone = "CET";

    sessions[member.id] = {
        type,
        answers,
        currentIndex: fields.length
    };

    fs.writeFileSync(
        applicationSessionsPath,
        JSON.stringify(sessions, null, 2)
    );

    return message.reply(
        `✅ **Test ${application.name} application created.**\n\n` +
        `👤 Applicant: ${member}\n` +
        `📋 Questions: **${fields.length}/${fields.length}**\n` +
        `✅ Application is marked as **complete**.\n\n` +
        `You can now test the **Review Application** workflow.`
    );
};