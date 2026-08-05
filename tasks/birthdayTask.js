const cron = require("node-cron");

const { getOrdinal } = require("../utils/ordinal");

const {
    getRandomBirthdayMessage
} = require("../utils/birthdayMessages");

const randomMessage = getRandomBirthdayMessage();

const {
    birthdays
} = require("../utils/birthdayDatabase");

const {
    BIRTHDAY_CHANNEL
} = require("../config");

const { EmbedBuilder } = require("discord.js");



const { createBirthdayEmbed } = require("../utils/birthdayEmbed");

module.exports = (client) => {

    cron.schedule("0 9 * * *", async () => {

        const today = new Date();

        const day = today.getDate();
        const month = today.getMonth() + 1;

        const channel = await client.channels.fetch(BIRTHDAY_CHANNEL);

        if (!channel) return;

        for (const [id, birthday] of birthdays.entries()) {

            if (
                birthday.day !== day ||
                birthday.month !== month
            ) {
                continue;
            }

            const member = await client.users
                .fetch(id)
                .catch(() => null);

            if (!member) continue;

            const randomMessage = getRandomBirthdayMessage();

            let description;

            if (birthday.year) {

                const age = today.getFullYear() - birthday.year;

                description =
                    `Happy **${getOrdinal(age)} Birthday** <@${id}>! 🥳🎂\n\n${randomMessage}`;

            } else {

                description =
                    `Happy Birthday, <@${id}>! 🥳🎂\n\n${randomMessage}`;

            }

            const age = birthday.year
                ? today.getFullYear() - birthday.year
                : null;

            const embed = createBirthdayEmbed(`<@${id}>`, age);

            await channel.send({
                embeds: [embed],
                files: [banner]
            });

    

        }

    })

};