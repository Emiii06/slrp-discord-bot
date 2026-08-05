const { AttachmentBuilder, EmbedBuilder } = require("discord.js");

const banner = new AttachmentBuilder("./media/birthdayBanner.png");

const { getRandomBirthdayMessage } = require("./birthdayMessages");
const { getOrdinal } = require("./ordinal");



function createBirthdayEmbed(member, age = null) {

    const randomMessage = getRandomBirthdayMessage();

    let description;

    if (age) {

        description =
            `Happy **${getOrdinal(age)} Birthday**, ${member}! 🥳🎂\n\n${randomMessage}`;

    } else {

        description =
            `Happy Birthday, ${member}! 🥳🎂\n\n${randomMessage}`;

    }

    return new EmbedBuilder()
        .setColor("#D4AF37")
        .setTitle("🎉 Happy Birthday!")
        .setDescription(description)
        .setImage("attachment://birthdayBanner.png")
        .setFooter({
            text: "State Line Roleplay • Birthday System"
        })
        .setTimestamp();

}

module.exports = {
    createBirthdayEmbed
};