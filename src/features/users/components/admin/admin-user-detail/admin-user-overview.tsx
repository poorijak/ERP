import { UserWithAddress } from "@/types/user";
import React from "react";
import AdminUserDetail from "./admin-user-detail";
import { OrderUserType } from "@/types/order";
import AdminUserSummary from "./admin-user-summay";
import AdminUserOrder from "./admin-user-order";

interface AdminUserDetailProps {
  user: UserWithAddress;
  order: OrderUserType;
  page: number;
  limit: number;
}

const AdminUserOverview = ({
  user,
  order,
  page,
  limit,
}: AdminUserDetailProps) => {
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <AdminUserDetail user={user} />
        </div>
        <div>
          <AdminUserSummary order={order} />
        </div>
        <div className="col-span-2">
          <AdminUserOrder order={order} page={page} limit={limit} />
        </div>
      </div>
    </div>
  );
};

export default AdminUserOverview;
