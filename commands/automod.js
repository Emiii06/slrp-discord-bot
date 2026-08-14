const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const {
  AUTOMOD_REVIEW_CHANNEL,
  AUTOMOD_TIMEOUT_DURATION,
  AUTOMOD_REVIEW_ROLE,
  AUTOMOD_IGNORED_ROLES
} = require("../config");

/*
========================================
AUTOMOD TERMS
========================================
*/

const BANNABLE_TERMS = [
  "send me a pic",
  "send me a private pic",
  "send me a picture",
  "send me a private picture",
  "send me a photo",
  "send me a private photo",
  "send me something private",
  "can i see you naked",
  "show me your body",
  "show me your tits",
  "show me your ass",
  "send me nudes",
  "send me nude pics",
  "send me naked pics",
  "send me explicit pics",
  "send me nsfw",
  "send me a nude",
  "send me a private pic of you",
  "can you send me a nude",
  "can you send nudes",
  "send me a sexy picture",
  "send me a sexy pic",
  "are you naked",
  "what are you wearing",
  "take your clothes off",
  "show me what you're wearing",
  "how old are you",
  "how old r u",
  "what's your age",
  "are you under 18",
  "are you a minor",
  "how old were you when",
  "you're mature for your age",
  "you're mature for your age ;)",
  "you're mature for your age haha",
  "you're so mature for your age",
  "don't tell anyone",
  "don't tell your parents",
  "keep this between us",
  "this stays between us",
  "no one needs to know",
  "this is our secret",
  "it's just between you and me",
  "you can trust me",
  "prove you trust me",
  "i can teach you things",
  "let me teach you",
  "i'll teach you",
  "join vc alone",
  "come to vc alone",
  "come to private vc",
  "join my private vc",
  "come into private call",
  "don't talk to anyone about this",
  "don't tell anyone about this",
  "don't talk to others about this",
  "dm me privately",
  "dm me",
  "message me privately",
  "send nudes",
  "send nude",
  "send me nudes",
  "send me a nude",
  "send nude pics",
  "send naked pics",
  "send explicit pics",
  "send explicit pictures",
  "send explicit content",
  "send nsfw",
  "send me nsfw",
  "send nsfw pics",
  "show me your body",
  "show me your naked body",
  "show me your tits",
  "show me your boobs",
  "show me your ass",
  "show me your pussy",
  "show me your dick",
  "show me your cock",
  "show me your breasts",
  "describe your body",
  "describe your tits",
  "describe your boobs",
  "describe your ass",
  "describe your pussy",
  "describe your dick",
  "describe your cock",
  "describe the sexual act",
  "describe what you would do",
  "tell me your sexual fantasy",
  "tell me your fantasies",
  "what's your fantasy",
  "what would you do to me",
  "what would you do if we were alone",
  "let's have sex",
  "do you want to have sex",
  "i want to have sex with you",
  "you owe me",
  "you owe me a picture",
  "you owe me a pic",
  "you owe me nudes",
  "prove you trust me",
  "prove that you trust me",
  "if you trust me you'll send it",
  "if you trusted me you'd send it",
  "i'll stop talking to you if you don't",
  "i won't talk to you anymore if you don't",
  "you'll regret it if you don't",
  "don't tell anyone",
  "don't tell anybody",
  "keep this a secret",
  "keep this between us",
  "this is our secret",
  "no one has to know",
  "your parents don't need to know",
  "you don't need to tell anyone",
  "delete our messages",
  "delete this conversation",
  "don't show anyone this",
  "don't let anyone see this",
  "send me your address",
  "send your address",
  "what's your address",
  "where do you live",
  "where do you live at",
  "send me your location",
  "send your location",
  "what's your location",
  "tell me your location",
  "drop your location",
  "send me your school",
  "what school do you go to",
  "where do you go to school",
  "what's your school",
  "send me your phone number",
  "give me your phone number",
  "what's your phone number",
  "drop your number",
  "send me your real name",
  "what's your real name",
  "tell me your real name",
  "what is your real name",
  "send me your personal information",
  "send me your private information",
  "i know where you live",
  "i know your address",
  "i know where you go to school",
  "i'll leak your information",
  "i will leak your information",
  "i'll dox you",
  "i will dox you",
  "i'm going to dox you",
  "i will hurt you",
  "i'm going to hurt you",
  "i'll hurt you",
  "i will attack you",
  "i'm going to attack you",
  "i'll attack you",
  "i will find you",
  "i'm going to find you",
  "i'll find you",
  "you should hurt yourself",
  "go hurt yourself",
  "hurt yourself",
  "you should kill yourself",
  "go kill yourself",
  "kill yourself",
  "you should die",
  "just die",
  "nobody cares about you",
  "no one cares about you",
  "you are worthless",
  "you should disappear",
  "nigga"
];

