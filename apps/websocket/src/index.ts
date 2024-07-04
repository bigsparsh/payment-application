import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ message: message.message }));
    });
  });

  ws.send(JSON.stringify({ message: "Hello I am a WebSocketServer" }));
});
