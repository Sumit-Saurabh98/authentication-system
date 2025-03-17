import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);
  let onlineUsers = [];

  io.on("connection", (socket) => {
    
    // add user
    socket.on("addNewUser", (authUser) =>{
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
      io.emit("getUsers", onlineUsers);
    })

    // remove user
    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

      // send active users
      io.emit("getUsers", onlineUsers);
    });
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