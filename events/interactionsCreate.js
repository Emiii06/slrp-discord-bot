const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const applications = require("../commands/applicationData");

const {
  APPLICATION_RESULTS_CHANNEL,
  APPLICATION_ANNOUNCE_CHANNEL,
} = require("../config");

const activeApplications = new Map();
const pendingReviews = new Map();

const applicationSessionsPath = path.join(
  __dirname,
  "../data/applicationSessions.json"
);

function loadApplicationSessions() {
  try {
    if (!fs.existsSync(applicationSessionsPath)) {
      fs.writeFileSync(applicationSessionsPath, "{}");
    }

    const data = JSON.parse(
      fs.readFileSync(applicationSessionsPath, "utf8")
    );

    for (const [userId, state] of Object.entries(data)) {
      activeApplications.set(userId, state);
    }

    console.log(
      `Loaded ${activeApplications.size} active application session(s).`
    );
  } catch (error) {
    console.error("APPLICATION SESSION LOAD ERROR:", error);
  }
}

function saveApplicationSessions() {
  try {
    const data = Object.fromEntries(activeApplications);

    fs.writeFileSync(
      applicationSessionsPath,
      JSON.stringify(data, null, 2)
    );
  } catch (error) {
    console.error("APPLICATION SESSION SAVE ERROR:", error);
  }
}

loadApplicationSessions();

module.exports = (client) => {
  console.log("INTERACTION CREATE HANDLER REGISTERED");

  client.on("interactionCreate", async (interaction) => {
    try {
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
                .catch(() => {});
            }

            return interaction
              .reply({
                content:
                  "❌ **There was an error submitting your application.**\n\n" +
                  "Please contact a member of SLRP Leadership and let them know what happened.",
                flags: 64,
              })
              .catch(() => {});
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
          return interaction.reply({
            content:
              "❌ This application has not been reviewed yet.\n\n" +
              "Please click **Review Application** first.",
            flags: 64,
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
          return interaction.reply({
            content: "❌ The applicant could not be found.",
            flags: 64,
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

        return interaction.reply({
          content: resultMessage,
          flags: 64,
        });
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
          .catch(() => {});
      }
    }
  });
};

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
      `👤 **Applicant Information**`
    )
    .setThumbnail(
      interaction.user.displayAvatarURL({
        size: 256,
      })
    )
    .setTimestamp();

  let infoSize = 0;
  let infoFieldCount = 0;

  for (const field of application.information || []) {
    const value = truncate(
      answers[field.id] || "No answer provided",
      900
    );

    const fieldSize = field.label.length + value.length;

    if (
      infoSize + fieldSize > 4500 ||
      infoFieldCount >= 5
    ) {
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
    .setTitle(
      `${application.emoji} ${application.name} Application Questions`
    )
    .setFooter({
      text: "State Line Roleplay • Applications",
    })
    .setTimestamp();

  let currentSize = 0;
  let fieldCount = 0;

  for (let i = 0; i < application.questions.length; i++) {
    const question = application.questions[i];

    const answer =
      answers[question.id] ||
      "No answer provided";

    const questionTitle =
      question.label ||
      `Question ${i + 1}`;

    const fullQuestion =
      question.question ||
      question.label ||
      "Unknown Question";

    /*
    ========================================
    QUESTION + ANSWER
    ========================================
    */

    const questionText =
      `**${truncate(fullQuestion, 450)}**\n\n` +
      `**Answer:**\n` +
      truncate(answer, 450);

    const fieldName =
      `Question ${i + 1}\n` +
      truncate(questionTitle, 180);

    const fieldSize =
      fieldName.length +
      questionText.length;

    /*
    ========================================
    EMBED LIMIT
    ========================================
    */

    if (
      currentSize + fieldSize > 4500 ||
      fieldCount >= 5
    ) {
      answerEmbeds.push(currentEmbed);

      currentEmbed = new EmbedBuilder()
        .setColor(application.color)
        .setTitle(
          `${application.emoji} ${application.name} Application Questions`
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
      .setCustomId(
        `application_review_${interaction.user.id}`
      )
      .setLabel("Review Application")
      .setEmoji("📝")
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId(
        `application_accept_${interaction.user.id}`
      )
      .setLabel("Accept")
      .setEmoji("✅")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId(
        `application_deny_${interaction.user.id}`
      )
      .setLabel("Deny")
      .setEmoji("❌")
      .setStyle(ButtonStyle.Danger)
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
    const isLast =
      i === answerEmbeds.length - 1;

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
