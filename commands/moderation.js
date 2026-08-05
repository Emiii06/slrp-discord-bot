const { EmbedBuilder } = require("discord.js");
const { isStaff } = require("../utils/permissions");
const { sendModLog } = require("../utils/moderationLog");


module.exports = async (client, message, args, command) => {

    const actions = ["kick", "warn", "ban"];

    if (command.startsWith("?")) {

        const action = command.slice(1);

        if (!actions.includes(action)) return;

        if (!isStaff(message.member))
            return message.reply("❌ You don't have permission.");

        await message.delete().catch(() => { });

        if (args.length < 3)
            return message.reply(`Usage: ?${action} <player> <reason>`);

        await sendModLog(
            client,
            message,
            action,
            args[1],
            args.slice(2).join(" ")
        );

        return;
    }

};