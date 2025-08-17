import { cn } from "@/lib/utils";
import { UserCheck2Icon, Users, UserX2Icon } from "lucide-react";
import React from "react";

interface AdminUesrStatusProps {
  totalUserCount: number;
  activeUserCount: number;
  bannedUserCount: number;
}

const AdminUserStatus = async ({
  totalUserCount,
  activeUserCount,
  bannedUserCount,
}: AdminUesrStatusProps) => {
  const userStatusList = [
    {
      label: "Total user",
      desc: "All registered users in the system",
      cout: totalUserCount,
      textColor: "text-blue-500",
      icon: <Users size={15} className="text-blue-500" />,
    },
    {
      label: "Active user",
      desc: "Users who currently have access to the system",
      cout: activeUserCount,
      textColor: "text-green-500",
      icon: <UserCheck2Icon size={15} className="text-green-500" />,
    },
    {
      label: "Banned user",
      desc: "Users who have been restricted from accessing the system",
      cout: bannedUserCount,
      textColor: "text-red-500",
      icon: <UserX2Icon size={15} className="text-red-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {userStatusList.map((list, index) => (
        <div
          className="flex flex-col gap-3 rounded-xl border px-5 py-6 shadow"
          key={index}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div>{list.label}</div>
              <p className="text-muted-foreground hidden text-xs md:block">
                {list.desc}
              </p>
            </div>
            <div>{list.icon}</div>
          </div>
          <div className={cn("text-3xl", list.textColor)}>{list.cout}</div>
        </div>
      ))}
    </div>
  );
};

export default AdminUserStatus;
