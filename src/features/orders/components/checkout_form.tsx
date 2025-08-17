"use client";

import InputForm from "@/components/shared/input-form";
import SubmitBtn from "@/components/shared/submit-btn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UserType } from "@/types/user";
import { ChevronRight, MapPin, ShoppingBag } from "lucide-react";
import Form from "next/form";
import React, { useEffect, useState } from "react";
import { checkoutFormAction } from "../action/order";
import { useForm } from "@/hooks/use-form";
import ErrorMessage from "@/components/shared/error-message";
import AddressOrderModal from "./address-order-modal";
import { AddressType } from "@/types/address";
import Link from "next/link";

interface CheckoutFormProps {
  user: UserType;
  address: AddressType[];
}

const CheckoutForm = ({ user, address }: CheckoutFormProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(
    null,
  );
  const [fullAddress, setFullAddress] = useState<string>("");
  const hasUserData = !!user.tel; // !! แปลงค่าเป็น boolean

  const { errors, isPending, clearErrors, formAction } =
    useForm(checkoutFormAction);

  const addressDefault = address.find((addr) => addr.isDefault) || address[0];

  const handleAddressModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    setFullAddress(
      selectedAddress?.fullAddress || addressDefault?.fullAddress || "",
    );
  }, [selectedAddress, addressDefault]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ข้อมูลการจัดส่ง</CardTitle>
        </CardHeader>
        <Form action={formAction} onChange={clearErrors}>
          <CardContent className="flex flex-col gap-4">
            {hasUserData && (
              <div className="rounded-mb bg-muted mb-4 flex items-center space-x-2 border p-3">
                <Switch
                  id="use-profile-data"
                  name="use-profile-data"
                  defaultChecked
                />
                <Label htmlFor="use-profile-data">
                  ใช้ข้อมูลจากโปรไฟล์ของฉัน
                </Label>
              </div>
            )}
            <div>
              <input
                value={addressDefault.id}
                type="hidden"
                name="address-id"
              />
              <InputForm
                label="เบอร์โทรศัพท์"
                id="phone"
                name="phone"
                placeholder="082342320"
                defaultValue={user.tel || ""}
                required
                className="flex flex-col gap-2"
              />
              {errors.phone && <ErrorMessage error={errors.phone[0]} />}
            </div>

            <div>
              <Label htmlFor="address">ที่อยู่</Label>
              {addressDefault ? (
                <div
                  className="border-primary flex cursor-pointer items-center justify-between rounded-md border px-4 py-4"
                  onClick={() => handleAddressModal()}
                >
                  <p className="text-muted-foreground flex items-center gap-2 text-sm">
                    <MapPin
                      size={17}
                      strokeWidth={2}
                      className="text-primary"
                    />
                    <span>{fullAddress}</span>
                  </p>
                  <ChevronRight className="text-muted-foreground" size={20} />
                </div>
              ) : (
                <div className="text-muted-foreground flex rounded-md border px-4 py-4 text-sm">
                  <Link href="/account/address">
                    ยังไม่มีที่อยู่จัดส่ง กรุณาเพิ่มที่อยู่
                  </Link>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="note">หมายเหตุเพิ่มเติม</Label>
              <Textarea
                id="note"
                name="note"
                placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
                className="min-h-20"
              />
              {errors.note && <ErrorMessage error={errors.note[0]} />}
            </div>

            <div className="pt-4">
              <SubmitBtn
                disabled={isPending}
                name="ดำเนินการสั่งซื้อ"
                icon={ShoppingBag}
                className="w-full"
              />
            </div>
          </CardContent>
        </Form>
      </Card>

      <AddressOrderModal
        open={open}
        onOpenChange={setOpen}
        address={address}
        onAddressChange={setSelectedAddress}
      />
    </div>
  );
};

export default CheckoutForm;
