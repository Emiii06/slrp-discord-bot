const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "..", "data", "birthdays.json");


const { EmbedBuilder } = require("discord.js");


const birthdays = new Map();

if (fs.existsSync(FILE)) {

    const raw = fs.readFileSync(FILE, "utf8");

    if (raw.trim() !== "") {

        const data = JSON.parse(raw);

        for (const [id, birthday] of Object.entries(data)) {
            birthdays.set(id, birthday);
        }

    }

}

function saveBirthdays() {

    fs.writeFileSync(
        FILE,
        JSON.stringify(Object.fromEntries(birthdays), null, 4)
    );

}

function getBirthday(userId) {
    return birthdays.get(userId);
}

function setBirthday(userId, birthday) {

    birthdays.set(userId, birthday);

    saveBirthdays();

}

function removeBirthday(userId) {

    birthdays.delete(userId);

    saveBirthdays();

}

module.exports = {
    birthdays,
    getBirthday,
    setBirthday,
    removeBirthday
};