const { WELCOME_ROLE } = require("../config");

module.exports = (client) => {

    client.on("guildMemberAdd", async (member) => {

        try {

            await member.roles.add(WELCOME_ROLE);

            console.log(`Assigned auto role to ${member.user.tag}`);

        } catch (err) {

            console.error("FAILED TO ASSIGN WELCOME ROLE", err);

        }

    });

};