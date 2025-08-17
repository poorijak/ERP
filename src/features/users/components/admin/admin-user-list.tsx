"use client";

import { UserType } from "@/types/user";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format/formatDate";
import { Ban, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserRole, UserStatus } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminUserStatusModal from "./admin-user-status-modal";
import AdminUserRoleModal from "./admin-user-role-modal";
import { useRouter, useSearchParams } from "next/navigation";
import Paginaiton from "@/components/shared/pagination";
import { Input } from "@/components/ui/input";

interface AddminUserListProps {
  users: UserType[];
  status?: UserStatus;
  page: number;
  totalCount: number;
  limit: number;
}

const AdminUserList = ({
  users,
  page,
  status,
  totalCount,
  limit,
}: AddminUserListProps) => {
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const [pendingStatus, setPendingStatus] = useState<UserStatus | null>(null);
  const [selctedUserId, setSelectedUserId] = useState<string>("");
  const [isAdminUserRoleModal, setIsAdminUserRoleModal] = useState(false);
  const [isAdminUserStatusModal, setIsAdminUserStatusModal] = useState(false);
  // searchTerm
  const [searchTerm, setSearchTerm] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  const filterStatus = [
    { title: "All", href: "/admin/user" },
    { title: "Active", href: "/admin/user?status=Active" },
    { title: "Banned", href: "/admin/user?status=Banned" },
  ];

  const selectedRoleList = [
    { lable: "Customer", value: "Customer" },
    { lable: "Admin", value: "Admin" },
  ];

  const selectedStatusList = [
    { label: "Active", value: "Active" },
    { label: "Banned", value: "Banned" },
  ];

  const totalPage = Math.ceil(totalCount / limit);

  const onPageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    if (searchTerm) {
      newParams.set("search", newParams.toString());
    }
    router.push(`?${newParams.toString()}`);
  };

  // const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   setSearchTerm(value);

  //   const newParams = new URLSearchParams(value);

  //   if (value) {
  //     newParams.set("search", newParams.toString());
  //   } else {
  //     newParams.delete("search");
  //   }

  //   newParams.set("page", "1");

  //   router.push(`?${newParams.toString()}`);
  // };

  const handleAdminRoleModal = (id: string, value: string) => {
    setSelectedUserId(id);
    setPendingRole(value as UserRole);
    setIsAdminUserRoleModal(true);
  };
  const handleAdminStatus = (id: string, value: string) => {
    setSelectedUserId(id);
    setPendingStatus(value as UserStatus);
    setIsAdminUserStatusModal(true);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex w-full justify-between">
            <Tabs value={status || "All"}>
              <TabsList className="grid grid-cols-3">
                {filterStatus.map((item, index) => (
                  <TabsTrigger key={index} value={item.title} asChild>
                    <Link href={item.href}>{item.title}</Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="relative">
              <Search
                className="text-muted-foreground absolute top-2.5 left-2"
                size={16}
              />
              <Input
                placeholder="Search products..."
                className="pl-8"
                // onChange={handleSearchTerm}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created date</TableHead>
                <TableHead className="text-center md:text-left">Role</TableHead>
                <TableHead className="text-center md:text-left">
                  Status
                </TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{formatDate(u.createdAt)}</TableCell>
                    <TableCell>
                      <Select
                        value={u.role}
                        onValueChange={(value) =>
                          handleAdminRoleModal(u.id, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedRoleList.map((status, index) => (
                            <SelectItem
                              key={index}
                              value={status.value}
                              disabled={u.status === status.value}
                            >
                              {status.lable}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={u.status}
                        onValueChange={(value) =>
                          handleAdminStatus(u.id, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedStatusList.map((role, index) => (
                            <SelectItem
                              key={index}
                              value={role.value}
                              disabled={u.status === role.value}
                            >
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell align="right">
                      {u.status === "Active" ? (
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/user/${u.id}`}>
                            <Eye size={4} />
                            <span className="hidden md:block">View</span>
                          </Link>
                        </Button>
                      ) : (
                        <Button variant="outline">
                          <Ban size={3} />
                          <span>Banned</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-muted-foreground h-40 text-center"
                  >
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div>
            <Paginaiton
              page={page}
              onPageChange={onPageChange}
              totalPage={totalPage}
            />
          </div>
        </CardContent>
      </Card>

      <AdminUserRoleModal
        onOpenChange={setIsAdminUserRoleModal}
        open={isAdminUserRoleModal}
        selected={pendingRole}
        userId={selctedUserId}
      />
      <AdminUserStatusModal
        onOpenChange={setIsAdminUserStatusModal}
        open={isAdminUserStatusModal}
        selected={pendingStatus}
        userId={selctedUserId}
      />
    </div>
  );
};

export default AdminUserList;
