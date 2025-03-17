import CallNotification from "@/components/layout/CallNotification"
import ListOnlineUsers from "@/components/layout/ListOnlineUsers"
import VideoCall from "@/components/layout/VideoCall"

const page = () => {
  return (
    <div>
      <ListOnlineUsers/>
      <CallNotification/>
      <VideoCall/>
    </div>
  )
}

export default page
