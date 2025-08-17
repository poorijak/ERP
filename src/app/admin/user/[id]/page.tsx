// app/user/[id]/page.tsx
import { Button } from "@/components/ui/button";
import { getOrderAllWithUser } from "@/features/orders/db/orders";
import AdminUserOverview from "@/features/users/components/admin/admin-user-detail/admin-user-overview";
import { getUserWihtAddressById } from "@/features/users/db/users";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface UserDetailPageProps {
  params: { id: string };
  searchParams: Promise<{ page?: string }>;
}

const UserDetailPage = async ({
  params,
  searchParams,
}: UserDetailPageProps) => {
  const { id } = params;

  const page = parseInt((await searchParams).page || "1");
  const limit = 2;

  const [user, order] = await Promise.all([
    getUserWihtAddressById(id),
    getOrderAllWithUser(id, page, limit),
  ]);

  if (!user) {
    redirect("/admin/user");
  }

  if (!order) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b pb-6 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold sm:text-3xl">
            <span>User # </span>
            {user.id}
          </h1>
          <p className="text-muted-foreground text-sm">
            View and manage individual user details, including roles, account
            status, contact information, and order history.
          </p>
        </div>

        <Button variant="outline">
          <Link href="/admin/user" className="flex gap-3 items-center">
            <ArrowLeft />
            <span>Go back to user management</span>
          </Link>
        </Button>
      </div>

      <div>
        <AdminUserOverview
          user={user}
          order={order}
          page={page}
          limit={limit}
        />
      </div>
    </div>
  );
};

export default UserDetailPage;
