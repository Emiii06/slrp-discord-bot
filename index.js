require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const {
    TOKEN,
    APPLICATION_CHANNEL
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

//EVENTS
require("./events/ready")(client);
require("./events/guildMemberAdd")(client);
require("./events/messageCreate")(client);
require("./events/interactionsCreate")(client);
require("./commands/leaderboard")(client);
require("./commands/application")(client);

//Tasks
require("./tasks/birthdayTask")(client);

client.login(TOKEN);