const MUTEABLE_TERMS = [
  "hey baby",
  "hey babe",
  "hi baby",
  "hi babe",
  "hey cutie",
  "hi cutie",
  "hey beautiful",
  "hi beautiful",
  "hey handsome",
  "hi handsome",
  "i like you",
  "i really like you",
  "i kinda like you",
  "i have a crush on you",
  "i'm into you",
  "you're mine",
  "you're all mine",
  "you belong to me",
  "be mine",
  "you should date me",
  "would you date me",
  "date me",
  "go out with me",
  "i want to be with you",
  "i wanna be with you",
  "i want you to be mine",
  "i want you as my girlfriend",
  "i want you as my boyfriend",
  "will you be my girlfriend",
  "will you be my boyfriend",
  "can you be my girlfriend",
  "can you be my boyfriend",
  "first",
  "first first",
  "first!",
  "anyone here",
  "anyone awake",
  "hello hello hello",
  "hi hi hi",
  "hey hey hey",
  "ping ping ping",
  "test test test",
  "spam",
  "spam spam",
  "stop spamming",
  "@everyone @everyone",
  "@here @here",
  "who hates who",
  "who hates who here",
  "who does everyone hate",
  "who do you hate",
  "who do you guys hate",
  "who hates me",
  "who hates him",
  "who hates her",
  "talk behind their back",
  "talk behind his back",
  "talk behind her back",
  "what are they saying about me",
  "what did they say about me",
  "what did he say about me",
  "what did she say about me",
  "let's start an argument",
  "start an argument",
  "start a fight",
  "let's start a fight",
  "let's cause drama",
  "who wants drama",
  "let's cause some drama",
  "tell me the drama",
  "spill the drama",
  "spill the tea",
  "tell me what happened",
  "who started it",
  "who's at fault",
  "pick a side",
  "you're dumb",
  "you're stupid",
  "you're an idiot",
  "you're an asshole",
  "you're annoying",
  "you're so annoying",
  "nobody likes you",
  "no one likes you",
  "everyone hates you",
  "you're useless",
  "you're pathetic",
  "you're embarrassing",
  "you're a joke",
  "you're so bad",
  "you're terrible",
  "you're awful",
  "shut up",
  "just shut up",
  "go away",
  "nobody asked",
  "no one asked",
  "who asked",
  "did anyone ask",
  "you're not funny",
  "you're so annoying",
  "stop talking",
  "stop being annoying",
  "you're weird",
  "you're so weird",
  "what a weirdo",
  "you're cringe",
  "you're so cringe",
  "that's cringe",
  "stop being cringe",
  "you're embarrassing",
  "you're such a loser",
  "you're a loser",
  "look at this loser",
  "what a loser",
  "you're pathetic",
  "you're embarrassing yourself",
  "why are you like this",
  "what is wrong with you",
  "are you stupid",
  "are you actually stupid",
  "you're acting stupid",
  "you're being annoying",
  "stop being annoying",
  "stop acting weird",
  "stop being weird",
  "nobody wants you here",
  "you don't belong here",
  "retard",
  "bastard"
];

/*
========================================
NORMALIZE MESSAGE
========================================
*/

function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

/*
========================================
FIND MATCH
========================================
*/

function findAutomodMatch(content) {
  const text = normalize(content);

  for (const term of BANNABLE_TERMS) {
    if (text.includes(term)) {
      return {
        category: "BANNABLE",
        severity: "🔴",
        recommendedAction: "BAN",
        term,
      };
    }
  }


  for (const term of MUTEABLE_TERMS) {
    if (text.includes(term)) {
      return {
        category: "MUTEABLE",
        severity: "🟡",
        recommendedAction: "TIMEOUT",
        term,
      };
    }
  }

  return null;
}

