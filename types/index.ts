
export type SocketUser = {
    userId: string;
    socketId: string;
    profile: {
        id: string;
        name: string;
        email: string;
        image: string;
        role: string;
    }
}