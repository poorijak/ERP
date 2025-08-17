"use client";

import InputForm from "@/components/shared/input-form";
import Modal from "@/components/shared/modal";
import SubmitBtn from "@/components/shared/submit-btn";
import { UserType } from "@/types/user";
import { Pencil } from "lucide-react";
import Form from "next/form";
import React, { useEffect, useRef, useState } from "react";
import { updateUserAction } from "../../../action/user";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useForm } from "@/hooks/use-form";

interface EdtAccountModal {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType;
}

const EditAccountModal = ({ open, onOpenChange, user }: EdtAccountModal) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { formAction, isPending, state } = useForm(updateUserAction);
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("ไฟล์ขนาดใหญ่เกินไป (ไม่เกิน 5 MB)");
      return;
    }

    const url = URL.createObjectURL(file);

    setPreview(url);
  };

  // ใช้ state ของ useForm ในการเช็คค่าเมื่อ submit
  useEffect(() => {
    if (state.success) {
      onOpenChange(false);
      setName("");
      setTel("");
    }
  }, [state, onOpenChange]);

  return (
    <Modal
      onOpenChange={onOpenChange}
      open={open}
      title="แก้ไขข้อมูลบัญชีผู้ใช้"
      description="คุณสามารถแก้ไขข้อมูลส่วนตัว เช่น ชื่อ ที่อยู่ หรือเบอร์โทรศัพท์ ได้ที่นี่"
    >
      <Form action={formAction}>
        <div className="flex flex-col gap-4">
          <input id="user-id" type="hidden" name="user-id" value={user.id} />
          <div className="mb-4 flex items-center gap-4">
            <div className="relative aspect-square size-20 overflow-hidden rounded-full">
              <Image
                alt="user-profile"
                src={preview || user.picture || "/images/no-user-image.webp"}
                fill
              />
            </div>
            <Button
              size={"sm"}
              variant={"outline"}
              className="text-xs"
              onClick={triggerFileInput}
            >
              เปลี่ยนรูปโปรไฟล์
            </Button>
            <Button size={"sm"} variant={"destructive"} className="text-xs">
              ลบรูปโปรไฟล์
            </Button>
            <Input
              type="file"
              hidden
              ref={fileInputRef}
              id="profile-image"
              onChange={(event) => handleImageChange(event)}
              accept="image/*"
              name="profile-image"
            />
          </div>
          <InputForm
            label="ชื่อผู้ใช้"
            id="name"
            required
            onChange={(e) => setName(e.target.value)}
          />
          <InputForm
            label="เบอร์โทรศัพท์"
            id="tel"
            required
            onChange={(e) => setTel(e.target.value)}
          />
          <SubmitBtn
            title="แก้ไขข้อมูล"
            type="submit"
            name="แก้ไขข้อมูล"
            icon={Pencil}
            disabled={!tel && !name} // ถ้า tel และ name ไม่มีค่าถึงจะ disable
            pending={isPending}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default EditAccountModal;
