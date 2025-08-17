"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import AdminUserRoleModal from "../admin-user-role-modal";
import AdminUserStatusModal from "../admin-user-status-modal";
import { UserRole, UserStatus } from "@prisma/client";
import { UserWithAddress } from "@/types/user";
import { Separator } from "@/components/ui/separator";

interface AdminUserDetail {
  user: UserWithAddress;
}

const AdminUserDetail = ({ user }: AdminUserDetail) => {
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const [pendingStatus, setPendingStatus] = useState<UserStatus | null>(null);
  const [selctedUserId, setSelectedUserId] = useState<string>("");
  const [isAdminUserRoleModal, setIsAdminUserRoleModal] = useState(false);
  const [isAdminUserStatusModal, setIsAdminUserStatusModal] = useState(false);



  const handleAdminRoleModal = (id: string, value: string) => {
    setSelectedUserId(id);
    setPendingRole(value as UserRole);
    setIsAdminUserRoleModal(true);
  };

  const handleAdminStatus = (id: string, value: string) => {
    setSelectedUserId(id);
    setPendingStatus(value as UserStatus);
    setIsAdminUserStatusModal(true);
  };

  const selectedRoleList = [
    { lable: "Customer", value: "Customer" },
    { lable: "Admin", value: "Admin" },
  ];

  const selectedStatusList = [
    { label: "Active", value: "Active" },
    { label: "Banned", value: "Banned" },
  ];


  return (
    <div>
      <Card>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 font-semibold">
              <div>
                <h2 className="text-xl">User Detail</h2>
              </div>
              <Separator />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="flex flex-col gap-1">
                  <Label className="text-muted-foreground text-xs">
                    Email :
                  </Label>
                  <div className="text-md">{user.email}</div>
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-1">
                  <Label className="text-muted-foreground text-xs">
                    Status :
                  </Label>
                  <div className="text-md">{user.name}</div>
                </div>
              </div>

              <div>
                <div className="flex flex-col gap-1">
                  <Label className="text-muted-foreground text-xs">
                    Status :
                  </Label>
                  <Select
                    value={user.role}
                    onValueChange={(value) =>
                      handleAdminRoleModal(user.id, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedRoleList.map((role, index) => (
                        <SelectItem
                          key={index}
                          value={role.value}
                          disabled={user.status === role.value}
                        >
                          {role.lable}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-1">
                  <Label className="text-muted-foreground text-xs">
                    Role :
                  </Label>
                  <Select
                    value={user.status}
                    onValueChange={(value) => handleAdminStatus(user.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedStatusList.map((status, index) => (
                        <SelectItem
                          key={index}
                          value={status.value}
                          disabled={user.status === status.value}
                        >
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Role :</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {user.address.map((addr) => (
                      <SelectItem
                        key={addr.id}
                        value={addr.fullAddress as string}
                      >
                        {addr.fullAddress}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AdminUserRoleModal
        onOpenChange={setIsAdminUserRoleModal}
        open={isAdminUserRoleModal}
        selected={pendingRole}
        userId={selctedUserId}
      />
      <AdminUserStatusModal
        onOpenChange={setIsAdminUserStatusModal}
        open={isAdminUserStatusModal}
        selected={pendingStatus}
        userId={selctedUserId}
      />
    </div>
  );
};

export default AdminUserDetail;
