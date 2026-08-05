const fs = require("fs");

const path = require("path");

const USERS_FILE = path.join(__dirname, "data", "users.json");

const users = new Map();

// Daten laden
fs.existsSync(USERS_FILE)
const raw = fs.readFileSync(USERS_FILE, "utf8")

if (raw.trim() !== "") {
    const data = JSON.parse(raw);

    for (const [id, user] of Object.entries(data)) {
        users.set(id, user);
    }
}

console.log(`Loaded ${users.size} users.`);

function saveData() {
    const data = Object.fromEntries(users);

    fs.writeFileSync(
        USERS_FILE,
        JSON.stringify(data, null, 4)
    );
}

function getUserData(userId) {

    if (!users.has(userId)) {

        users.set(userId, {
            loginTime: null,
            weekTime: 0,
            totalTime: 0
        });

    }

    return users.get(userId); fs.readFileSync("./data/users.json", "utf8")
}

module.exports = {
    users,
    saveData,
    getUserData
};