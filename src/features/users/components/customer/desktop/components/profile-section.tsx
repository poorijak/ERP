"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { formatDateToYMD } from "@/lib/format/formatDate";
import formatPhoneNumber from "@/lib/format/formatPhoneNumber";
import { UserType } from "@/types/user";
import { Pencil } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import EditAccountModal from "../../modal/edit-account-modal";
import { Separator } from "@/components/ui/separator";

interface sectionProps {
  user: UserType;
}

const ProfileSection = ({ user }: sectionProps) => {
  const [isEditAccountModal, setIsEditAccountModal] = useState(false);

  const handleEditAccountModal = () => {
    setIsEditAccountModal(true);
  };

  return (
    <div className="flex flex-col mx-auto gap-4 w-full">
      <Card>
        <CardHeader>
          <div className="flex w-full items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">โปรไฟล์ส่วนตัว</h2>
            </div>
            <div className="flex items-center">
              <Button variant="outline" className="hover:cursor-pointer" onClick={handleEditAccountModal}>
                <Pencil />
                <span>แก้ไขโปรไฟล์</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="w-full rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 px-5 py-6">
                <div className="relative aspect-square size-30 overflow-hidden rounded-full">
                  <Image
                    alt="Cutomer-Profile"
                    src={user.picture || "/images/no-user-image.webp"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col">
                    <Label className="text-muted-foreground text-xs">
                      Display Name
                    </Label>
                    <span>{user.name || "-"}</span>
                  </div>
                  <div className="flex flex-col">
                    <Label className="text-muted-foreground text-xs">
                      Role
                    </Label>
                    <span>{user.role}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />
        </CardContent>

        <CardContent>
          <div className="relavtive">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground font-light">
                  Username
                </Label>
                <span>{user.name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground font-light">
                  Email
                </Label>
                <span>{user.email}</span>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground font-light">Tel</Label>
                <span>{formatPhoneNumber(user.tel || "-")}</span>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground font-light">
                  Join At
                </Label>
                <span>{formatDateToYMD(user.createdAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditAccountModal
        open={isEditAccountModal}
        onOpenChange={setIsEditAccountModal}
        user={user}
      />
    </div>
  );
};
export default ProfileSection;
