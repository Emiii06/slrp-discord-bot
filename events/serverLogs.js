const {
    EmbedBuilder,
    AuditLogEvent
} = require("discord.js");

const {
    ROLE_LOGS,
    SERVER_LOGS
} = require("../config");

const recentlyCreatedRoles = new Set();

async function getAuditExecutor(guild, type, targetId) {
    try {
        for (let attempt = 0; attempt < 3; attempt++) {
            const logs = await guild.fetchAuditLogs({
                type,
                limit: 10
            });

            const entry = logs.entries.find(entry => {
                if (!entry.target) return false;

                if (targetId && entry.target.id !== targetId) {
                    return false;
                }

                return (
                    Date.now() - entry.createdTimestamp < 15000
                );
            });

            if (entry) {
                return entry.executor;
            }

            await new Promise(resolve =>
                setTimeout(resolve, 500)
            );
        }
    } catch (error) {
        console.error(
            "SERVER LOGS: Failed to fetch audit logs:",
            error
        );
    }

    return null;
}

function formatPermissions(role) {
    const permissions = role.permissions.toArray();

    if (!permissions.length) {
        return "None";
    }

    return permissions
        .map(permission =>
            `• ${permission
                .toLowerCase()
                .replace(/_/g, " ")
                .replace(/\b\w/g, char => char.toUpperCase())}`
        )
        .join("\n");
}

async function getLogChannel(guild) {
    return guild.channels.fetch(SERVER_LOGS).catch(() => null);
}

async function sendLog(guild, embed, channelId = SERVER_LOGS) {
    const channel = await guild.channels.fetch(channelId).catch(() => null);

    if (!channel) {
        console.error(
            `SERVER LOGS: Channel ${channelId} could not be found.`
        );
        return;
    }

    await channel.send({
        embeds: [embed]
    });
}

