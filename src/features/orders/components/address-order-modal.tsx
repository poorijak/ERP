import Modal from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AddressType } from "@/types/address";
import { MapPin } from "lucide-react";
import React, { useState } from "react";

interface AddressOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: AddressType[];
  onAddressChange: (addr: AddressType | null) => void;
}

const AddressOrderModal = ({
  open,
  onOpenChange,
  address,
  onAddressChange,
}: AddressOrderModalProps) => {
  const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(
    address.find((addr) => addr.isDefault) || null
  );

  const handleSubmitAddress = () => {
    onAddressChange(selectedAddress);
    onOpenChange(false);
  };


  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="เลือกที่อยู่ของคุณด้วยตัวเอง"
      description="เลือกที่อยู่ของคุณ"
    >
      {address.map((addr, index) => (
        <div
          key={index}
          className={cn(
            "flex cursor-pointer items-center justify-between rounded-md border px-4 py-4",
            (
              selectedAddress
                ? addr.id === selectedAddress.id
                : addr.isDefault
            ) && "border-primary border-2"
          )}
          onClick={() => setSelectedAddress(addr)}
        >
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <MapPin
              size={30}
              className={cn(addr.id === selectedAddress?.id && "text-primary")}
            />
            <span>{addr.fullAddress}</span>
          </p>
        </div>
      ))}
      <Button onClick={() => handleSubmitAddress()}>ยืนยันที่อยู่</Button>
    </Modal>
  );
};

export default AddressOrderModal;
