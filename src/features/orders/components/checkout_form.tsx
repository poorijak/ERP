"use client";

import InputForm from "@/components/shared/input-form";
import SubmitBtn from "@/components/shared/submit-btn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UserType } from "@/types/user";
import { ShoppingBag } from "lucide-react";
import Form from "next/form";
import React from "react";
import { checkoutFormAction } from "../action/order";
import { useForm } from "@/hooks/use-form";
import ErrorMessage from "@/components/shared/error-message";

interface CheckoutFormProps {
  user: UserType;
}

const CheckoutForm = ({ user }: CheckoutFormProps) => {
  const hasUserData = !!(user.address && user.tel); // !! แปลงค่าเป็น boolean

  const { errors, isPending, clearErrors, formAction } =
    useForm(checkoutFormAction);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">ข้อมูลการจัดส่ง</CardTitle>
      </CardHeader>

      <Form action={formAction} onChange={clearErrors}>
        <CardContent className="flex flex-col gap-4">
          {!hasUserData && (
            <div className="flex items-center space-x-2 mb-4 border p-3 rounded-mb bg-muted">
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
            <Label htmlFor="address">
              ที่อยู่จัดส่ง<span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="address"
              name="address"
              placeholder="กรุณาระบุที่อยู่จัดส่ง ตำบล อำเภอ จังหวัด รหัสไปรษณย์"
              className="min-h-24"
              defaultValue={user.address || ""}
            />
            {errors.address && <ErrorMessage error={errors.address[0]} />}
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
  );
};

export default CheckoutForm;
