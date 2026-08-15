const fs = require("fs");
const path = require("path");

const applicationSessionsPath = path.join(
    __dirname,
    "../data/applicationSessions.json"
);

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

        const applicationNames = {
            staff: "Staff",
            police: "Police",
            fire: "Fire/EMS",
            dot: "DOT",
        };

        const applicationName =
            applicationNames[session.type] || session.type;

        return message.reply({
            content:
                `📋 **${applicationName} Application Found**\n\n` +
                `You already have an application in progress.\n` +
                `Your progress has been saved at **Question ${session.currentIndex + 1}**.\n\n` +
                `Click below to continue where you left off.`,
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
                                name: "▶️",
                            },
                        },
                    ],
                },
            ],
        });
    } catch (error) {
        console.error("CONTINUE APPLICATION ERROR:", error);

        return message.reply(
            "❌ There was an error loading your application."
        );
    }
};