
import { useCurrentUser } from "@/hooks/use-current-user";
import { SockerUser } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ISocketContext {
    
}


export const SocketContext = createContext<ISocketContext | null>(null);


export const SocketContextProvider = ({children}:{children: React.ReactNode}) =>{
    const user = useCurrentUser();
    console.log("user->>>>>>>>>>", user);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<SockerUser | null>(null);

    console.log("onlineUsers->>>>>>>>>>", onlineUsers);

    // initialize socket
    useEffect(() => {
        const newSocket = io();
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, [user])

    useEffect(() => {
        if(socket===null) return;

        if(socket.connected){
            onConnect();
        }
        function onConnect(){
            setIsSocketConnected(true);
        }

        function onDisconnect(){
            setIsSocketConnected(false);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        }
    }, [socket])

    //set online users
    useEffect(() => {
        if(socket===null || !isSocketConnected) return;

        socket.emit("addNewUser", user);

        socket.on("getUsers", (users) => {
            setOnlineUsers(users);
        })

        return () => {
            socket.off("getUsers", (users) => {
                setOnlineUsers(users);
            })
        }
        
    }, [socket, isSocketConnected, user])

    return (
        <SocketContext.Provider value={{}}>
            {children}
        </SocketContext.Provider>     
    )
}

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
      throw new Error("useSocket must be used within a SocketContextProvider");
    }
    return context;
  };