"use client"

import { useCurrentUser } from "@/hooks/use-current-user";
import { IOngoingCall, IParticipants, ISocketUser } from "@/interfaces";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {io, Socket} from "socket.io-client"
interface ISocketContext {
    onlineUsers: ISocketUser[] | null;
    ongoingCall: IOngoingCall | null;
    localStream: MediaStream | null;
    handleCall: (user: ISocketUser) => void
}

export const SocketContext = createContext<ISocketContext | null>(null);


export const SocketContextProvider = ({children}: {children: React.ReactNode}) => {
    const currentLoginUser = useCurrentUser();
    
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<ISocketUser[] | null>([]);
    const [ongoingCall, setOngoingCall] = useState<IOngoingCall | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    // console.log("ongoing call->->->->->->->->", ongoingCall)

    const currentSocketUser = onlineUsers?.find((onlineUser) => onlineUser.userId === currentLoginUser?.id);

    const getMediaStream = useCallback(async (faceMode?: string) => {

        if(localStream) return localStream;

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter((device) => device.kind === 'videoinput');
            
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: {
                    width: {min: 640, ideal: 1280, max: 1920},
                    height: {min: 360, ideal: 720, max: 1080},
                    frameRate: {min:16, ideal: 30, max: 60},
                    facingMode: videoDevices.length > 0 ? faceMode : undefined, 
                }
            });

            setLocalStream(stream);

            return stream;

        } catch (error) {
            console.log("Failed to get media stream", error);
            setLocalStream(null);
            return null;
        }

    }, [localStream])

    const handleCall = useCallback(async (user: ISocketUser) =>{

        if (!currentSocketUser || !socket) return;

        const stream = await getMediaStream();

        if(!stream){
            console.log("No media i handle call");
            return;
        }



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
        localStream,
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
