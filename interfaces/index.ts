import Peer from "simple-peer"
export interface ISocketUser {
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

export interface IOngoingCall {
    participants: IParticipants;
    isRinging: boolean;
}

export interface IParticipants {
    caller: ISocketUser;
    receiver: ISocketUser;
}

export interface IPeerData{
    peerConnection: Peer.Instance,
    stream: MediaStream | undefined,
    participantUser: ISocketUser
}