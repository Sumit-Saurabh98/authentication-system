"use client"

import { useCurrentUser } from "@/hooks/use-current-user";
import { IOngoingCall, IParticipants, ISocketUser } from "@/interfaces";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {io, Socket} from "socket.io-client"
interface ISocketContext {
    onlineUsers: ISocketUser[] | null;
    ongoingCall: IOngoingCall | null;
    handleCall: (user: ISocketUser) => void
}

export const SocketContext = createContext<ISocketContext | null>(null);


export const SocketContextProvider = ({children}: {children: React.ReactNode}) => {
    const currentLoginUser = useCurrentUser();
    
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<ISocketUser[] | null>([]);
    const [ongoingCall, setOngoingCall] = useState<IOngoingCall | null>(null);

    console.log("ongoing call->->->->->->->->", ongoingCall)

    const currentSocketUser = onlineUsers?.find((onlineUser) => onlineUser.userId === currentLoginUser?.id);

    const handleCall = useCallback((user: ISocketUser) =>{

        if (!currentSocketUser || !socket) return;

        const participants = {
            caller: currentSocketUser,
            receiver: user
        }
    
        setOngoingCall({
            participants,
            isRinging: false
        })

        socket?.emit('call', participants);

    }, [socket, currentSocketUser, ongoingCall])

    const onInComingCall = useCallback((participants: IParticipants) =>{
        if (!socket) return;
        setOngoingCall({
            participants,
            isRinging: true
        })
    }, [ongoingCall, socket, currentLoginUser])

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

        socket.on('getUsers', (res) =>{
            setOnlineUsers(res)
        })

        return () => {
            socket.off('getUsers', (res) =>{
                setOnlineUsers(res)
            })
        }

    }, [socket, isSocketConnected, currentLoginUser])
    
    //calls
    useEffect(() =>{
        
        if(!socket || !isSocketConnected) return;

        socket.on('incomingCall', onInComingCall)

        return () => {
            socket.off('incomingCall', onInComingCall)
        }


    }, [onInComingCall, socket, isSocketConnected, currentLoginUser])


    return <SocketContext.Provider value={{
        onlineUsers,
        ongoingCall,
        handleCall
    }}>
        {children}
    </SocketContext.Provider>
}

export const useSocket = () => {
    const context = useContext(SocketContext);
    if(context === null) {
        throw new Error("useSocket must be used within a SocketContextProvider")
    }
    return context;
}
