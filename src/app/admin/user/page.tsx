import AdminUserList from "@/features/users/components/admin/admin-user-list";
import AdminUserStatus from "@/features/users/components/admin/admin-user-status";
import { getUserAll } from "@/features/users/db/users";
import { UserStatus } from "@prisma/client";
import React from "react";

interface UserPageProps {
  searchParams: Promise<{ status?: string; page?: string; search?: string }>;
}

const UserPage = async ({ searchParams }: UserPageProps) => {
  const status = (await searchParams).status as UserStatus;
  const page = parseInt((await searchParams).page || "1");
  const search = (await searchParams).search as string;

  const limit = 2;

  const { user, totalUser, activeUserCount, bannedUserCount } =
    await getUserAll(status, page, limit , search);

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b pb-6 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold sm:text-3xl">User Management</h1>
          <p className="text-muted-foreground text-sm">
            Manage all users in the system, including roles, statuses, and
            contact information.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <AdminUserStatus
          totalUserCount={totalUser}
          activeUserCount={activeUserCount}
          bannedUserCount={bannedUserCount}
        />
        <AdminUserList
          users={user}
          status={status}
          page={page}
          totalCount={totalUser}
          limit={limit}
        />
      </div>
    </div>
  );
};

export default UserPage;
