"use client"

import { SocketContextProvider } from "@/context/SocketContext"

const SockerProvider = ({children}: {children: React.ReactNode}) => {
    return (
        <SocketContextProvider>{children}</SocketContextProvider>
    )
}

export default SockerProvider;  // eslint-disable-line