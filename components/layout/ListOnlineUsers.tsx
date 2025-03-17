"use client";
import { useSocket } from "@/context/SocketContext";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "../ui/button";
import { PhoneCall } from "lucide-react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import NoOnlineUsers from "./NoOnlineUsers";

const ListOnlineUsers = () => {
  const {onlineUsers} = useSocket()
  const currentLoginUser = useCurrentUser();

  if (!onlineUsers?.length || onlineUsers?.length <= 1) {
    return <NoOnlineUsers />;
  }

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {onlineUsers?.length > 1 &&
        onlineUsers
          .filter((user) => user.userId !== currentLoginUser?.id)
          .map((user) => (
            <Card
              key={user.profile.id}
              className="p-4 flex flex-col items-center shadow-md rounded-xl"
            >
              <Avatar className="w-16 h-16 mb-3">
                <AvatarImage src={user.profile.image ?? undefined} />
                <AvatarFallback>{user.profile.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <p className="text-lg font-semibold">{user.profile.name}</p>
              <Button className="mt-3 w-full flex items-center gap-2">
                <PhoneCall size={16} /> Call
              </Button>
            </Card>
          ))}
    </div>
  );
};

export default ListOnlineUsers;
