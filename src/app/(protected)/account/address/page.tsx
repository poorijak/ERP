import AddressSection from "@/features/address/components/address-section";
import { getAddressByUserId } from "@/features/address/db/address";
import { authCheck } from "@/features/auths/db/auths";
import { redirect } from "next/navigation";
import React from "react";

const AddressPage = async () => {
  const user = await authCheck();

  if (!user) {
    redirect("/auth/signin");
  }

  const address = await getAddressByUserId(user.id);

  return (
    <div>
      <AddressSection address={address} />
    </div>
  );
};

export default AddressPage;
