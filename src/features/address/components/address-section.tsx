"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Plus } from "lucide-react";
import React, { useState } from "react";
import { AddressType } from "@/types/address";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import AddressAccountModal from "./address-account-modal";

interface addressSectionProps {
  address: AddressType[];
}

interface ModalState {
  state: "create" | "update";
}

const AddressSection = ({ address }: addressSectionProps) => {
  const [open, setOpen] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({ state: "create" });
  const [selectedAddress, setSelectedAddress] = useState<
    AddressType | undefined
  >(undefined);

  const handleAddessSectionModal = (
    state: "update" | "create",
    address?: AddressType,
  ) => {
    setOpen(true);
    setModalState({ state });
    setSelectedAddress(address);
  };
  return (
    <div className="w-11/12">
      <Card>
        <CardHeader>
          <CardTitle>ที่อยู่ของฉัน</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          {address.length === 0 ? (
            <div className="rounded-md border px-4 py-5">
              <div className="flex items-center justify-center">
                <p className="text-muted-foreground">
                  เพิ่มที่อยู่ของคุณที่นี่
                </p>
              </div>
            </div>
          ) : (
            address.map((addr, index) => (
              <div
                className={cn(
                  "flex flex-col gap-3 rounded-md border px-4 py-5 cursor-pointer",
                  addr.isDefault && "border-primary",
                )}
                key={index}
                onClick={() => handleAddessSectionModal("update" , addr)}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm">{addr.fullAddress}</p>
                  <Button
                    variant="outline"
                    onClick={() => handleAddessSectionModal("update", addr)}
                  >
                    <Pencil />
                    แก้ไขที่อยู่
                  </Button>
                </div>
                {addr.isDefault && <Badge>ค่าเริ่มต้น</Badge>}
              </div>
            ))
          )}
          <Button
            className="w-full px-4 py-5"
            variant="default"
            onClick={() => handleAddessSectionModal("create")}
          >
            <Plus />
            เพิ่มที่อยู่ใหม่
          </Button>
        </CardContent>
      </Card>

      <AddressAccountModal
        open={open}
        onOpenChange={setOpen}
        modalState={modalState}
        address={selectedAddress}
      />
    </div>
  );
};

export default AddressSection;
