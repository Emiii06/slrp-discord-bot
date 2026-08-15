const fs = require("fs");
const path = require("path");

const applicationSessionsPath = path.join(
    __dirname,
    "../data/applicationSessions.json"
);

const applications = require("./applicationData");

module.exports = async (client, message) => {
    try {
        if (!fs.existsSync(applicationSessionsPath)) {
            return message.reply(
                "❌ You don't have an application in progress."
            );
        }

        const sessions = JSON.parse(
            fs.readFileSync(applicationSessionsPath, "utf8")
        );

        const session = sessions[message.author.id];

        if (!session) {
            return message.reply(
                "❌ You don't have an application in progress."
            );
        }

        const application = applications[session.type];

        if (!application) {
            console.error(
                "CONTINUE APPLICATION: Unknown application type:",
                session.type
            );

            return message.reply(
                "❌ Your application type is no longer available. Please contact staff."
            );
        }

        const fields = [
            ...application.information,
            ...application.questions
        ];

        const currentIndex = Number(session.currentIndex) || 0;

        if (currentIndex >= fields.length) {
            return message.reply(
                "❌ Your application is already complete."
            );
        }

        return message.reply({
            content:
                `📋 **${application.name} Application**\n\n` +
                `Your saved application was found.\n\n` +
                `**Progress:** ${currentIndex} / ${fields.length} questions answered\n` +
                `**Next Question:** ${currentIndex + 1}\n\n` +
                `Click below to continue your application.`,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            custom_id: `application_continue_${message.author.id}`,
                            label: "Continue Application",
                            style: 1,
                            emoji: {
                                name: "▶️"
                            }
                        }
                    ]
                }
            ]
        });

    } catch (error) {
        console.error("CONTINUE APPLICATION ERROR:", error);

        return message.reply(
            "❌ There was an error loading your application."
        );
    }
};