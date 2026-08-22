const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");

const applications = require("../commands/applicationData");

const path = require("path");
const fs = require("fs");

const {
  APPLICATION_RESULTS_CHANNEL,
  APPLICATION_ANNOUNCE_CHANNEL,
  TICKET_SYSTEMS,
  PATCHNOTES_CHANNEL,
  TICKET_TRANSCRIPT_CHANNEL,
  MOD_LOG_CHANNEL,
  SERVER_LOGS
} = require("../config");

const activeApplications = new Map();
const pendingReviews = new Map();
const createTicketTranscript = require("../utils/createTicketTranscript");

const applicationSessionsPath = path.join(
  __dirname,
  "../data/applicationSessions.json",
);

function loadApplicationSessions() {
  try {
    if (!fs.existsSync(applicationSessionsPath)) {
      fs.writeFileSync(applicationSessionsPath, "{}");
    }

    const data = JSON.parse(fs.readFileSync(applicationSessionsPath, "utf8"));

    for (const [userId, state] of Object.entries(data)) {
      activeApplications.set(userId, state);
    }

    console.log(
      `Loaded ${activeApplications.size} active application session(s).`,
    );
  } catch (error) {
    console.error("APPLICATION SESSION LOAD ERROR:", error);
  }
}

function saveApplicationSessions() {
  try {
    const data = Object.fromEntries(activeApplications);

    fs.writeFileSync(applicationSessionsPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("APPLICATION SESSION SAVE ERROR:", error);
  }
}

loadApplicationSessions();

module.exports = (client) => {
  console.log("INTERACTION CREATE HANDLER REGISTERED");

  client.on("interactionCreate", async (interaction) => {

    module.exports = (client) => {
      console.log("INTERACTION CREATE HANDLER REGISTERED");

      client.on("interactionCreate", async (interaction) => {

        try {

          /*
          ========================================
          SLASH COMMANDS
          ========================================
          */

          if (interaction.isChatInputCommand()) {

            // /clear
            // /logs

          }

          /*
          ========================================
          PATCHNOTE CREATE
          ========================================
          */

          // ...

        } catch (error) {

          console.error(
            "INTERACTION ERROR:",
            error
          );

        }

      });
    };


    /*
========================================
SLASH COMMANDS
========================================
*/

    if (interaction.isChatInputCommand()) {


      if (interaction.commandName === "patchnote") {

        if (
          !interaction.member.permissions.has(
            PermissionFlagsBits.Administrator
          )
        ) {
          return interaction.reply({
            content: "❌ You don't have permission to create patchnotes.",
            flags: 64
          });
        }

        const button = new ButtonBuilder()
          .setCustomId("patchnote_open")
          .setLabel("Create Patchnote")
          .setEmoji("📝")
          .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
          .addComponents(button);

        return interaction.reply({
          content:
            "📝 **Patchnote Creator**\nClick the button below to create a patchnote.",
          components: [row]
        });
      }
      if (interaction.commandName === "clear") {

        if (
          !interaction.member.permissions.has(
            PermissionFlagsBits.ManageMessages
          )
        ) {
          return interaction.reply({
            content: "❌ You don't have permission to use this command.",
            flags: 64
          });
        }

        const amount = interaction.options.getInteger("amount");

        try {

          const messages = await interaction.channel.bulkDelete(
            amount,
            true
          );

          await interaction.reply({
            content: `🗑️ Deleted **${messages.size}** message${messages.size === 1 ? "" : "s"}.`,
            flags: 64
          });

        } catch (error) {

          console.error("CLEAR COMMAND ERROR:", error);

          if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
              content: "❌ I couldn't delete the messages.",
              flags: 64
            });
          }
        }

        return;
      }
    }

    try {

      console.log(
        "INTERACTION:",
        interaction.type,
        interaction.isButton() ? interaction.customId : "not a button"
      );

      /*
========================================
/session
========================================
*/

      if (interaction.commandName === "session") {

        const action =
          interaction.options.getString("action");

        const channel = await client.channels
          .fetch(SESSION_CHANNEL)
          .catch(() => null);

        if (!channel) {
          return interaction.reply({
            content: "❌ Announcement channel could not be found.",
            flags: 64
          });
        }

        const fs = require("fs");

        /*
        ========================================
        SESSION STARTUP
        ========================================
        */

        if (action === "startup") {

          if (
            !interaction.member.roles.cache.has(HOST_ROLE)
          ) {
            return interaction.reply({
              content:
                "❌ You don't have permission to use this command.",
              flags: 64
            });
          }

          fs.writeFileSync(
            "./data/session.json",
            JSON.stringify({
              startedAt: Date.now()
            }, null, 4)
          );

          const embed = new EmbedBuilder()
            .setColor("#57F287")
            .setTitle("🚨 State Line Roleplay | Session Startup")
            .setDescription(
              "The roleplay session is now officially **LIVE!**\n\n" +
              "All members are expected to follow server rules, maintain realistic roleplay, and comply with staff instructions throughout the session."
            )
            .addFields({
              name: "📋 Session Information",
              value:
                "🟢 **Roleplay is now live**\n" +
                "📜 Follow all server rules\n" +
                "🚗 Speed limits are enforced\n" +
                "👮 Follow all staff instructions\n" +
                "🚓 LEO, 🚑 Fire/EMS, 🚧 DOT & Civilians may begin operations\n" +
                "📻 Keep radio communications professional"
            })
            .setFooter({
              text: "State Line Roleplay"
            })
            .setTimestamp();

          await channel.send({
            content: "@here",
            embeds: [embed]
          });

          return interaction.reply({
            content: "✅ Session started.",
            flags: 64
          });
        }

        /*
        ========================================
        SESSION END
        ========================================
        */

        if (action === "end") {

          if (
            !interaction.member.roles.cache.has(HOST_ROLE)
          ) {
            return interaction.reply({
              content:
                "❌ You don't have permission to use this command.",
              flags: 64
            });
          }

          let session;

          try {

            session = JSON.parse(
              fs.readFileSync(
                "./data/session.json",
                "utf8"
              )
            );

          } catch (error) {

            return interaction.reply({
              content:
                "❌ No active session could be found.",
              flags: 64
            });
          }

          const duration =
            Date.now() - session.startedAt;

          const hours =
            Math.floor(duration / 3600000);

          const minutes =
            Math.floor(
              (duration % 3600000) / 60000
            );

          const sessionTime =
            `${hours}h ${minutes}m`;

          const embed = new EmbedBuilder()
            .setColor("#ED4245")
            .setTitle("🔴 State Line Roleplay | Session Ended")
            .setDescription(
              "Today's roleplay session has officially concluded.\n\n" +
              "Thank you to everyone who participated and helped create an enjoyable experience for the community.\n\n" +
              `⏱️ **Session Duration:** ${sessionTime}\n\n` +
              "We appreciate everyone who joined and look forward to seeing you in the next session!"
            )
            .addFields({
              name: "📊 Session Summary",
              value:
                `• Duration: **${sessionTime}**\n` +
                "• Session Status: **Ended**\n" +
                "• Thank you for playing!"
            })
            .setFooter({
              text: "State Line Roleplay"
            })
            .setTimestamp();

          await channel.send({
            content: "@here",
            embeds: [embed]
          });

          return interaction.reply({
            content: `✅ Session ended. Duration: ${sessionTime}`,
            flags: 64
          });
        }

        /*
        ========================================
        PUBLIC SAFETY ON DUTY
        ========================================
        */

        if (action === "ps-on") {

          if (
            !interaction.member.roles.cache.has(PS_ROLE)
          ) {
            return interaction.reply({
              content:
                "❌ You don't have permission to use this command.",
              flags: 64
            });
          }

          const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🚔 Public Safety Status Update")
            .setDescription(
              "Public Safety is now officially **ON DUTY**.\n\n" +
              "Departments are active and ready to respond to incidents. Please cooperate with all emergency services and continue to follow server rules throughout the session."
            )
            .addFields({
              name: "🚨 Active Operations",
              value:
                "👮 Officers are now available for calls\n" +
                "🚓 County patrols have begun\n" +
                "🚑 Fire/EMS are available for emergencies\n" +
                "🚧 DOT remains on standby"
            })
            .setFooter({
              text: "State Line Roleplay"
            })
            .setTimestamp();

          await channel.send({
            content: "@here",
            embeds: [embed]
          });

          return interaction.reply({
            content: "✅ Public Safety is now ON DUTY.",
            flags: 64
          });
        }

        /*
        ========================================
        PUBLIC SAFETY OFF DUTY
        ========================================
        */

        if (action === "ps-off") {

          if (
            !interaction.member.roles.cache.has(PS_ROLE)
          ) {
            return interaction.reply({
              content:
                "❌ You don't have permission to use this command.",
              flags: 64
            });
          }

          const embed = new EmbedBuilder()
            .setColor("#ED4245")
            .setTitle("🚔 Public Safety Status Update")
            .setDescription(
              "Public Safety is now officially **OFF DUTY**.\n\n" +
              "Law Enforcement has concluded active patrols for this session. We thank everyone for their cooperation and contribution to a realistic roleplay experience."
            )
            .addFields({
              name: "📋 Duty Status",
              value:
                "🔴 Officers have ended their patrols\n" +
                "📋 Remaining departments continue normal operations\n" +
                "🤝 Thank you for participating in today's RP session"
            })
            .setFooter({
              text: "State Line Roleplay"
            })
            .setTimestamp();

          await channel.send({
            content: "@here",
            embeds: [embed]
          });

          return interaction.reply({
            content: "✅ Public Safety is now OFF DUTY.",
            flags: 64
          });
        }
      }
      /*
========================================
/logs
========================================
*/

      if (
        interaction.isChatInputCommand() &&
        interaction.commandName === "logs"
      ) {

        const type = interaction.options.getString("art");
        const name = interaction.options.getString("name");
        const reason = interaction.options.getString("reason");

        const actionData = {
          warn: {
            title: "⚠️ Ingame Player Warned",
            color: "#FEE75C",
            action: "Warned By"
          },

          kick: {
            title: "👢 Ingame Player Kicked",
            color: "#E67E22",
            action: "Kicked By"
          },

          ban: {
            title: "🔨 Ingame Player Banned",
            color: "#ED4245",
            action: "Banned By"
          }
        };

        const action = actionData[type];

        if (!action) {
          return interaction.reply({
            content: "❌ Invalid log type.",
            flags: 64
          });
        }

        const embed = new EmbedBuilder()
          .setColor(action.color)
          .setTitle(action.title)
          .addFields(
            {
              name: "User",
              value: `\`${name}\``
            },
            {
              name: "Reason",
              value: reason
            },
            {
              name: `👤 ${action.action}`,
              value: `${interaction.user} (\`${interaction.user.id}\`)`
            }
          )
          .setFooter({
            text: "State Line Roleplay • Moderation"
          })
          .setTimestamp();

        const logChannel = interaction.guild.channels.cache.get(
          MOD_LOG_CHANNEL
        );

        if (!logChannel) {
          return interaction.reply({
            content: "❌ The server log channel could not be found.",
            flags: 64
          });
        }

        await logChannel.send({
          embeds: [embed]
        });

        return interaction.reply({
          content: `✅ ${type.toUpperCase()} log created for \`${name}\`.`,
          flags: 64
        });
      }
      /*
========================================
OPEN PATCHNOTE MODAL
========================================
*/

      if (interaction.isButton() && interaction.customId === "patchnote_open") {
        const modal = new ModalBuilder()
          .setCustomId("patchnote_create")
          .setTitle("Create Patchnote");

        const titleInput = new TextInputBuilder()
          .setCustomId("patchnote_title")
          .setLabel("Patchnote Title")
          .setPlaceholder("Patchnote #BlaBla")
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMaxLength(256);

        const contentInput = new TextInputBuilder()
          .setCustomId("patchnote_content")
          .setLabel("Patchnote")
          .setPlaceholder("Write your complete patchnote here...")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(4000);

        modal.addComponents(
          new ActionRowBuilder().addComponents(titleInput),
          new ActionRowBuilder().addComponents(contentInput),
        );

        return interaction.showModal(modal);
      }
      /*
========================================
PATCHNOTE CREATE
========================================
*/

      if (
        interaction.isModalSubmit() &&
        interaction.customId === "patchnote_create"
      ) {
        const title = interaction.fields.getTextInputValue("patchnote_title");

        const content =
          interaction.fields.getTextInputValue("patchnote_content");

        const channel = await client.channels
          .fetch(PATCHNOTES_CHANNEL)
          .catch(() => null);

        if (!channel) {
          return interaction.reply({
            content: "❌ The patchnotes channel could not be found.",
            flags: 64,
          });
        }

        const embed = new EmbedBuilder()
          .setColor("#5865F2")
          .setTitle(`# ${title}`)
          .setDescription(content)
          .setFooter({
            text: `Patchnote written by ${interaction.user.username}`,
          })
          .setTimestamp();

        await channel.send({
          content: `Patchnote written by ${interaction.user}`,
          embeds: [embed],
        });

        return interaction.reply({
          content: `✅ Patchnote posted in ${channel}.`,
          flags: 64,
        });
      }

      /*
========================================
TICKET OPEN
========================================
*/

      if (
        interaction.isButton() &&
        interaction.customId.startsWith("ticket_open_")
      ) {
        const type = interaction.customId.replace("ticket_open_", "");

        const system = TICKET_SYSTEMS[type];

        if (!system) {
          return interaction.reply({
            content: "❌ This ticket system is unavailable.",
            flags: 64,
          });
        }

        await interaction.deferReply({
          flags: 64,
        });

        /*
    ========================================
    CHECK EXISTING TICKET
    ========================================
    */

        const existingTicket = interaction.guild.channels.cache.find(
          (channel) =>
            channel.type === ChannelType.GuildText &&
            channel.topic === `ticket:${type}:${interaction.user.id}`,
        );

        if (existingTicket) {
          return interaction.editReply({
            content: `❌ You already have an open ticket: ${existingTicket}`,
          });
        }

        /*
    ========================================
    CREATE TICKET
    ========================================
    */

        const ticketChannel = await interaction.guild.channels.create({
          name: `${type === "banAppeals" ? "ban-appeal" : type === "staffHelp" ? "staff-help" : "ticket"}-${interaction.user.username}`
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "")
            .slice(0, 90),

          type: ChannelType.GuildText,

          parent: system.category,

          topic: `ticket:${type}:${interaction.user.id}`,

          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: interaction.user.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.AttachFiles,
                PermissionFlagsBits.EmbedLinks,
              ],
            },
            {
              id: system.staffRole,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.AttachFiles,
                PermissionFlagsBits.EmbedLinks,
                PermissionFlagsBits.ManageMessages,
              ],
            },
          ],
        });

        /*
    ========================================
    TICKET EMBED
    ========================================
    */

        const ticketInfo = {
          tickets: {
            title: "🎫 Support Ticket",
            description:
              "Thank you for contacting State Line Roleplay support.\n\n" +
              "Please explain your issue in as much detail as possible.",
          },

          banAppeals: {
            title: "⚖️ Ban Appeal",
            description:
              "Please provide the following information:\n\n" +
              "• Why you believe the ban was unfair\n" +
              "• What happened\n" +
              "• Any relevant evidence\n\n" +
              "Please be honest and respectful.",
          },

          staffHelp: {
            title: "🛡️ Staff Help",
            description:
              "Please explain what you need assistance with.\n\n" +
              "Only the appropriate staff team can see this ticket.",
          },
        };

        const info = ticketInfo[type];

        const embed = new EmbedBuilder()
          .setColor(
            type === "banAppeals"
              ? "#ED4245"
              : type === "staffHelp"
                ? "#FEE75C"
                : "#5865F2",
          )
          .setTitle(info.title)
          .setDescription(`Hello ${interaction.user}!\n\n` + info.description)
          .setFooter({
            text: "State Line Roleplay • Tickets",
          })
          .setTimestamp();

        /*
    ========================================
    CLOSE BUTTON
    ========================================
    */

        const closeButton = new ButtonBuilder()
          .setCustomId(`ticket_close_${type}`)
          .setLabel("Close Ticket")
          .setEmoji("🔒")
          .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(closeButton);

        await ticketChannel.send({
          content: `${interaction.user} <@&${system.staffRole}>`,
          embeds: [embed],
          components: [row],
        });

        return interaction.editReply({
          content: `✅ Your ticket has been created: ${ticketChannel}`,
        });
      }
      /*
========================================
CLOSE TICKET
========================================
*/

      if (
        interaction.isButton() &&
        interaction.customId.startsWith("ticket_close_")
      ) {
        console.log(
          "TICKET CLOSE CLICKED:",
          interaction.customId,
          interaction.user.tag
        );

        /*
        ========================================
        ACKNOWLEDGE INTERACTION IMMEDIATELY
        ========================================
        */

        try {
          await interaction.deferReply({
            flags: 64,
          });
        } catch (error) {
          console.error(
            "FAILED TO DEFER TICKET CLOSE:",
            error
          );

          return;
        }

        try {
          const type = interaction.customId.replace(
            "ticket_close_",
            ""
          );

          console.log("TICKET CLOSE TYPE:", type);

          const system = TICKET_SYSTEMS[type];

          if (!system) {
            return interaction.editReply({
              content:
                "❌ This ticket system is unavailable.",
            });
          }

          /*
          ========================================
          PERMISSION CHECK
          ========================================
          */

          if (
            !interaction.member.roles.cache.has(
              system.staffRole
            )
          ) {
            return interaction.editReply({
              content:
                "❌ Only ticket staff can close this ticket.",
            });
          }

          console.log("TICKET CLOSE: Permission OK");

          const ticketChannel = interaction.channel;

          /*
          ========================================
          FIND CREATOR
          ========================================
          */

          let creator = null;

          if (ticketChannel.topic) {
            const match = ticketChannel.topic.match(
              /^ticket:[^:]+:(\d+)$/
            );

            if (match) {
              creator = await client.users
                .fetch(match[1])
                .catch(() => null);
            }
          }

          console.log(
            "TICKET CLOSE: Creator:",
            creator?.tag || "Unknown"
          );

          /*
          ========================================
          CREATE TRANSCRIPT
          ========================================
          */

          console.log(
            "TICKET CLOSE: Creating transcript..."
          );

          const transcript =
            await createTicketTranscript(
              ticketChannel,
              {
                ticketType: system.name,
                creator,
                closedBy: interaction.user,
              }
            );

          console.log(
            "TICKET CLOSE: Transcript created"
          );

          /*
          ========================================
          TRANSCRIPT CHANNEL
          ========================================
          */

          const transcriptChannel =
            await client.channels
              .fetch(TICKET_TRANSCRIPT_CHANNEL)
              .catch(() => null);

          if (!transcriptChannel) {
            return interaction.editReply({
              content:
                "❌ Transcript channel could not be found. The ticket was NOT deleted.",
            });
          }

          console.log(
            "TICKET CLOSE: Transcript channel found"
          );

          /*
          ========================================
          SEND TRANSCRIPT
          ========================================
          */

          const transcriptEmbed =
            new EmbedBuilder()
              .setColor("#5865F2")
              .setTitle("🔒 Ticket Closed")
              .addFields(
                {
                  name: "Ticket",
                  value: `\`${ticketChannel.name}\``,
                  inline: true,
                },
                {
                  name: "Type",
                  value: system.name,
                  inline: true,
                },
                {
                  name: "Created By",
                  value: creator
                    ? `<@${creator.id}>`
                    : "Unknown",
                  inline: true,
                },
                {
                  name: "Closed By",
                  value: `<@${interaction.user.id}>`,
                  inline: true,
                }
              )
              .setTimestamp();

          await transcriptChannel.send({
            embeds: [transcriptEmbed],
            files: [
              {
                attachment: transcript,
                name: `${ticketChannel.name}.pdf`,
              },
            ],
          });

          console.log(
            "TICKET CLOSE: Transcript sent"
          );

          /*
          ========================================
          DELETE TICKET
          ========================================
          */

          await interaction.editReply({
            content:
              "🔒 Ticket closed and transcript archived.",
          });

          console.log(
            "TICKET CLOSE: Deleting channel..."
          );

          await ticketChannel.delete(
            "Ticket closed and transcript archived."
          );

        } catch (error) {
          console.error(
            "TICKET CLOSE ERROR:",
            error
          );

          try {
            await interaction.editReply({
              content:
                "❌ Something went wrong while closing this ticket. The ticket was NOT deleted.",
            });
          } catch (replyError) {
            console.error(
              "FAILED TO EDIT CLOSE REPLY:",
              replyError
            );
          }
        }

      }
      /*
========================================
CONTINUE APPLICATION
========================================
*/

      if (
        interaction.isButton() &&
        interaction.customId.startsWith("application_continue_")
      ) {
        const userId = interaction.customId.replace(
          "application_continue_",
          "",
        );

        if (interaction.user.id !== userId) {
          return interaction.reply({
            content: "❌ This is not your application.",
            flags: 64,
          });
        }

        const state = activeApplications.get(userId);

        if (!state) {
          return interaction.reply({
            content:
              "❌ Your application session could not be found.\n\n" +
              "Please use `!continueapplication` again.",
            flags: 64,
          });
        }

        return showQuestion(interaction, userId);
      }

      /*
            ========================================
            APPLICATION DEPARTMENT BUTTON
            ========================================
            */

      if (
        interaction.isButton() &&
        interaction.customId.startsWith("application_") &&
        !interaction.customId.startsWith("application_answer_") &&
        !interaction.customId.startsWith("application_review_") &&
        !interaction.customId.startsWith("application_accept_") &&
        !interaction.customId.startsWith("application_deny_")
      ) {
        const type = interaction.customId.replace("application_", "");

        const application = applications[type];

        if (!application) {
          return interaction.reply({
            content: "❌ This application is currently unavailable.",
            flags: 64,
          });
        }

        if (!application.information || !application.questions) {
          return interaction.reply({
            content: "❌ This application is currently unavailable.",
            flags: 64,
          });
        }

        if (activeApplications.has(interaction.user.id)) {
          return interaction.reply({
            content:
              "❌ You already have an application in progress. Please finish it first.",
            flags: 64,
          });
        }

        /*
                CREATE APPLICATION SESSION
                */

        activeApplications.set(interaction.user.id, {
          type,
          answers: {},
          currentIndex: 0,
        });
        saveApplicationSessions();
        /*
                SHOW FIRST QUESTION
                */

        return showQuestion(interaction, interaction.user.id);
      }

      /*
            ========================================
            ANSWER QUESTION BUTTON
            ========================================
            */
      if (
        interaction.isButton() &&
        interaction.customId.startsWith("application_answer_")
      ) {
        const parts = interaction.customId.split("_");

        const userId = parts[2];
        const index = parseInt(parts[3]);

        if (interaction.user.id !== userId) {
          return interaction.reply({
            content: "❌ This is not your application.",
            flags: 64,
          });
        }

        const state = activeApplications.get(userId);

        if (!state) {
          return interaction.reply({
            content:
              "❌ Your application session has expired. Please start again with `!apply`.",
            flags: 64,
          });
        }

        const application = applications[state.type];

        if (!application) {
          return interaction.reply({
            content: "❌ This application is currently unavailable.",
            flags: 64,
          });
        }

        const fields = getAllFields(application);
        const field = fields[index];

        if (!field) {
          return interaction.reply({
            content: "❌ This question could not be found.",
            flags: 64,
          });
        }

        const modal = new ModalBuilder()
          .setCustomId(`application_answer_${userId}_${index}`)
          .setTitle(`Question ${index + 1}`);

        const input = new TextInputBuilder()
          .setCustomId("answer")
          .setLabel(field.label || `Question ${index + 1}`)
          .setPlaceholder("Write your answer here...")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(4000);

        modal.addComponents(new ActionRowBuilder().addComponents(input));

        return interaction.showModal(modal);
      }

      /*
========================================
APPLICATION REVIEW BUTTON
========================================
*/

      if (
        interaction.isButton() &&
        interaction.customId.startsWith("application_review_")
      ) {
        const applicantId = interaction.customId.replace(
          "application_review_",
          "",
        );

        const applicationMessage = interaction.message;

        let applicationName = "Application";

        if (applicationMessage?.embeds?.length) {
          const title = applicationMessage.embeds[0].title;

          if (title) {
            applicationName = title
              .replace("📋", "")
              .replace("🚓", "")
              .replace("🔥", "")
              .replace("🚑", "")
              .replace("🚧", "")
              .replace("New ", "")
              .replace(" Application", "")
              .trim();
          }
        }

        const modal = new ModalBuilder()
          .setCustomId(`application_review_submit_${applicantId}`)
          .setTitle("Application Review");

        const scoreInput = new TextInputBuilder()
          .setCustomId("review_score")
          .setLabel("Application Score (0-100)")
          .setPlaceholder("Example: 87")
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMinLength(1)
          .setMaxLength(3);

        const announcementInput = new TextInputBuilder()
          .setCustomId("announcement_text")
          .setLabel("Announcement Text")
          .setPlaceholder("Write the public announcement...")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(1000);

        const applicantMessageInput = new TextInputBuilder()
          .setCustomId("message_to_applicant")
          .setLabel("Message to Applicant")
          .setPlaceholder("Write the private message for the applicant...")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(1000);

        modal.addComponents(
          new ActionRowBuilder().addComponents(scoreInput),
          new ActionRowBuilder().addComponents(announcementInput),
          new ActionRowBuilder().addComponents(applicantMessageInput),
        );

        pendingReviews.set(applicantId, {
          applicationName,
          reviewerId: interaction.user.id,
        });

        return interaction.showModal(modal);
      }

      /*
            ========================================
            ANSWER MODAL SUBMISSION
            ========================================
            */

      if (
        interaction.isModalSubmit() &&
        interaction.customId.startsWith("application_answer_")
      ) {
        const parts = interaction.customId.split("_");

        const userId = parts[2];

        const index = parseInt(parts[3]);

        if (interaction.user.id !== userId) {
          return interaction.reply({
            content: "❌ This is not your application.",
            flags: 64,
          });
        }

        const state = activeApplications.get(userId);

        if (!state) {
          return interaction.reply({
            content:
              "❌ Your application session has expired. Please start again with `!apply`.",
            flags: 64,
          });
        }

        const application = applications[state.type];

        const fields = getAllFields(application);

        const field = fields[index];

        if (!field) {
          return interaction.reply({
            content: "❌ This question could not be found.",
            flags: 64,
          });
        }

        /*
                SAVE ANSWER
                */

        const answer = interaction.fields.getTextInputValue("answer");

        state.answers[field.id] = answer;

        state.currentIndex = index + 1;

        saveApplicationSessions();

        /*
========================================
APPLICATION FINISHED
========================================
*/

        if (state.currentIndex >= fields.length) {
          try {
            await interaction.reply({
              content:
                "⏳ **Submitting your application...**\n\n" +
                "Please wait a moment.",
              flags: 64,
            });

            await submitApplication(client, interaction, state, application);

            activeApplications.delete(userId);
            saveApplicationSessions();

            return interaction.editReply({
              content:
                "✅ **Application submitted successfully!**\n\n" +
                "Your application has been sent to SLRP Leadership for review.\n\n" +
                "You will receive a direct message when there is an update regarding your application.",
            });
          } catch (error) {
            console.error("APPLICATION SUBMISSION ERROR:", error);

            activeApplications.delete(userId);
            saveApplicationSessions();

            if (interaction.replied || interaction.deferred) {
              return interaction
                .editReply({
                  content:
                    "❌ **There was an error submitting your application.**\n\n" +
                    "Please contact a member of SLRP Leadership and let them know what happened.",
                })
                .catch(() => { });
            }

            return interaction
              .reply({
                content:
                  "❌ **There was an error submitting your application.**\n\n" +
                  "Please contact a member of SLRP Leadership and let them know what happened.",
                flags: 64,
              })
              .catch(() => { });
          }
        }

        /*
========================================
SHOW NEXT QUESTION
========================================
*/

        return showQuestion(interaction, userId);
      }
      /*
========================================
REVIEW MODAL SUBMISSION
========================================
*/

      if (
        interaction.isModalSubmit() &&
        interaction.customId.startsWith("application_review_submit_")
      ) {
        const applicantId = interaction.customId.replace(
          "application_review_submit_",
          "",
        );

        const score = interaction.fields
          .getTextInputValue("review_score")
          .trim();

        const announcementText = interaction.fields
          .getTextInputValue("announcement_text")
          .trim();

        const messageToApplicant = interaction.fields
          .getTextInputValue("message_to_applicant")
          .trim();

        const scoreNumber = Number(score);

        /*
  ========================================
  VALIDATE SCORE
  ========================================
  */

        if (
          !Number.isInteger(scoreNumber) ||
          scoreNumber < 0 ||
          scoreNumber > 100
        ) {
          return interaction.reply({
            content:
              "❌ The application score must be a whole number between **0 and 100**.",
            flags: 64,
          });
        }

        /*
  ========================================
  GET APPLICATION INFORMATION
  ========================================
  */

        const applicationMessage = interaction.message;

        let applicationName = "Application";

        const pendingReview = pendingReviews.get(applicantId);

        if (pendingReview?.applicationName) {
          applicationName = pendingReview.applicationName;
        }

        /*
  ========================================
  SAVE REVIEW
  ========================================
  */

        pendingReviews.set(applicantId, {
          applicationName,
          reviewerId: interaction.user.id,
          score: scoreNumber,
          announcementText,
          messageToApplicant,
        });

        /*
  ========================================
  FIND RESULTS CHANNEL
  ========================================
  */

        const resultsChannel = await client.channels
          .fetch(APPLICATION_RESULTS_CHANNEL)
          .catch(() => null);

        if (!resultsChannel) {
          return interaction.reply({
            content: "❌ The application results channel could not be found.",
            flags: 64,
          });
        }

        /*
  ========================================
  FIND APPLICATION MESSAGE
  ========================================
  */

        let targetMessage = null;

        try {
          const messages = await resultsChannel.messages.fetch({
            limit: 100,
          });

          targetMessage = messages.find((message) =>
            message.components?.some((row) =>
              row.components?.some(
                (button) =>
                  button.customId === `application_review_${applicantId}` ||
                  button.customId === `application_accept_${applicantId}` ||
                  button.customId === `application_deny_${applicantId}`,
              ),
            ),
          );
        } catch (error) {
          console.error("ERROR FINDING APPLICATION MESSAGE:", error);
        }

        /*
  ========================================
  UPDATE RESULTS EMBED
  ========================================
  */

        if (targetMessage) {
          const originalEmbed = targetMessage.embeds[0];

          if (originalEmbed) {
            const updatedEmbed = EmbedBuilder.from(originalEmbed)
              .addFields(
                {
                  name: "📊 Application Score",
                  value: `**${scoreNumber}/100**`,
                  inline: true,
                },
                {
                  name: "👤 Reviewer",
                  value: `${interaction.user}`,
                  inline: true,
                },
                {
                  name: "📋 Status",
                  value: "📝 **UNDER REVIEW**",
                  inline: true,
                },
                {
                  name: "📢 Announcement Text",
                  value: truncate(announcementText, 1000),
                },
                {
                  name: "💬 Message to Applicant",
                  value: truncate(messageToApplicant, 1000),
                },
              )
              .setTimestamp();

            await targetMessage.edit({
              embeds: [updatedEmbed],
            });
          }
        }

        /*
  ========================================
  REVIEW SAVED
  ========================================
  */

        return interaction.reply({
          content:
            "📝 **Application review saved successfully.**\n\n" +
            `**Score:** ${scoreNumber}/100\n` +
            `**Reviewer:** ${interaction.user}\n\n` +
            "You can now use **Accept** or **Deny**.",
          flags: 64,
        });
      }

      /*
========================================
ACCEPT / DENY
========================================
*/

      if (
        interaction.isButton() &&
        (interaction.customId.startsWith("application_accept_") ||
          interaction.customId.startsWith("application_deny_"))
      ) {
        await interaction.deferReply({
          flags: 64,
        });
        const isAccepted = interaction.customId.startsWith(
          "application_accept_",
        );

        const applicantId = interaction.customId.replace(
          isAccepted ? "application_accept_" : "application_deny_",
          "",
        );

        /*
  ========================================
  GET REVIEW
  ========================================
  */

        const review = pendingReviews.get(applicantId);

        if (!review) {
          return interaction.editReply({
            content:
              "❌ This application has not been reviewed yet.\n\n" +
              "Please click **Review Application** first.",
          });
        }

        /*
  ========================================
  GET APPLICANT
  ========================================
  */

        const applicant = await client.users
          .fetch(applicantId)
          .catch(() => null);

        if (!applicant) {
          return interaction.editReply({
            content: "❌ The applicant could not be found.",
          });
        }

        /*
  ========================================
  SEND ANNOUNCEMENT
  ========================================
  */

        let announcementSent = true;

        try {
          const announceChannel = await client.channels
            .fetch(APPLICATION_ANNOUNCE_CHANNEL)
            .catch(() => null);

          if (!announceChannel) {
            throw new Error("APPLICATION_ANNOUNCE_CHANNEL could not be found.");
          }

          const announcementEmbed = new EmbedBuilder()
            .setColor(isAccepted ? "#57F287" : "#ED4245")
            .setTitle(
              isAccepted ? "🎉 Application Accepted" : "❌ Application Denied",
            )
            .setDescription(`**${review.applicationName} Application**`)
            .addFields(
              {
                name: "Applicant",
                value: `${applicant}`,
                inline: true,
              },
              {
                name: "Score",
                value: `${review.score}/100`,
                inline: true,
              },
              {
                name: "Result",
                value: isAccepted ? "✅ **ACCEPTED**" : "❌ **DENIED**",
                inline: true,
              },
              {
                name: "Announcement",
                value: truncate(review.announcementText, 1000),
              },
              {
                name: "Reviewed By",
                value: `${interaction.user}`,
              },
            )
            .setFooter({
              text: "State Line Roleplay • Applications",
            })
            .setTimestamp();

          await announceChannel.send({
            embeds: [announcementEmbed],
          });
        } catch (error) {
          announcementSent = false;

          console.error("ANNOUNCEMENT ERROR:", error);
        }

        /*
  ========================================
  SEND APPLICANT DM
  ========================================
  */

        let dmSent = true;

        try {
          await applicant.send(
            "📋 **You received a new message regarding your application.**\n\n" +
            `**${review.applicationName} Application**\n\n` +
            `**Result:** ${isAccepted ? "✅ ACCEPTED" : "❌ DENIED"}\n` +
            `**Score:** ${review.score}/100\n\n` +
            `${review.messageToApplicant}\n\n` +
            "━━━━━━━━━━━━━━━━━━━━━━\n" +
            "State Line Roleplay",
          );
        } catch (error) {
          dmSent = false;

          console.error("APPLICANT DM ERROR:", error);
        }

        /*
  ========================================
  UPDATE RESULTS MESSAGE
  ========================================
  */

        let targetMessage = null;

        try {
          const resultsChannel = await client.channels
            .fetch(APPLICATION_RESULTS_CHANNEL)
            .catch(() => null);

          if (resultsChannel) {
            const messages = await resultsChannel.messages.fetch({
              limit: 100,
            });

            targetMessage = messages.find((message) =>
              message.components?.some((row) =>
                row.components?.some(
                  (button) =>
                    button.customId === `application_review_${applicantId}` ||
                    button.customId === `application_accept_${applicantId}` ||
                    button.customId === `application_deny_${applicantId}`,
                ),
              ),
            );

            if (targetMessage) {
              const originalEmbed = targetMessage.embeds[0];

              if (originalEmbed) {
                const updatedEmbed = EmbedBuilder.from(originalEmbed)
                  .setColor(isAccepted ? "#57F287" : "#ED4245")
                  .addFields(
                    {
                      name: "📊 Application Score",
                      value: `**${review.score}/100**`,
                      inline: true,
                    },
                    {
                      name: "👤 Reviewer",
                      value: `${interaction.user}`,
                      inline: true,
                    },
                    {
                      name: "📋 Final Result",
                      value: isAccepted ? "✅ **ACCEPTED**" : "❌ **DENIED**",
                      inline: true,
                    },
                    {
                      name: "📢 Announcement",
                      value: truncate(review.announcementText, 1000),
                    },
                    {
                      name: "💬 Message to Applicant",
                      value: truncate(review.messageToApplicant, 1000),
                    },
                  )
                  .setTimestamp();

                const disabledRow = new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setCustomId(`application_review_${applicantId}`)
                    .setLabel("Reviewed")
                    .setEmoji("📝")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),

                  new ButtonBuilder()
                    .setCustomId(`application_accept_${applicantId}`)
                    .setLabel(isAccepted ? "Accepted" : "Accept")
                    .setEmoji("✅")
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),

                  new ButtonBuilder()
                    .setCustomId(`application_deny_${applicantId}`)
                    .setLabel(isAccepted ? "Deny" : "Denied")
                    .setEmoji("❌")
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true),
                );

                await targetMessage.edit({
                  embeds: [updatedEmbed],
                  components: [disabledRow],
                });
              }
            }
          }
        } catch (error) {
          console.error("RESULT UPDATE ERROR:", error);
        }

        /*
  ========================================
  CLEANUP
  ========================================
  */

        pendingReviews.delete(applicantId);

        let resultMessage = isAccepted
          ? "✅ **Application accepted successfully.**"
          : "❌ **Application denied successfully.**";

        if (!announcementSent) {
          resultMessage += "\n⚠️ The announcement could not be sent.";
        }

        if (!dmSent) {
          resultMessage += "\n⚠️ The applicant could not be DM'd.";
        }

        if (interaction.deferred || interaction.replied) {
          return interaction.editReply({
            content: resultMessage,
          });
        }

        return interaction.reply({
          content: resultMessage,
          flags: 64,
        });
      }

      /*
    ========================================
    AUTOMOD REVIEW
    ========================================
    */

      if (
        interaction.isButton() &&
        (interaction.customId.startsWith("automod_ban_") ||
          interaction.customId.startsWith("automod_release_"))
      ) {
        const isBan = interaction.customId.startsWith("automod_ban_");

        const prefix = isBan ? "automod_ban_" : "automod_release_";

        const data = interaction.customId.replace(prefix, "");

        const parts = data.split("_");

        const applicantId = parts[0];

        const member = await interaction.guild.members
          .fetch(applicantId)
          .catch(() => null);

        if (!member) {
          return interaction.reply({
            content: "❌ User could not be found.",
            flags: 64,
          });
        }

        /*
        ========================================
        BAN
        ========================================
        */

        if (isBan) {
          if (!member.bannable) {
            return interaction.reply({
              content:
                "❌ I cannot ban this user. Check my role position and permissions.",
              flags: 64,
            });
          }

          try {
            await member.ban({
              reason: `AutoMod review approved by ${interaction.user.tag}`,
            });
          } catch (error) {
            console.error("AUTOMOD BAN ERROR:", error);

            return interaction.reply({
              content: "❌ Failed to ban the user.",
              flags: 64,
            });
          }

          await interaction.update({
            content: `🔨 **User banned**\nReviewed by ${interaction.user}`,
            embeds: interaction.message.embeds,
            components: [],
          });

          return;
        }

        /*
        ========================================
        RELEASE TIMEOUT
        ========================================
        */

        try {
          await member.timeout(
            null,
            `AutoMod review dismissed by ${interaction.user.tag}`,
          );
        } catch (error) {
          console.error("AUTOMOD RELEASE ERROR:", error);

          return interaction.reply({
            content: "❌ Failed to remove the timeout.",
            flags: 64,
          });
        }

        await interaction.update({
          content: `🔓 **Timeout released**\nReviewed by ${interaction.user}`,
          embeds: interaction.message.embeds,
          components: [],
        });

        return;
      }
    } catch (error) {
      console.error("INTERACTION ERROR:", error);

      if (!interaction.replied && !interaction.deferred) {
        await interaction
          .reply({
            content:
              "❌ An unexpected error occurred while processing this interaction.",
            flags: 64,
          })
          .catch(() => { });
      }
    }
  });
};

