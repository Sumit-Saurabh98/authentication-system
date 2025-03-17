import { useCurrentUser } from "@/hooks/use-current-user";
import { SocketUser } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import {io, Socket} from "socket.io-client"
interface iSocketContext {
    
}

export const SocketContext = createContext<iSocketContext | null>(null);


export const SocketContextProvider = ({children}: {children: React.ReactNode}) => {
    const currentLoginUser = useCurrentUser();
    console.log(currentLoginUser, "currentLoginUser=>>>>>>>>>");
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<SocketUser[] | null>([]);

    console.log(isSocketConnected, "isSocketConnected->->->->->");
    console.log(onlineUsers, "onlineUsers->->->->->");

    //initiallizing socket

    useEffect(() =>{
        
        const newSocket = io();
        setSocket(newSocket);

        return () =>{
            newSocket.disconnect();
        }

    }, [currentLoginUser])

    useEffect(()=>{
        if(socket === null) return
        
        if(socket.connected){
            onConnect()
        }

        function onConnect(){
            setIsSocketConnected(true);
        }

        function onDisconnect(){
            setIsSocketConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        }

    }, [socket])

    // set online users
    useEffect(() =>{
        if(!socket || !isSocketConnected) return;

        socket.emit('addNewUser', currentLoginUser);

        socket.on("getUsers", (res) =>{
            setOnlineUsers(res)
        })

        return () => {
            socket.off("getUsers", (res) =>{
                setOnlineUsers(res)
            })
        }

    }, [socket, isSocketConnected, currentLoginUser])


    return <SocketContext.Provider value={{}}>
        {children}
    </SocketContext.Provider>
}

export const useSocket = () => {
    if(SocketContext===null) {
        throw new Error("useSocket must be used within a SocketContextProvider")
    }

    const context = useContext(SocketContext);
    return context;
}
