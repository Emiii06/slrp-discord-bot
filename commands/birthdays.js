const { AttachmentBuilder, EmbedBuilder } = require("discord.js");

const banner = new AttachmentBuilder("./media/birthdayBanner.png");

const {
    birthdays,
    getBirthday,
    setBirthday,
    removeBirthday
} = require("../utils/birthdayDatabase");

const {
    getDaysUntil
} = require("../utils/birthdayUtils");

const {
    parseBirthday
} = require("../utils/birthdayParser");



const { getRandomBirthdayMessage } = require("../utils/birthdayMessages");
const { getOrdinal } = require("../utils/ordinal");
const { isAdmin } = require("../utils/permissions");
const { createBirthdayEmbed } = require("../utils/birthdayEmbed");

module.exports = async (client, message, args, command) => {
    console.log("Birthday command received:", command, args);
    if (command === "!birthdays") {

        const today = new Date();

        const list = [];

        for (const [id, birthday] of birthdays.entries()) {

            const nextBirthday = new Date(
                today.getFullYear(),
                birthday.month - 1,
                birthday.day
            );

            if (nextBirthday < today) {
                nextBirthday.setFullYear(today.getFullYear() + 1);
            }

            const difference = nextBirthday.getTime() - today.getTime();

            const days = Math.ceil(
                difference / (1000 * 60 * 60 * 24)
            );

            list.push({
                id,
                birthday,
                days
            });

        }

        list.sort((a, b) => a.days - b.days);

        let description = "";

        for (const entry of list) {

            const member = await message.guild.members
                .fetch(entry.id)
                .catch(() => null);

            if (!member) continue;

            const turns = nextBirthday.getFullYear() - entry.birthday.year;
            let when;

            if (entry.days === 0) {
                when = "🎉 Today!";
            } else if (entry.days === 1) {
                when = "⏳ Tomorrow";
            } else {
                when = `⏳ In ${entry.days} days`;
            }

            description +=
                `🥳 **${member.displayName}**\n` +
                `📅 ${entry.birthday.day}.${entry.birthday.month}.${entry.birthday.year}\n` +
                `🎈 Turns ${turns}\n` +
                `${when}\n\n`;

        }

        if (description === "") {
            description = "*Nobody has set their birthday yet.*";
        }

        const embed = new EmbedBuilder()
            .setColor("#F8C8DC")
            .setTitle("🎂 Upcoming Birthdays")
            .setDescription(description)
            .setTimestamp();

        return message.reply({
            embeds: [embed]
        });

    }
    if (command === "!birthdaytest") {

        console.log("Reached birthdaytest");
        if (!isAdmin(message.member)) {
            return message.reply("❌ You don't have permission.");
        }
        console.log("Creating embed");
        const embed = createBirthdayEmbed(message.member, 20);
        console.log("Sending embed");
        return message.channel.send({
            embeds: [embed],
            files: [banner]
        });

    }

    console.log("Checking birthday command...");
    if (command !== "!birthday")
        return;

    if (args.length < 2) {

        return message.reply(
            "Usage:\n" +
            "`!birthday set <date>`\n" +
            "`!birthday me`\n" +
            "`!birthday remove`"
        );

    }

    const subcommand = args[1].toLowerCase();


    if (subcommand === "me") {

        const birthday = getBirthday(message.author.id);

        if (!birthday)
            return message.reply("You haven't set your birthday yet.");

        const days = getDaysUntil(
            birthday.day,
            birthday.month
        );
        let text;

        if (birthday.format === "EU") {

            text =
                `${birthday.day}.${birthday.month}.${birthday.year}`;

        } else {

            text =
                `${birthday.month}/${birthday.day}/${birthday.year}`;

        }

        return message.reply(
            `🎂 Your birthday is **${text}**.`
        );

    }

    if (subcommand === "remove") {

        removeBirthday(message.author.id);

        return message.reply(
            "✅ Your birthday has been removed."
        );

    }

    if (subcommand === "set") {

        if (args.length < 3) {
            return message.reply(
                "Usage: `!birthday set <date>`"
            );
        }

        const input = args.slice(2).join(" ");

        const result = parseBirthday(input);

        if (result.success) {

            setBirthday(message.author.id, result);

            return message.reply(
                `✅ Your birthday has been set.`
            );
        }

        if (result.ambiguous) {

            return message.reply(
                "❓ Your date format is ambiguous.\n\n" +
                `🇪🇺 **EU:** ${result.eu.day}.${result.eu.month}.${result.eu.year}\n` +
                `🇺🇸 **US:** ${result.us.month}/${result.us.day}/${result.us.year}\n\n` +
                "Please use either:\n" +
                "`1 October 2006`\n" +
                "or\n" +
                "`October 1 2006`"
            );

        }

        if (result.error === "invalid") {
            return message.reply("❌ That isn't a valid date.");
        }

        return message.reply(
            "❌ Unknown date format."
        );

    }


};    