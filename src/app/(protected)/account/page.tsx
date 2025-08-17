import ProfileSection from "@/features/users/components/customer/desktop/components/profile-section";
import { getUserById } from "@/features/users/db/users";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const ProfilePage = async () => {
  const head = await headers();
  const userId = head.get("x-user-id");

  if (!userId) {
    redirect("/auth/signin");
  }

  const user = await getUserById(userId);

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto flex flex-col gap-4">
      <div className="hidden md:block">
          <ProfileSection user={user} />
      </div>
    </div>
  );
};

export default ProfilePage;
