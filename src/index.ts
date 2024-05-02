import {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  TextChannel,
} from "discord.js";

const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.User, Partials.Reaction],
});
if (!process.env.DISCORD_TOKEN) {
  throw new Error("DISCORD_TOKEN is not provided");
}

const { GUILD_ID, MODERATOR_ROLE_ID, DONOR_CHANNEL_ID, ACCEPTOR_CHANNEL_ID } =
  process.env;

if (!GUILD_ID) {
  throw new Error("GUILD_ID is not provided");
}

if (!MODERATOR_ROLE_ID) {
  throw new Error("MODERATOR_ROLE_ID is not provided");
}

if (!DONOR_CHANNEL_ID) {
  throw new Error("DONOR_CHANNEL_ID is not provided");
}

if (!ACCEPTOR_CHANNEL_ID) {
  throw new Error("ACCEPTOR_CHANNEL_ID is not provided");
}

// Login here
discord.login(process.env.DISCORD_TOKEN);

discord.once(Events.ClientReady, async (event) => {
  console.log(`Logged in as ${event.user?.tag}`);

  const guild = await discord.guilds.fetch(GUILD_ID);

  discord.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (reaction.message.channelId !== DONOR_CHANNEL_ID) return;
    const member = await guild.members.fetch(user.id);

    if (!member.roles.cache.has(MODERATOR_ROLE_ID)) return;

    const message = await reaction.message.fetch();
    const { author } = message;

    const text = [
      `**Date:** <t:${(message.createdTimestamp * 0.001) ^ 0}:t>`,
      `**User:** <@${author.id}> ${author.username} aka ${author.displayName}`,

      `${message.content}`,
    ]
      .join(`\n`)
      .trim();

    const acceptor = (await guild.channels.fetch(
      ACCEPTOR_CHANNEL_ID
    )) as TextChannel;
    await acceptor.send(text);
  });
});
