import { io } from "../server.js";

const onWebrtcSignal = (data) =>{
    if(data.isCaller){
        if(data.ongoingCall.participants.receiver.sockedId){
            io.to(data.ongoingCall.participants.receiver.sockedId).emit('webrtcSignal',data)
        }
    }else{
        if(data.ongoingCall.participants.caller.sockedId){
            io.to(data.ongoingCall.participants.caller.sockedId).emit('webrtcSignal',data)
        }
    }
};

export default onWebrtcSignal;  