const { EmbedBuilder } = require("discord.js");

const {
    users,
    saveData,
    getUserData
} = require("../database");

const {
    isStaff,
    isAdmin
} = require("../utils/permissions");

const { formatDuration } = require("../utils/time");

module.exports = async (client, message, args, command) => {

    // Hier kommen alle Duty Commands rein
    //login normal
    if (command === "!login" && args.length === 1) {

        const user = getUserData(message.author.id);

        if (user.loginTime !== null) {
            return message.reply("You are already logged in.");
        }

        user.loginTime = Date.now();
        saveData();
        return message.reply("✅ You have been successfully logged in.");
    }
    //login für andere
    if (command === "!login" && args.length > 1) {
        if (!isAdmin(message.member)) {
            return message.reply("❌ You don't have permission.");
        }

        const member = message.mentions.members.first();

        if (!member) {
            return message.reply("Please mention a user.");
        }

        const user = getUserData(member.id);

        if (user.loginTime !== null) {
            return message.reply(`${member.user.tag} is already logged in.`);
        }

        user.loginTime = Date.now();

        saveData();

        return message.reply(`✅ ${member.user.tag} has been logged in.`);
    }
    if (command === "!loggedin") {

        if (!isStaff(message.member)) {
            return message.reply("❌ You don't have permission.");
        }

        let description = "";

        for (const [id, user] of users.entries()) {

            if (user.loginTime === null) continue;

            const difference = Date.now() - user.loginTime;

            const { hours, minutes, seconds } = formatDuration(difference);

            description += `• <@${id}> (${hours}h ${minutes}m ${seconds}s)\n`;
        }

        if (description === "") {
            return message.reply("✅ Nobody is currently on duty.");
        }

        const embed = new EmbedBuilder()
            .setColor("#2B2D31")
            .setTitle("🟢 Staff Currently On Duty")
            .setDescription(description)
            .setTimestamp();

        return message.reply({
            embeds: [embed]
        });
    }
    //LOGOUT
    // Eigener Logout
    if (command === "!logout" && args.length === 1) {

        const user = getUserData(message.author.id);

        if (user.loginTime === null) {
            return message.reply("You are not logged in.");
        }

        const loginTime = user.loginTime;
        const logoutTime = Date.now();

        const difference = logoutTime - loginTime;

        user.loginTime = null;
        user.weekTime += difference;
        user.totalTime += difference;
        saveData();
        const { hours, minutes, seconds } = formatDuration(difference);


        return message.reply(
            `✅ You were successfully logged out.\n` +
            `Online time: ${hours}h ${minutes}min ${seconds}s`
        );
    }

    // Staff Logout
    if (command === "!logout" && args.length > 1) {

        if (!isAdmin(message.member)) {
            return message.reply("❌ You don't have permission.");
        }

        const member = message.mentions.members.first();

        if (!member) {
            return message.reply("Please mention a user.");
        }

        const user = getUserData(member.id);

        if (user.loginTime === null) {
            return message.reply(`${member.user.tag} is not logged in.`);
        }

        const loginTime = user.loginTime;
        const logoutTime = Date.now();

        const difference = logoutTime - loginTime;

        user.loginTime = null;
        user.weekTime += difference;
        user.totalTime += difference;
        saveData();

        const { hours, minutes, seconds } = formatDuration(difference);


        return message.reply(
            `✅ ${member.user.tag} has been logged out.\n` +
            `Online time: ${hours}h ${minutes}min ${seconds}s`
        );
    }

    if (command === "!log") {

        if (!isAdmin(message.member)) {
            return message.reply("❌ You don't have permission.");
        }

        const member = message.mentions.members.first();

        if (!member) {
            return message.reply("Usage: !log @User 2h30m");
        }

        // Alles nach der Erwähnung zusammenfügen
        const timeString = args.slice(2).join("").toLowerCase();

        const match = timeString.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);

        if (!match) {
            return message.reply("Usage: !log @User 2h30m");
        }
        const hours = parseInt(match[1] || 0);
        const minutes = parseInt(match[2] || 0);
        const seconds = parseInt(match[3] || 0);

        const duration =
            (hours * 3600 + minutes * 60 + seconds) * 1000;

        if (duration <= 0) {
            return message.reply("Please enter a valid duration.");
        }

        console.log("Duration:", duration);

        const user = getUserData(member.id);

        console.log("Before:", user);

        user.weekTime += duration;
        user.totalTime += duration;

        console.log("After:", user);

        saveData();

        return message.reply(
            `✅ Added **${hours}h ${minutes}m ${seconds}s** to ${member.user.tag}.`
        );




    }

    if (command === "!remove") {

        if (!isAdmin(message.member)) {
            return message.reply("❌ You don't have permission.");
        }

        const member = message.mentions.members.first();

        if (!member) {
            return message.reply("Usage: !remove @User 2h30m");
        }

        const timeString = args.slice(2).join("").toLowerCase();

        const match = timeString.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);

        if (!match) {
            return message.reply("Usage: !remove @User 2h30m");
        }

        const hours = parseInt(match[1] || 0);
        const minutes = parseInt(match[2] || 0);
        const seconds = parseInt(match[3] || 0);

        const duration =
            (hours * 3600 + minutes * 60 + seconds) * 1000;

        if (duration <= 0) {
            return message.reply("Please enter a valid duration.");
        }

        const user = getUserData(member.id);

        user.weekTime = Math.max(0, user.weekTime - duration);
        user.totalTime = Math.max(0, user.totalTime - duration);

        saveData();

        return message.reply(
            `✅ Removed **${hours}h ${minutes}m ${seconds}s** from ${member.user.tag}.`
        );
    }

    if (command === "!week") {

        const user = getUserData(message.author.id);


        const { hours, minutes, seconds } = formatDuration(user.weekTime);


        return message.reply(
            `📅 This week you've been on duty for **${hours}h ${minutes}m ${seconds}s**.`
        );
    }

    if (command === "!time") {

        const user = getUserData(message.author.id);


        const { hours, minutes, seconds } = formatDuration(user.totalTime);

        return message.reply(
            `⏳ Total duty time: **${hours}h ${minutes}m ${seconds}s**.`
        );
    }

    if (command === "!alltime") {

        if (!isStaff(message.member)) {
            return message.reply("❌ You don't have permission.");
        }
        const leaderboard = [];

        for (const [id, user] of users.entries()) {
            leaderboard.push({
                id,
                totalTime: user.totalTime
            });
        }

        leaderboard.sort((a, b) => b.totalTime - a.totalTime);

        let description = "";
        let totalDuty = 0;

        const medals = ["🥇", "🥈", "🥉"];

        for (let i = 0; i < leaderboard.length; i++) {

            const entry = leaderboard[i];

            if (entry.totalTime <= 0) continue;

            totalDuty += entry.totalTime;

            const totalSeconds = Math.floor(entry.totalTime / 1000);


            const place = medals[i] ?? `**${i + 1}.**`;
            const { hours, minutes } = formatDuration(entry.totalTime);

            description += `${place} <@${entry.id}> • **${hours}h ${minutes}m**\n`;
        }
        if (description === "") {
            description = "*Nobody has any recorded duty time yet.*";
        }

        const totalHours = Math.floor(totalDuty / 1000 / 3600);
        const totalMinutes = Math.floor((totalDuty / 1000 % 3600) / 60);

        const embed = new EmbedBuilder()
            .setColor("#FFD700")
            .setTitle("🏆 All Time Staff Leaderboard")
            .setDescription(description)
            .addFields({
                name: "⏳ Total Recorded Duty",
                value: `${totalHours}h ${totalMinutes}m`,
                inline: true
            })
            .setFooter({
                text: "State Line Roleplay • All Time Activity"
            })
            .setTimestamp();

        return message.reply({
            embeds: [embed]
        });
    }

    if (command === "!stats") {

        const member = message.mentions.members.first() || message.member;

        const user = getUserData(member.id);

        const weeklyLeaderboard = [...users.entries()]
            .sort((a, b) => b[1].weekTime - a[1].weekTime);

        const weeklyRank = weeklyLeaderboard.findIndex(([id]) => id === member.id) + 1;

        const totalLeaderboard = [...users.entries()]
            .sort((a, b) => b[1].totalTime - a[1].totalTime);

        const totalRank = totalLeaderboard.findIndex(([id]) => id === member.id) + 1;

        const weekSeconds = Math.floor(user.weekTime / 1000);
        const totalSeconds = Math.floor(user.totalTime / 1000);

        const weekHours = Math.floor(weekSeconds / 3600);
        const weekMinutes = Math.floor((weekSeconds % 3600) / 60);

        const totalHours = Math.floor(totalSeconds / 3600);
        const totalMinutes = Math.floor((totalSeconds % 3600) / 60);

        let session = "Offline";

        if (user.loginTime !== null) {

            const diff = Date.now() - user.loginTime;

            const s = Math.floor(diff / 1000);
            const h = Math.floor(s / 3600);
            const m = Math.floor((s % 3600) / 60);

            session = `${h}h ${m}m`;
        }

        const embed = new EmbedBuilder()
            .setColor("#2B2D31")
            .setTitle("📊 Staff Statistics")
            .setDescription(`👤 **${member.user.tag}**`)
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                {
                    name: "⏱ Current Session",
                    value: session,
                    inline: true
                },
                {
                    name: "📅 This Week",
                    value: `${weekHours}h ${weekMinutes}m`,
                    inline: true
                },
                {
                    name: "🏆 All Time",
                    value: `${totalHours}h ${totalMinutes}m`,
                    inline: true
                },
                {
                    name: "🟢 Status",
                    value: user.loginTime ? "On Duty" : "Off Duty",
                    inline: true
                }
            )
            .addFields(
                {
                    name: "🏅 Weekly Rank",
                    value: `#${weeklyRank}`,
                    inline: true
                },
                {
                    name: "👑 All Time Rank",
                    value: `#${totalRank}`,
                    inline: true
                }
            )
            .setTimestamp();

        return message.reply({
            embeds: [embed]
        });

    }

};