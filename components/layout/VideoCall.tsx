"use client";

import { useSocket } from "@/context/SocketContext";
import VideoContainer from "./VideoContainer";
import { MdMic, MdMicOff, MdVideocamOff, MdVideocam } from "react-icons/md";
import { useCallback, useEffect, useState } from "react";

const VideoCall = () => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVidOn, setIsVidOn] = useState(true);
  const { localStream, peer, ongoingCall } = useSocket();

  console.log(peer, "mere peer->>>=>>>=>>>->>")

  useEffect(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) setIsMicOn(audioTrack.enabled);

      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) setIsVidOn(videoTrack.enabled);
    }
  }, [localStream]);

  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVidOn(videoTrack.enabled);
      }
    }
  }, [localStream]);

  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  }, [localStream]);

  const isOnCall = localStream && peer && ongoingCall ? true : false;

  return (
    <div>
      <div className="mt-4 relative">
        {localStream && (
          <VideoContainer
            stream={localStream}
            isLocalStream={true}
            isOnCall={isOnCall}
          />
        )}
        {peer && peer.stream && (
          <VideoContainer
            stream={peer.stream}
            isLocalStream={false}
            isOnCall={isOnCall}
          />
        )}
      </div>
      <div className="mt-8 flex items-center justify-center">
        <button onClick={toggleMic}>
          {isMicOn ? <MdMic size={28} /> : <MdMicOff size={28} />}
        </button>
        <button
          className="px-4 py-2 bg-rose-500 text-white rounded mx-4"
          onClick={() => {}}
        >
          End Call
        </button>
        <button onClick={toggleCamera}>
          {isVidOn ? <MdVideocam size={28} /> : <MdVideocamOff size={28} />}
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