module.exports.activeApplications = activeApplications;

/*
========================================
GET ALL APPLICATION FIELDS
========================================
*/

function getAllFields(application) {
  return [...(application.information || []), ...(application.questions || [])];
}

/*
========================================
SHOW QUESTION
========================================
*/

async function showQuestion(interaction, userId) {
  const state = activeApplications.get(userId);

  if (!state) {
    return;
  }

  const application = applications[state.type];

  const fields = getAllFields(application);

  const index = state.currentIndex;

  const field = fields[index];

  if (!field) {
    return;
  }

  /*
    HOW MANY QUESTIONS?
    */

  const total = fields.length;

  const current = index + 1;

  /*
    FULL QUESTION
    */

  const questionText = field.question || field.placeholder || field.label;

  /*
    QUESTION EMBED
    */

  const embed = new EmbedBuilder()
    .setColor(application.color)
    .setTitle(`${application.emoji} ${application.name}`)
    .setDescription(`### ${field.label}\n\n` + questionText)
    .addFields({
      name: "Progress",
      value: `Question **${current}** of **${total}**`,
    })
    .setFooter({
      text: "State Line Roleplay • Applications",
    });

  /*
    ANSWER BUTTON
    */

  const button = new ButtonBuilder()
    .setCustomId(`application_answer_${userId}_${index}`)
    .setLabel("Answer Question")
    .setEmoji("✏️")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(button);

  /*
    FIRST QUESTION
    */

  if (!interaction.deferred && !interaction.replied) {
    return interaction.reply({
      embeds: [embed],
      components: [row],
      flags: 64,
    });
  }

  /*
    NEXT QUESTION
    */

  if (interaction.deferred) {
    return interaction.editReply({
      embeds: [embed],
      components: [row],
    });
  }

  return interaction.update({
    embeds: [embed],
    components: [row],
  });
}

