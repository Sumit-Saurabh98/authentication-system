"use client"

import { useEffect, useRef } from "react";

interface IVideoContainer{
    stream: MediaStream | null,
    isLocalStream: boolean,
    isOnCall: boolean
}

const VideoContainer = ({stream, isLocalStream, isOnCall}: IVideoContainer) => {

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() =>{
        if(videoRef.current && stream){
            videoRef.current.srcObject = stream;
        }
    }, [stream])

  return (
    <video ref={videoRef} className="rounded border w-[800px]" autoPlay playsInline muted={isLocalStream} />
  )
}

export default VideoContainer
