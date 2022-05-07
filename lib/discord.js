require("dotenv").config();

const DISCORD_USER_AVATAR =
  "https://cdn.discordapp.com/avatars/" + process.env.DISCORD_USER_ID + "/";

const DISCORD_GATEWAY_AUTH = {
  op: 2,
  d: {
    token: process.env.DISCORD_BOT_TOKEN,
    intents: 813,
    properties: {
      $os: "linux",
      $browser: "my_library",
      $device: "my_library",
    },
  },
};

const DISCORD_GATEWAY_GUILD_GET_SPECIFIC_MEMBER = {
  op: 8,
  d: {
    guild_id: process.env.DISCORD_GUILD_ID,
    presences: true,
    user_ids: [process.env.DISCORD_USER_ID],
    limit: 1,
  },
};

module.exports = {
  DISCORD_USER_AVATAR,
  DISCORD_GATEWAY_AUTH,
  DISCORD_GATEWAY_GUILD_GET_SPECIFIC_MEMBER,
};
