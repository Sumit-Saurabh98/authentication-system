import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import onCall from "./socket-events/onCallEvent.js";
import onWebrtcSignal from "./socket-events/onWebrtcSignalEvent.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

export let io;

app.prepare().then(() => {
  const httpServer = createServer(handler);

  io = new Server(httpServer);
  let onlineUsers = [];

  io.on('connection', (socket) => {
    
    // add user
    socket.on('addNewUser', (authUser) =>{
      authUser && !onlineUsers.some((user) => user?.userId === authUser.id) && onlineUsers.push({
        userId: authUser.id,
        socketId: socket.id,
        profile: {
          id: authUser.id,
          name: authUser.name,
          email: authUser.email,
          image: authUser.image,
          role: authUser.role
        }
      });

      // send active users
      io.emit('getUsers', onlineUsers);
    })

    // remove user
    socket.on('disconnect', () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

      // send active users
      io.emit('getUsers', onlineUsers);
    });

    // call event
    socket.on('call', onCall);
    socket.on('webrtcSignal', onWebrtcSignal)
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});