"use client";

import { useSocket } from "@/context/SocketContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {MdCall, MdCallEnd} from "react-icons/md"


const CallNotification = () => {
  const { ongoingCall, handleJoinCall } = useSocket();

  if (!ongoingCall?.isRinging) return;
  return (
    <div className="absolute bg-slate-500 bg-opacity-70 w-screen h-screen top-0 left-0 flex items-center justify-center">
      <div className="bg-white min-w-[300px] min-h-[100px] flex flex-col items-center justify-center rounded p-4">
        <div className="flex flex-col items-center justify-center mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={ongoingCall.participants.caller.profile.image ?? undefined} />
            <AvatarFallback>{ongoingCall.participants.caller.profile.name.charAt(0) ?? undefined}</AvatarFallback>
          </Avatar>
        </div>
        <p className="text-lg font-bold pb-2">{ongoingCall.participants.caller.profile.name}</p>
        <div className="flex gap-8">
          <button className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white"
          onClick={() =>handleJoinCall(ongoingCall)}
          ><MdCall size={24}/></button>
          <button className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white"><MdCallEnd size={24}/></button>
        </div>
      </div>
    </div>
  );
};

export default CallNotification;