module.exports = (client) => {

    console.log("SERVER LOGS MODULE LOADED");

    /*
    ========================================
    MEMBER JOIN
    ========================================
    */

    client.on("guildMemberAdd", async (member) => {

        const embed = new EmbedBuilder()
            .setColor("#57F287")
            .setTitle("📥 Member Joined")
            .addFields(
                {
                    name: "User",
                    value: `${member} (\`${member.id}\`)`
                },
                {
                    name: "Account Created",
                    value: `<t:${Math.floor(
                        member.user.createdTimestamp / 1000
                    )}:F>`
                }
            )
            .setTimestamp();

        await sendLog(member.guild, embed);
    });


    /*
========================================
ROLE CREATE
========================================
*/

    client.on("roleCreate", async (role) => {

        recentlyCreatedRoles.add(role.id);

        setTimeout(() => {
            recentlyCreatedRoles.delete(role.id);
        }, 5000);

        const executor = await getAuditExecutor(
            role.guild,
            AuditLogEvent.RoleCreate,
            role.id
        );

        const embed = new EmbedBuilder()
            .setColor(role.color || "#5865F2")
            .setTitle("🎭 Role Created")
            .addFields(
                {
                    name: "Role",
                    value: `${role} (\`${role.id}\`)`
                },
                {
                    name: "🎨 Color",
                    value: role.hexColor
                },
                {
                    name: "🔐 Permissions",
                    value: formatPermissions(role)
                },
                {
                    name: "👤 Created By",
                    value: executor
                        ? `${executor} (\`${executor.id}\`)`
                        : "Unknown"
                }
            )
            .setTimestamp();

        await sendLog(
            role.guild,
            embed,
            ROLE_LOGS
        );
    });


    /*
    ========================================
    ROLE DELETE
    ========================================
    */

    client.on("roleDelete", async (role) => {

        const executor = await getAuditExecutor(
            role.guild,
            AuditLogEvent.RoleDelete,
            role.id
        );

        const embed = new EmbedBuilder()
            .setColor(role.color || "#ED4245")
            .setTitle("🗑️ Role Deleted")
            .addFields(
                {
                    name: "Role",
                    value: `\`${role.name}\` (\`${role.id}\`)`
                },
                {
                    name: "🎨 Color",
                    value: role.hexColor
                },
                {
                    name: "🔐 Permissions",
                    value: formatPermissions(role)
                },
                {
                    name: "👤 Deleted By",
                    value: executor
                        ? `${executor} (\`${executor.id}\`)`
                        : "Unknown"
                }
            )
            .setTimestamp();

        await sendLog(
            role.guild,
            embed,
            ROLE_LOGS
        );
    });


    /*
    ========================================
    ROLE UPDATE
    ========================================
    */

    client.on("roleUpdate", async (oldRole, newRole) => {

        /*
        Ignore the update Discord sometimes fires
        immediately after creating a role.
        */

        if (recentlyCreatedRoles.has(newRole.id)) {
            return;
        }

        const changes = [];

        /*
        NAME
        */

        if (oldRole.name !== newRole.name) {
            changes.push(
                `📝 **Name**\n` +
                `\`${oldRole.name}\` → \`${newRole.name}\``
            );
        }

        /*
        COLOR
        */

        if (oldRole.hexColor !== newRole.hexColor) {
            changes.push(
                `🎨 **Color**\n` +
                `\`${oldRole.hexColor}\` → \`${newRole.hexColor}\``
            );
        }

        /*
        PERMISSIONS
        */

        const oldPermissions = new Set(
            oldRole.permissions.toArray()
        );

        const newPermissions = new Set(
            newRole.permissions.toArray()
        );

        const addedPermissions = [
            ...newPermissions
        ].filter(
            permission => !oldPermissions.has(permission)
        );

        const removedPermissions = [
            ...oldPermissions
        ].filter(
            permission => !newPermissions.has(permission)
        );

        if (
            addedPermissions.length ||
            removedPermissions.length
        ) {
            let permissionChanges = "";

            if (addedPermissions.length) {
                permissionChanges +=
                    "**Added:**\n" +
                    addedPermissions
                        .map(permission =>
                            `+ ${permission
                                .toLowerCase()
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, char =>
                                    char.toUpperCase()
                                )}`
                        )
                        .join("\n");
            }

            if (
                addedPermissions.length &&
                removedPermissions.length
            ) {
                permissionChanges += "\n\n";
            }

            if (removedPermissions.length) {
                permissionChanges +=
                    "**Removed:**\n" +
                    removedPermissions
                        .map(permission =>
                            `- ${permission
                                .toLowerCase()
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, char =>
                                    char.toUpperCase()
                                )}`
                        )
                        .join("\n");
            }

            changes.push(
                `🔐 **Permissions**\n${permissionChanges}`
            );
        }

        /*
        NOTHING IMPORTANT CHANGED
        */

        if (!changes.length) {
            return;
        }

        const executor = await getAuditExecutor(
            newRole.guild,
            AuditLogEvent.RoleUpdate,
            newRole.id
        );

        const embed = new EmbedBuilder()
            .setColor(newRole.color || "#FEE75C")
            .setTitle("✏️ Role Modified")
            .addFields(
                {
                    name: "Role",
                    value: `${newRole} (\`${newRole.id}\`)`
                },
                {
                    name: "Changes",
                    value: changes.join("\n\n")
                },
                {
                    name: "👤 Changed By",
                    value: executor
                        ? `${executor} (\`${executor.id}\`)`
                        : "Unknown"
                }
            )
            .setTimestamp();

        await sendLog(
            newRole.guild,
            embed,
            ROLE_LOGS
        );


        /*
========================================
NITRO BOOST
========================================
*/

        const wasBoosting = oldMember.premiumSince !== null;
        const isBoosting = newMember.premiumSince !== null;


        /*
        BOOST ADDED
        */

        if (!wasBoosting && isBoosting) {

            const embed = new EmbedBuilder()
                .setColor("#FF73FA")
                .setTitle("🚀 Nitro Boost Added")
                .addFields(
                    {
                        name: "User",
                        value: `${newMember} (\`${newMember.id}\`)`
                    },
                    {
                        name: "Boosting Since",
                        value: `<t:${Math.floor(
                            newMember.premiumSinceTimestamp / 1000
                        )}:F>`
                    }
                )
                .setTimestamp();

            await sendLog(
                newMember.guild,
                embed,
                SERVER_LOGS
            );
        }


        /*
        BOOST REMOVED
        */

        if (wasBoosting && !isBoosting) {

            const embed = new EmbedBuilder()
                .setColor("#ED4245")
                .setTitle("💔 Nitro Boost Removed")
                .addFields(
                    {
                        name: "User",
                        value: `${newMember} (\`${newMember.id}\`)`
                    },
                    {
                        name: "Boosted Since",
                        value: oldMember.premiumSince
                            ? `<t:${Math.floor(
                                oldMember.premiumSinceTimestamp / 1000
                            )}:F>`
                            : "Unknown"
                    }
                )
                .setTimestamp();

            await sendLog(
                newMember.guild,
                embed,
                SERVER_LOGS
            );
        }
    });


    /*
========================================
MEMBER LEAVE / KICK
========================================
*/

    client.on("guildMemberRemove", async (member) => {

        let kickExecutor = null;

        /*
        ========================================
        CHECK IF MEMBER WAS KICKED
        ========================================
        */

        try {

            kickExecutor = await getAuditExecutor(
                member.guild,
                AuditLogEvent.MemberKick,
                member.id
            );

        } catch (error) {

            console.error(
                "SERVER LOGS: Failed to check member kick:",
                error
            );

        }

        /*
        ========================================
        MEMBER KICKED
        ========================================
        */

        if (kickExecutor) {

            const embed = new EmbedBuilder()
                .setColor("#ED4245")
                .setTitle("👢 Member Kicked")
                .addFields(
                    {
                        name: "User",
                        value: `${member} (\`${member.id}\`)`
                    },
                    {
                        name: "👤 Kicked By",
                        value: `${kickExecutor} (\`${kickExecutor.id}\`)`
                    }
                )
                .setTimestamp();

            return sendLog(
                member.guild,
                embed,
                SERVER_LOGS
            );
        }

        /*
        ========================================
        MEMBER LEFT
        ========================================
        */

        const embed = new EmbedBuilder()
            .setColor("#ED4245")
            .setTitle("📤 Member Left")
            .addFields({
                name: "User",
                value: `${member} (\`${member.id}\`)`
            })
            .setTimestamp();

        await sendLog(
            member.guild,
            embed,
            SERVER_LOGS
        );
    });


    /*
    ========================================
    BAN
    ========================================
    */

    client.on("guildBanAdd", async (ban) => {

        const executor = await getAuditExecutor(
            ban.guild,
            AuditLogEvent.MemberBanAdd,
            ban.user.id
        );

        const embed = new EmbedBuilder()
            .setColor("#ED4245")
            .setTitle("🔨 Member Banned")
            .addFields(
                {
                    name: "User",
                    value: `${ban.user.tag} (\`${ban.user.id}\`)`
                },
                {
                    name: "👤 Banned By",
                    value: executor
                        ? `${executor} (\`${executor.id}\`)`
                        : "Unknown"
                }
            )
            .setTimestamp();

        await sendLog(
            ban.guild,
            embed,
            SERVER_LOGS
        );
    });


    /*
    ========================================
    UNBAN
    ========================================
    */

    client.on("guildBanRemove", async (ban) => {

        const executor = await getAuditExecutor(
            ban.guild,
            AuditLogEvent.MemberBanRemove,
            ban.user.id
        );

        const embed = new EmbedBuilder()
            .setColor("#57F287")
            .setTitle("🔓 Member Unbanned")
            .addFields(
                {
                    name: "User",
                    value: `${ban.user.tag} (\`${ban.user.id}\`)`
                },
                {
                    name: "👤 Unbanned By",
                    value: executor
                        ? `${executor} (\`${executor.id}\`)`
                        : "Unknown"
                }
            )
            .setTimestamp();

        await sendLog(
            ban.guild,
            embed,
            SERVER_LOGS
        );
    });


    /*
    ========================================
    MEMBER UPDATE
    TIMEOUT + NICKNAME
    ========================================
    */

    /*
    ========================================
    MEMBER UPDATE
    ROLES + TIMEOUT + NICKNAME + NITRO
    ========================================
    */

    client.on("guildMemberUpdate", async (oldMember, newMember) => {

        /*
 ========================================
 ROLE CHANGES
 ========================================
 */

        const oldRoles = new Set(oldMember.roles.cache.keys());
        const newRoles = new Set(newMember.roles.cache.keys());

        const addedRoles = [...newRoles].filter(
            roleId => !oldRoles.has(roleId)
        );

        const removedRoles = [...oldRoles].filter(
            roleId => !newRoles.has(roleId)
        );

        if (addedRoles.length || removedRoles.length) {

            let executor = null;

            try {
                const logs = await newMember.guild.fetchAuditLogs({
                    type: AuditLogEvent.MemberRoleUpdate,
                    limit: 10
                });

                const auditEntry = logs.entries.find(entry =>
                    entry.target?.id === newMember.id &&
                    Date.now() - entry.createdTimestamp < 15000
                );

                executor = auditEntry?.executor || null;

            } catch (error) {
                console.error(
                    "SERVER LOGS: Failed to fetch role audit log:",
                    error
                );
            }

            /*
            ========================================
            ROLE ADDED
            ========================================
            */

            for (const roleId of addedRoles) {

                const role = newMember.guild.roles.cache.get(roleId);

                if (!role) {
                    continue;
                }

                console.log(
                    "ROLE ADDED:",
                    newMember.user.tag,
                    role.name
                );

                const embed = new EmbedBuilder()
                    .setColor("#57F287")
                    .setTitle("➕ Role Added")
                    .addFields(
                        {
                            name: "User",
                            value: `${newMember} (\`${newMember.id}\`)`
                        },
                        {
                            name: "Role",
                            value: `${role} (\`${role.id}\`)`
                        },
                        {
                            name: "👤 Added By",
                            value: executor
                                ? `${executor} (\`${executor.id}\`)`
                                : "Unknown"
                        }
                    )
                    .setTimestamp();

                await sendLog(
                    newMember.guild,
                    embed,
                    ROLE_LOGS
                );
            }

            /*
            ========================================
            ROLE REMOVED
            ========================================
            */

            for (const roleId of removedRoles) {

                const role = oldMember.guild.roles.cache.get(roleId);

                if (!role) {
                    continue;
                }

                console.log(
                    "ROLE REMOVED:",
                    newMember.user.tag,
                    role.name
                );

                const embed = new EmbedBuilder()
                    .setColor("#ED4245")
                    .setTitle("➖ Role Removed")
                    .addFields(
                        {
                            name: "User",
                            value: `${newMember} (\`${newMember.id}\`)`
                        },
                        {
                            name: "Role",
                            value: `${role} (\`${role.id}\`)`
                        },
                        {
                            name: "👤 Removed By",
                            value: executor
                                ? `${executor} (\`${executor.id}\`)`
                                : "Unknown"
                        }
                    )
                    .setTimestamp();

                await sendLog(
                    newMember.guild,
                    embed,
                    ROLE_LOGS
                );
            }
        }


        /*
        ========================================
        TIMEOUT GIVEN
        ========================================
        */

        const oldTimeout =
            oldMember.communicationDisabledUntilTimestamp;

        const newTimeout =
            newMember.communicationDisabledUntilTimestamp;

        if (
            oldTimeout !== newTimeout &&
            newTimeout
        ) {

            const executor = await getAuditExecutor(
                newMember.guild,
                AuditLogEvent.MemberUpdate,
                newMember.id
            );

            const embed = new EmbedBuilder()
                .setColor("#FEE75C")
                .setTitle("⏱️ Member Timed Out")
                .addFields(
                    {
                        name: "User",
                        value: `${newMember} (\`${newMember.id}\`)`
                    },
                    {
                        name: "Duration Until",
                        value: `<t:${Math.floor(newTimeout / 1000)}:F>`
                    },
                    {
                        name: "👤 Given By",
                        value: executor
                            ? `${executor} (\`${executor.id}\`)`
                            : "Unknown"
                    }
                )
                .setTimestamp();

            await sendLog(
                newMember.guild,
                embed,
                SERVER_LOGS
            );
        }


        /*
        ========================================
        TIMEOUT REMOVED
        ========================================
        */

        if (
            oldTimeout &&
            !newTimeout
        ) {

            const executor = await getAuditExecutor(
                newMember.guild,
                AuditLogEvent.MemberUpdate,
                newMember.id
            );

            const embed = new EmbedBuilder()
                .setColor("#57F287")
                .setTitle("⏱️ Timeout Removed")
                .addFields(
                    {
                        name: "User",
                        value: `${newMember} (\`${newMember.id}\`)`
                    },
                    {
                        name: "👤 Removed By",
                        value: executor
                            ? `${executor} (\`${executor.id}\`)`
                            : "Unknown"
                    }
                )
                .setTimestamp();

            await sendLog(
                newMember.guild,
                embed,
                SERVER_LOGS
            );
        }


        /*
        ========================================
        NICKNAME
        ========================================
        */

        if (
            oldMember.nickname !==
            newMember.nickname
        ) {

            const executor = await getAuditExecutor(
                newMember.guild,
                AuditLogEvent.MemberUpdate,
                newMember.id
            );

            const embed = new EmbedBuilder()
                .setColor("#5865F2")
                .setTitle("✏️ Nickname Changed")
                .addFields(
                    {
                        name: "User",
                        value: `${newMember} (\`${newMember.id}\`)`
                    },
                    {
                        name: "Before",
                        value: oldMember.nickname
                            ? `\`${oldMember.nickname}\``
                            : "None"
                    },
                    {
                        name: "After",
                        value: newMember.nickname
                            ? `\`${newMember.nickname}\``
                            : "None"
                    },
                    {
                        name: "👤 Changed By",
                        value: executor
                            ? `${executor} (\`${executor.id}\`)`
                            : "Unknown"
                    }
                )
                .setTimestamp();

            await sendLog(
                newMember.guild,
                embed,
                SERVER_LOGS
            );
        }


        /*
        ========================================
        NITRO BOOST ADDED
        ========================================
        */

        const wasBoosting =
            oldMember.premiumSince !== null;

        const isBoosting =
            newMember.premiumSince !== null;

        if (
            !wasBoosting &&
            isBoosting
        ) {

            const embed = new EmbedBuilder()
                .setColor("#FF73FA")
                .setTitle("🚀 Nitro Boost Added")
                .addFields(
                    {
                        name: "User",
                        value: `${newMember} (\`${newMember.id}\`)`
                    },
                    {
                        name: "Boosting Since",
                        value: newMember.premiumSinceTimestamp
                            ? `<t:${Math.floor(
                                newMember.premiumSinceTimestamp / 1000
                            )}:F>`
                            : "Unknown"
                    }
                )
                .setTimestamp();

            await sendLog(
                newMember.guild,
                embed,
                SERVER_LOGS
            );
        }


        /*
        ========================================
        NITRO BOOST REMOVED
        ========================================
        */

        if (
            wasBoosting &&
            !isBoosting
        ) {

            const embed = new EmbedBuilder()
                .setColor("#ED4245")
                .setTitle("💔 Nitro Boost Removed")
                .addFields(
                    {
                        name: "User",
                        value: `${newMember} (\`${newMember.id}\`)`
                    },
                    {
                        name: "Boosted Since",
                        value: oldMember.premiumSinceTimestamp
                            ? `<t:${Math.floor(
                                oldMember.premiumSinceTimestamp / 1000
                            )}:F>`
                            : "Unknown"
                    }
                )
                .setTimestamp();

            await sendLog(
                newMember.guild,
                embed,
                SERVER_LOGS
            );
        }

    });


    /*
    ========================================
    CHANNEL CREATE
    ========================================
    */

    client.on("channelCreate", async (channel) => {

        const executor = await getAuditExecutor(
            channel.guild,
            AuditLogEvent.ChannelCreate,
            channel.id
        );

        const embed = new EmbedBuilder()
            .setColor("#57F287")
            .setTitle("📁 Channel Created")
            .addFields(
                {
                    name: "Channel",
                    value: `${channel} (\`${channel.id}\`)`
                },
                {
                    name: "Type",
                    value: `${channel.type}`
                },
                {
                    name: "👤 Created By",
                    value: executor
                        ? `${executor} (\`${executor.id}\`)`
                        : "Unknown"
                }
            )
            .setTimestamp();

        await sendLog(
            channel.guild,
            embed,
            SERVER_LOGS
        );
    });


    /*
    ========================================
    CHANNEL DELETE
    ========================================
    */

    client.on("channelDelete", async (channel) => {

        const executor = await getAuditExecutor(
            channel.guild,
            AuditLogEvent.ChannelDelete,
            channel.id
        );

        const embed = new EmbedBuilder()
            .setColor("#ED4245")
            .setTitle("🗑️ Channel Deleted")
            .addFields(
                {
                    name: "Channel",
                    value: `\`${channel.name}\` (\`${channel.id}\`)`
                },
                {
                    name: "👤 Deleted By",
                    value: executor
                        ? `${executor} (\`${executor.id}\`)`
                        : "Unknown"
                }
            )
            .setTimestamp();

        await sendLog(
            channel.guild,
            embed,
            SERVER_LOGS
        );
    });

    /*
    ========================================
    CHANNEL UPDATE
    ========================================
    */

    client.on("channelUpdate", async (oldChannel, newChannel) => {

        const changes = [];

        if (oldChannel.name !== newChannel.name) {
            changes.push(
                `📝 **Name**\n` +
                `\`${oldChannel.name}\` → \`${newChannel.name}\``
            );
        }

        if (
            oldChannel.parentId !==
            newChannel.parentId
        ) {
            changes.push(
                `📁 **Category**\n` +
                `\`${oldChannel.parent?.name || "None"}\` → ` +
                `\`${newChannel.parent?.name || "None"}\``
            );
        }

        if (!changes.length) {
            return;
        }

        const executor = await getAuditExecutor(
            newChannel.guild,
            AuditLogEvent.ChannelUpdate,
            newChannel.id
        );

        const embed = new EmbedBuilder()
            .setColor("#FEE75C")
            .setTitle("✏️ Channel Modified")
            .addFields(
                {
                    name: "Channel",
                    value: `${newChannel} (\`${newChannel.id}\`)`
                },
                {
                    name: "Changes",
                    value: changes.join("\n\n")
                },
                {
                    name: "👤 Changed By",
                    value: executor
                        ? `${executor} (\`${executor.id}\`)`
                        : "Unknown"
                }
            )
            .setTimestamp();

        await sendLog(
            newChannel.guild,
            embed,
            SERVER_LOGS
        );
    });

    /*
    ========================================
    INVITE CREATED
    ========================================
    */

    client.on("inviteCreate", async (invite) => {

        const executor = invite.inviter;

        const embed = new EmbedBuilder()
            .setColor("#57F287")
            .setTitle("🔗 Invite Created")
            .addFields(
                {
                    name: "Invite",
                    value: `\`${invite.code}\``
                },
                {
                    name: "Channel",
                    value: invite.channel
                        ? `${invite.channel}`
                        : "Unknown"
                },
                {
                    name: "Inviter",
                    value: executor
                        ? `${executor} (\`${executor.id}\`)`
                        : "Unknown"
                }
            )
            .setTimestamp();

        await sendLog(
            invite.guild,
            embed,
            SERVER_LOGS
        );
    });


    /*
    ========================================
    INVITE DELETED
    ========================================
    */

    client.on("inviteDelete", async (invite) => {

        const embed = new EmbedBuilder()
            .setColor("#ED4245")
            .setTitle("🗑️ Invite Deleted")
            .addFields(
                {
                    name: "Invite",
                    value: `\`${invite.code}\``
                },
                {
                    name: "Channel",
                    value: invite.channel
                        ? `${invite.channel}`
                        : "Unknown"
                }
            )
            .setTimestamp();

        await sendLog(
            invite.guild,
            embed,
            SERVER_LOGS
        );
    });


    /*
    ========================================
    MESSAGE DELETE
    ========================================
    */

    client.on("messageDelete", async (message) => {

        if (!message.guild) {
            return;
        }

        const content =
            message.content?.trim()
                ? message.content
                : "No message content available.";

        let executor = null;

        /*
        ========================================
        FIND AUDIT LOG EXECUTOR
        ========================================
        */

        try {

            await new Promise(resolve =>
                setTimeout(resolve, 1000)
            );

            const logs = await message.guild.fetchAuditLogs({
                type: AuditLogEvent.MessageDelete,
                limit: 20
            });

            const entry = logs.entries.find(entry => {

                if (!entry.target) {
                    return false;
                }

                /*
                Target must be the author
                */

                if (
                    message.author &&
                    entry.target.id !== message.author.id
                ) {
                    return false;
                }

                /*
                Audit entry must be recent
                */

                if (
                    Date.now() - entry.createdTimestamp > 10000
                ) {
                    return false;
                }

                /*
                If Discord provides channel information,
                make sure it matches.
                */

                if (
                    entry.extra?.channel?.id &&
                    entry.extra.channel.id !== message.channel.id
                ) {
                    return false;
                }

                return true;
            });

            if (entry) {
                executor = entry.executor;
            }

        } catch (error) {

            console.error(
                "SERVER LOGS: Failed to determine message delete executor:",
                error
            );

        }

        const embed = new EmbedBuilder()
            .setColor("#ED4245")
            .setTitle("🗑️ Message Deleted")
            .addFields(
                {
                    name: "User",
                    value: message.author
                        ? `${message.author} (\`${message.author.id}\`)`
                        : "Unknown"
                },
                {
                    name: "Channel",
                    value: `${message.channel}`
                },
                {
                    name: "Message",
                    value:
                        content.length > 1024
                            ? content.substring(0, 1021) + "..."
                            : content
                },
                {
                    name: "👤 Deleted By",
                    value: executor
                        ? `${executor} (\`${executor.id}\`)`
                        : "Unknown"
                }
            )
            .setTimestamp();

        if (message.attachments?.size) {

            embed.addFields({
                name: "Attachments",
                value: message.attachments
                    .map(attachment => attachment.url)
                    .join("\n")
                    .substring(0, 1024)
            });

        }

        await sendLog(
            message.guild,
            embed,
            SERVER_LOGS
        );
    });


    /*
========================================
MESSAGE EDIT
========================================
*/

    client.on("messageUpdate", async (oldMessage, newMessage) => {

        if (!newMessage.guild) {
            return;
        }

        if (oldMessage.content === newMessage.content) {
            return;
        }

        const before =
            oldMessage.content?.trim()
                ? oldMessage.content
                : "No message content available.";

        const after =
            newMessage.content?.trim()
                ? newMessage.content
                : "No message content available.";

        const embed = new EmbedBuilder()
            .setColor("#FEE75C")
            .setTitle("✏️ Message Edited")
            .addFields(
                {
                    name: "User",
                    value: newMessage.author
                        ? `${newMessage.author} (\`${newMessage.author.id}\`)`
                        : "Unknown"
                },
                {
                    name: "Channel",
                    value: `${newMessage.channel}`
                },
                {
                    name: "Before",
                    value: before.length > 1024
                        ? before.substring(0, 1021) + "..."
                        : before
                },
                {
                    name: "After",
                    value: after.length > 1024
                        ? after.substring(0, 1021) + "..."
                        : after
                },
                {
                    name: "Jump to Message",
                    value: `[View Message](${newMessage.url})`
                }
            )
            .setTimestamp();

        await sendLog(
            newMessage.guild,
            embed,
            SERVER_LOGS
        );
    });


    /*
========================================
BULK MESSAGE DELETE
========================================
*/

    client.on("messageDeleteBulk", async (messages) => {

        const firstMessage = messages.first();

        if (!firstMessage?.guild) {
            return;
        }

        const channel = firstMessage.channel;

        const embed = new EmbedBuilder()
            .setColor("#ED4245")
            .setTitle("🗑️ Bulk Messages Deleted")
            .addFields(
                {
                    name: "Channel",
                    value: `${channel}`
                },
                {
                    name: "Messages Deleted",
                    value: `**${messages.size}** messages`
                }
            )
            .setTimestamp();

        await sendLog(
            firstMessage.guild,
            embed,
            SERVER_LOGS
        );
    });




};