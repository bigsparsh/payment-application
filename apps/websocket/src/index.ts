import { WebSocketServer, WebSocket } from "ws";

type User = {
  id: string;
  name: string;
  email: string;
  connectedTo: string;
  ws: WebSocket;
};

const wss = new WebSocketServer({ port: 8080 });
const users: User[] = [];

wss.on("connection", (ws) => {
  users.push({ ws, id: "", name: "", email: "", connectedTo: "" });
  ws.on("error", console.error);

  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());

    if (message.type === "peer connection") {
      users.forEach((user) => {
        if (user.id === message.connectedTo) {
          ws.send(
            JSON.stringify({
              type: "peer connection",
              connectedTo: user.id,
              connected: true,
            }),
          );
        }
      });
    }

    if (message.type == "connection") {
      users.forEach((user) => {
        if (user.ws === ws) {
          user.connectedTo = message.connectedTo;
          user.id = message.payload.id;
          user.name = message.payload.name;
          user.email = message.payload.email;

          users.forEach((usr) => {
            if (usr.id === message.connectedTo) {
              usr.ws.send(
                JSON.stringify({
                  type: "peer connection",
                  connected: true,
                }),
              );
            }
          });
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
              text: message.payload.message,
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
        users.forEach((usr) => {
          if (usr.connectedTo === user.id) {
            usr.ws.send(
              JSON.stringify({
                type: "peer connection",
                connected: false,
              }),
            );
          }
        });
        users.splice(index, 1);
      }
    });
  });
  ws.send(JSON.stringify({ message: "Hello I am a WebSocketServer" }));
});
