"use client";

import Modal from "@/components/shared/modal";
import SubmitBtn from "@/components/shared/submit-btn";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import Form from "next/form";
import React, { useEffect, useState } from "react";
import { useForm } from "@/hooks/use-form";
import InputForm from "@/components/shared/input-form";
import { Switch } from "@/components/ui/switch";
import { AddressAction } from "../action/address";
import { AddressType } from "@/types/address";

interface AddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modalState: ModalState;
  address: AddressType | undefined;
}

interface ModalState {
  state: "create" | "update";
}

const AddressAccountModal = ({
  onOpenChange,
  open,
  modalState,
  address,
}: AddressModalProps) => {
  const { formAction, state, isPending } = useForm(AddressAction);
  const [addressInput, setAddressInput] = useState("");

  useEffect(() => {
    if (state.success) {
      onOpenChange(false);
      setAddressInput("");
    }
  }, [onOpenChange, state]);

  const addressFields = [
    {
      label: "บ้านเลขที่ / หมู่บ้าน / ซอย",
      name: "address-line-1",
      id: "address-line-1",
      placeholder: "เช่น 123/45 หมู่บ้านสวนฟ้า ซอย 7",
      require: true,
      defaultValue: address?.addressLine1,
    },
    {
      label: "ชั้น / อาคาร ",
      name: "address-line-2",
      id: "address-line-2",
      placeholder: "เช่น อาคาร A ชั้น 5",
      require: false,
      defaultValue: address?.addressLine2,
    },

    {
      label: "ถนน",
      name: "street",
      id: "street",
      placeholder: "เช่น ถนนรามคำแหง",
      require: true,
      defaultValue: address?.street,
    },
    {
      label: "แขวง / ตำบล",
      name: "subdistrict",
      id: "subdistrict",
      placeholder: "เช่น หัวหมาก",
      require: true,
      defaultValue: address?.subdistrict,
    },
    {
      label: "เขต / อำเภอ",
      name: "district",
      id: "district",
      placeholder: "เช่น บางกะปิ",
      require: true,
      defaultValue: address?.district,
    },
    {
      label: "จังหวัด",
      name: "province",
      id: "province",
      placeholder: "เช่น กรุงเทพมหานคร",
      require: true,
      defaultValue: address?.province,
    },
    {
      label: "รหัสไปรษณีย์",
      name: "postalCode",
      id: "postalCode",
      placeholder: "เช่น 10210",
      require: true,
      defaultValue: address?.postalCode,
    },
  ];
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={modalState.state === "create" ? "เพิ่มที่อยู่" : "แก้ไขที่อยู่"}
      description="ป้อนรายละเอียดที่อยู่เพื่อใช้ในการจัดส่งสินค้า"
    >
      <Form action={formAction}>
        <div className="flex flex-col gap-4">
          {modalState.state === "update" && (
            <input value={address?.id} type="hidden" name="address-id" />
          )}
          {addressFields.map((field, index) => (
            <InputForm
              key={index}
              label={field.label}
              id={field.id}
              name={field.name}
              placeholder={field.placeholder}
              required={field.require}
              defaultValue={field.defaultValue || ""}
              onChange={(e) => setAddressInput(e.target.value)}
            />
          ))}
          <div className="flex items-center gap-2">
            <Switch
              id="main-address"
              name="main-address"
              defaultChecked={address?.isDefault ? true : false}
              onCheckedChange={() => setAddressInput("on")}
            />
            <Label htmlFor="main-address">เลือกเป็นที่อยู่ตั้งต้น</Label>
          </div>
          <SubmitBtn
            icon={Save}
            title="บันทึก"
            name="บันทึก"
            pending={isPending}
            disabled={!addressInput}
          />
        </div>
      </Form>
    </Modal>
  );
};

export default AddressAccountModal;
