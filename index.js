const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const WebSocket = require("ws");
const {
  DISCORD_GATEWAY_AUTH,
  DISCORD_GATEWAY_GUILD_GET_SPECIFIC_MEMBER,
  DISCORD_USER_AVATAR,
} = require("./lib/discord");
const waitForSocketConnection = require("./lib/socket");
require("dotenv").config();

const port = process.env.PORT || 3000;

const handleMessage = (event, callback) => {
  const eventData = JSON.parse(event.data);

  if (
    eventData.t !== "GUILD_MEMBERS_CHUNK" &&
    eventData.t !== "PRESENCE_UPDATE"
  ) {
    return;
  }

  if (eventData.t === "GUILD_MEMBERS_CHUNK") {
    if (eventData.d.presences.length > 0) {
      const filter = eventData.d.presences[0].activities.filter(
        (activity) => activity.name != "Custom Status"
      );

      callback({
        status: eventData.d.presences[0].status,
        profileUrl: DISCORD_USER_AVATAR + eventData.d.members[0].user.avatar,
        activities: filter,
      });
    } else {
      callback({
        status: "offline",
        profileUrl: DISCORD_USER_AVATAR + eventData.d.members[0].user.avatar,
        activities: [],
      });
    }
  } else {
    if (eventData.d.activities.length > 0) {
      const filter = eventData.d.activities.filter(
        (activity) => activity.name != "Custom Status"
      );

      callback({
        status: eventData.d.status,
        profileUrl: DISCORD_USER_AVATAR + eventData.d.user.avatar,
        activities: filter,
      });
    } else {
      callback({
        status: "offline",
        profileUrl: DISCORD_USER_AVATAR + eventData.d.user.avatar,
        activities: [],
      });
    }
  }
};

io.on("connection", (socket) => {
  socket.emit(
    "hello",
    JSON.stringify({
      type: "hello from server",
      content: [1, "2"],
    })
  );

  const ws = new WebSocket("wss://gateway.discord.gg?v=9&encoding=json");

  const sendMessage = (data) => {
    console.log("data");
    socket.emit("discord", JSON.stringify(data));
  };

  ws.onmessage = (event) => {
    handleMessage(event, sendMessage);
  };

  waitForSocketConnection(ws, function () {
    ws.send(JSON.stringify(DISCORD_GATEWAY_AUTH));
    ws.send(JSON.stringify(DISCORD_GATEWAY_GUILD_GET_SPECIFIC_MEMBER));
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
