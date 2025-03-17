

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";

const NoOnlineUsers = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6">
      <Card className="p-10 flex flex-col items-center justify-center shadow-lg rounded-2xl border border-gray-300 bg-gradient-to-r from-gray-100 to-gray-200">
        <Ghost size={64} className="text-gray-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-gray-700">No One's Online</h2>
        <p className="text-gray-500 mt-2">Looks like everyone's offline. Time to take a break?</p>
        <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">Refresh</Button>
      </Card>
    </div>
  );
};

export default NoOnlineUsers;