/*
========================================
CREATE REVIEW CASE
========================================
*/

async function createReviewCase(client, message, match) {
  const reviewChannel = await client.channels
    .fetch(AUTOMOD_REVIEW_CHANNEL)
    .catch(() => null);

  if (!reviewChannel) {
    console.error("AUTOMOD: Review channel could not be found.");

    return;
  }

  const messagePreview =
    message.content.length > 1000
      ? message.content.slice(0, 997) + "..."
      : message.content;

  const embed = new EmbedBuilder()
    .setColor(
      match.category === "BANNABLE"
        ? "#ED4245"
        : match.category === "KICKABLE"
          ? "#FEE75C"
          : "#5865F2",
    )
    .setTitle("🚨 AutoMod Review Required")
    .setDescription("A message triggered the automated moderation system.")
    .addFields(
      {
        name: "👤 User",
        value: `${message.author} (${message.author.id})`,
        inline: true,
      },
      {
        name: "📍 Channel",
        value: `${message.channel}`,
        inline: true,
      },
      {
        name: "⚠️ Category",
        value: `${match.severity} ${match.category}`,
        inline: true,
      },
      {
        name: "📋 Recommended Action",
        value: `**${match.recommendedAction}**`,
        inline: true,
      },
      {
        name: "🔎 Detected Term",
        value: `\`${match.term}\``,
        inline: true,
      },
      {
        name: "💬 Message",
        value: messagePreview || "*No text content*",
      },
    )
    .setFooter({
      text: "State Line Roleplay • AutoMod",
    })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`automod_ban_${message.author.id}_${message.id}`)
      .setLabel("Ban")
      .setEmoji("🔨")
      .setStyle(ButtonStyle.Danger),

    new ButtonBuilder()
      .setCustomId(`automod_release_${message.author.id}_${message.id}`)
      .setLabel("Release Timeout")
      .setEmoji("🔓")
      .setStyle(ButtonStyle.Success),
  );

  await reviewChannel.send({
    content:
      match.category === "BANNABLE"
        ? `<@&${AUTOMOD_REVIEW_ROLE}> 🚨 **BANNABLE AutoMod case requires review!**`
        : undefined,

    allowedMentions:
      match.category === "BANNABLE"
        ? {
            roles: [AUTOMOD_REVIEW_ROLE],
          }
        : undefined,

    embeds: [embed],
    components: [row],
  });
}

/*
========================================
AUTOMOD HANDLER
========================================
*/

module.exports = async (client, message) => {
  if (!message || !message.guild) {
    return;
  }

  if (message.author.bot) {
    return;
  }

  if (
        message.member &&
        AUTOMOD_IGNORED_ROLES.some(roleId =>
            message.member.roles.cache.has(roleId)
        )
    ) {
        return;
    }

  const match = findAutomodMatch(message.content);
  console.log(
    "AUTOMOD CHECK:",
    JSON.stringify(message.content),
    "MATCH:",
    match,
  );

  if (!match) {
    return;
  }

  console.log(
    `AUTOMOD MATCH: ${message.author.tag} | ${match.category} | ${match.term}`,
  );

  /*
    ========================================
    DELETE MESSAGE
    ========================================
    */

  await message.delete().catch(() => {});

  /*
    ========================================
    TIMEOUT USER
    ========================================
    */

  let timeoutApplied = false;

  try {
    if (message.member?.moderatable) {
      await message.member.timeout(
        AUTOMOD_TIMEOUT_DURATION,
        `AutoMod: ${match.category} - ${match.term}`,
      );

      timeoutApplied = true;
    }
  } catch (error) {
    console.error("AUTOMOD TIMEOUT ERROR:", error);
  }

  /*
    ========================================
    CREATE REVIEW
    ========================================
    */

  await createReviewCase(client, message, match);

  console.log(
    `AUTOMOD ACTION: ${timeoutApplied ? "TIMEOUT APPLIED" : "TIMEOUT FAILED"}`,
  );
};
