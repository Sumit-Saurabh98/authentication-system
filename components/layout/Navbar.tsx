"use client";

import { Video } from "lucide-react";
import Container from "./Container";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Navbar = () => {
  const router = useRouter();
  const user = useCurrentUser();
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <Container>
        <div className="flex justify-between items-center">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Video />
            <div className="font-bold text-xl">VChat</div>
          </div>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.image ?? undefined} />
              <AvatarFallback>{user?.name}</AvatarFallback>
            </Avatar>
            {!user && (
              <>
                <Button
                  className="cursor-pointer"
                  size={"sm"}
                  variant={"outline"}
                  onClick={() => router.push("/sign-in")}
                >
                  Sign In
                </Button>
                <Button
                  className="cursor-pointer"
                  size={"sm"}
                  onClick={() => router.push("/sign-up")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
