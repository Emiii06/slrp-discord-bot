require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const {
    TOKEN,
} = require("./config");

const {
    users,
    saveData,
    getUserData
} = require("./database");



const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

require("./events/ready")(client);
require("./events/guildMemberAdd")(client);
require("./events/messageCreate")(client);

require("./commands/leaderboard")(client);
require("./tasks/birthdayTask")(client);

client.login(TOKEN);