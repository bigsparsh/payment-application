import { WebSocketServer, WebSocket } from "ws";

type User = {
  id: string;
  name: string;
  email: string;
  ws: WebSocket;
};

const wss = new WebSocketServer({ port: 8080 });
const users: User[] = [];

wss.on("connection", (ws) => {
  users.push({ ws, id: "", name: "", email: "" });
  ws.on("error", console.error);

  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());

    if (message.type == "connection") {
      users.forEach((user) => {
        if (user.ws === ws) {
          user.id = message.payload.id;
          user.name = message.payload.name;
          user.email = message.payload.email;
        }
      });
    }
    if (message.type == "broadcast") {
      users.map((user) => {
        user.ws.send(
          JSON.stringify({
            type: "broadcast",
            payload: {
              message: users,
            },
          }),
        );
      });
    }
    if (message.type == "message") {
      users.forEach((user) => {
        if (user.id === message.receiver) {
          user.ws.send(
            JSON.stringify({
              type: "message",
              sender: message.sender,
              chat_id: message.payload.chat_id,
              payload: {
                message: message.payload.message,
              },
            }),
          );
          ws.send(
            JSON.stringify({
              type: "acknowledgement",
              payload: {
                message: "Message Delivered",
              },
            }),
          );
        }
      });
    }
  });
  ws.on("close", () => {
    users.forEach((user, index) => {
      if (user.ws === ws) {
        users.splice(index, 1);
      }
    });
  });
  ws.send(JSON.stringify({ message: "Hello I am a WebSocketServer" }));
});