/*
========================================
SUBMIT APPLICATION
========================================
*/

async function submitApplication(client, interaction, state, application) {
  const channel = await client.channels
    .fetch(APPLICATION_RESULTS_CHANNEL)
    .catch(() => null);

  if (!channel) {
    throw new Error("APPLICATION_RESULTS_CHANNEL could not be found.");
  }

  const answers = state.answers;

  /*
  ========================================
  APPLICANT INFORMATION
  ========================================
  */

  const infoEmbeds = [];

  let currentInfoEmbed = new EmbedBuilder()
    .setColor(application.color)
    .setTitle(`${application.emoji} New ${application.name} Application`)
    .setDescription(
      `A new application has been submitted by ${interaction.user}.\n\n` +
      `👤 **Applicant Information**`,
    )
    .setThumbnail(
      interaction.user.displayAvatarURL({
        size: 256,
      }),
    )
    .setTimestamp();

  let infoSize = 0;
  let infoFieldCount = 0;

  for (const field of application.information || []) {
    const value = truncate(answers[field.id] || "No answer provided", 900);

    const fieldSize = field.label.length + value.length;

    if (infoSize + fieldSize > 4500 || infoFieldCount >= 5) {
      infoEmbeds.push(currentInfoEmbed);

      currentInfoEmbed = new EmbedBuilder()
        .setColor(application.color)
        .setTitle(`${application.emoji} Applicant Information`)
        .setFooter({
          text: "State Line Roleplay • Applications",
        })
        .setTimestamp();

      infoSize = 0;
      infoFieldCount = 0;
    }

    currentInfoEmbed.addFields({
      name: truncate(field.label, 200),
      value,
      inline: false,
    });

    infoSize += fieldSize;
    infoFieldCount++;
  }

  if (infoFieldCount > 0) {
    infoEmbeds.push(currentInfoEmbed);
  }

  /*
  ========================================
  APPLICATION QUESTIONS
  ========================================
  */

  const answerEmbeds = [];

  let currentEmbed = new EmbedBuilder()
    .setColor(application.color)
    .setTitle(`${application.emoji} ${application.name} Application Questions`)
    .setFooter({
      text: "State Line Roleplay • Applications",
    })
    .setTimestamp();

  let currentSize = 0;
  let fieldCount = 0;

  for (let i = 0; i < application.questions.length; i++) {
    const question = application.questions[i];

    const answer = answers[question.id] || "No answer provided";

    const questionTitle = question.label || `Question ${i + 1}`;

    const fullQuestion =
      question.question || question.label || "Unknown Question";

    /*
    ========================================
    QUESTION + ANSWER
    ========================================
    */

    const questionText =
      `**${truncate(fullQuestion, 450)}**\n\n` +
      `**Answer:**\n` +
      truncate(answer, 450);

    const fieldName = `Question ${i + 1}\n` + truncate(questionTitle, 180);

    const fieldSize = fieldName.length + questionText.length;

    /*
    ========================================
    EMBED LIMIT
    ========================================
    */

    if (currentSize + fieldSize > 4500 || fieldCount >= 5) {
      answerEmbeds.push(currentEmbed);

      currentEmbed = new EmbedBuilder()
        .setColor(application.color)
        .setTitle(
          `${application.emoji} ${application.name} Application Questions`,
        )
        .setFooter({
          text: "State Line Roleplay • Applications",
        })
        .setTimestamp();

      currentSize = 0;
      fieldCount = 0;
    }

    currentEmbed.addFields({
      name: fieldName,
      value: questionText,
      inline: false,
    });

    currentSize += fieldSize;
    fieldCount++;
  }

  if (fieldCount > 0) {
    answerEmbeds.push(currentEmbed);
  }

  /*
  ========================================
  REVIEW BUTTONS
  ========================================
  */

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`application_review_${interaction.user.id}`)
      .setLabel("Review Application")
      .setEmoji("📝")
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId(`application_accept_${interaction.user.id}`)
      .setLabel("Accept")
      .setEmoji("✅")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId(`application_deny_${interaction.user.id}`)
      .setLabel("Deny")
      .setEmoji("❌")
      .setStyle(ButtonStyle.Danger),
  );

  /*
  ========================================
  SEND APPLICANT INFORMATION
  ========================================
  */

  for (const embed of infoEmbeds) {
    await channel.send({
      embeds: [embed],
    });
  }

  /*
  ========================================
  SEND QUESTIONS + ANSWERS
  ========================================
  */

  for (let i = 0; i < answerEmbeds.length; i++) {
    const isLast = i === answerEmbeds.length - 1;

    await channel.send({
      embeds: [answerEmbeds[i]],
      components: isLast ? [row] : [],
    });
  }
}

/*
========================================
TRUNCATE
========================================
*/

function truncate(text, maxLength = 1024) {
  if (!text) {
    return "No answer provided";
  }

  text = String(text);

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - 3) + "...";
}
