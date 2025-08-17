import { db } from "@/lib/db";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { getUserGlobalTag, getUserIdTag, revalidateUserCache } from "./cache";
import { updateUserProfileSchema } from "../schema/user";
import { deleteFromImageKit, uploadToImagekit } from "@/lib/imagekit";
import { authCheck } from "@/features/auths/db/auths";
import { canUpdateUser } from "../permission/user";
import { redirect } from "next/navigation";
import { UserRole, UserStatus } from "@prisma/client";

interface updateUserById {
  userId: string;
  profileImage: File;
  name: string;
  tel: string;
}

interface updateUserRole {
  userId: string;
  userRole: UserRole;
}
interface updateUserStatus {
  userId: string;
  userStatus: UserStatus;
}

interface updateData {
  name?: string | undefined;
  tel?: string | undefined;
  picture?: string | null;
  pictureId?: string | null;
}

export const getUserById = async (id: string) => {
  "use cache";

  cacheLife("hours");
  cacheTag(getUserIdTag(id));
  try {
    const user = await db.user.findUnique({
      where: { id, status: "Active" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        picture: true,
        tel: true,
        createdAt: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error getting user by id:", error);
    return null;
  }
};

export const getUserWihtAddressById = async (userId: string) => {
  "use cache";

  cacheLife("hours");
  cacheTag(getUserIdTag(userId));

  try {
    return await db.user.findUnique({
      where: {
        id: userId,
      },
      include: { address: true },
    });
  } catch (error) {
    console.error("Error getting user with address", error);
    return null;
  }
};

export const getUserAll = async (
  status?: UserStatus,
  page: number,
  limit: number,
  // search: string,
) => {
  "use cache";

  cacheLife("hours");
  cacheTag(getUserGlobalTag());

  // const cleanSearch = (search ?? "").trim();
  // const hasSearch = cleanSearch !== "" && cleanSearch !== "s=";

  // // เงื่อนไขพื้นฐาน
  // const baseWhere: Prisma.UserWhereInput = {
  //   ...(status ? { status } : {}),
  //   ...(hasSearch
  //     ? {
  //         OR: [
  //           { name: { contains: cleanSearch, mode: "insensitive" } },
  //           { email: { contains: cleanSearch, mode: "insensitive" } },
  //           // เติมฟิลด์อื่นที่อยากให้ค้นหาได้ เช่น phone, username ฯลฯ
  //         ],
  //       }
  //     : {}),
  // };

  const skip = (page - 1) * limit;

  try {
    const [user, totalUser, activeUserCount, bannedUserCount] =
      await Promise.all([
        db.user.findMany({
          skip,
          take: limit,
          where: status ? { status } : {},
          orderBy: { createdAt: "desc" },
        }),
        db.user.count(),
        db.user.count({ where: { status: "Active" } }),
        db.user.count({ where: { status: "Banned" } }),
      ]);

    return {
      user,
      totalUser,
      activeUserCount,
      bannedUserCount,
    };
  } catch (error) {
    console.error("Error getting all user", error);
    return { user: [], totalUser: 0, activeUserCount: 0, bannedUserCount: 0 };
  }
};

export const updateUserProfile = async (input: updateUserById) => {
  const user = await authCheck();

  if (!user || !canUpdateUser(user)) {
    redirect("/auth/signin");
  }
  try {
    const { data, error, success } = updateUserProfileSchema.safeParse(input);

    if (!success) {
      console.log(error.flatten().fieldErrors);

      return {
        message: "Please enter valid user infomation",
        error: error.flatten().fieldErrors,
      };
    }

    const user = await db.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      return {
        message: "ไม่พบบัญชี",
      };
    }

    const [existingUsername, existingTel] = await Promise.all([
      db.user.findFirst({
        where: { name: data.name, id: { not: input.userId } },
      }),
      db.user.findFirst({
        where: { tel: data.tel, id: { not: input.userId } },
      }),
    ]);

    if (existingUsername) {
      console.log("Existing user");

      return {
        message: "พบชื่อผู้ใช้ซ้ำ",
      };
    }

    if (existingTel) {
      console.log("Existing tel");

      return {
        message: "มีเบอร์โทรศัพท์นี้อยู่ในระบบแล้ว",
      };
    }

    let uploadResult = null; // ต้องเป็น let เพระว่าเราจะเปลี่ยนค่าใน var ตอนหลัง ประกาศเอาไว้ข้างนอกเพื่อทำการเรียกใช้ได้

    // สร้าง obj ในการกับค่าที่เข้ามาจาก input โดยจะมีการเพิ่มค่าเมื่อมี profileImage
    const updateData: updateData = {};

    if (data.name) {
      updateData.name = data.name;
    }

    if (data.tel) {
      updateData.tel = data.tel;
    }

    if (input.profileImage && input.profileImage.size > 0) {
      // try อันนี้เอาไว้ใช้ดัก error ของ deleteFormImagekit
      try {
        // เช็คถ้ามีรูปใน ให้ลบออกก่อน
        if (user.pictureId) {
          const results = await deleteFromImageKit(user.pictureId);

          if (
            results?.message?.includes("not found") ||
            results?.message?.includes("not exist")
          ) {
            console.warn("ไฟล์เดิมไม่พบใน ImageKit แล้ว");
          }
        }
      } catch (error) {
        console.warn("เกิดข้อผิดพลาดขณะลบรูปเดิม:", error);
      }

      uploadResult = await uploadToImagekit(input.profileImage, "user-profile");

      // เข็คค uploadResult
      if (!uploadResult || uploadResult.message) {
        return {
          message: "อัพโหลดรูปไม่สำเร็จ",
        };
      }
    }

    // เช็คว่า uploadResults มีค่า แสดงว่ามีการ uploadImage เข้ามา
    if (uploadResult) {
      updateData.picture = uploadResult.url;
      updateData.pictureId = uploadResult.fileId;
    }

    // กันว่าถ้า key ใน obj ไม่มีอะไรเลยก็จบ function

    if (Object.keys(updateData).length === 0) {
      return;
    }

    await db.user.update({
      where: { id: input.userId },
      data: updateData,
    });

    revalidateUserCache(input.userId);
  } catch (error) {
    console.error("Error updating user", error);
    return {
      message: "something went wrong. Please try again later",
    };
  }
};

export const updateUserRole = async (input: updateUserRole) => {
  try {
    const user = await db.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      return {
        message: "ไม่พบผู้ใช้",
      };
    }

    if (!Object.values(UserRole).includes(input.userRole)) {
      return {
        message: "บทบาทไม่ถูกต้อง",
      };
    }
    await db.user.update({
      where: { id: input.userId },
      data: { role: input.userRole },
    });

    revalidateUserCache(user.id);
  } catch (error) {
    console.error("Error updating user role ", error);
    return {
      message: "เกิดข้อผิดพลาดในการอัปเดตผู้ใช้",
    };
  }
};

export const udpadaetUserStatus = async (input: updateUserStatus) => {
  try {
    const user = await db.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      return {
        message: "ไม่พบผู้ใช้",
      };
    }

    if (!Object.values(UserStatus).includes(input.userStatus)) {
      return {
        message: "บทบาทไม่ถูกต้อง",
      };
    }

    await db.user.update({
      where: { id: input.userId },
      data: {
        status: input.userStatus,
      },
    });

    revalidateUserCache(user.id);
  } catch (error) {
    console.error("Error updating user status", error);
    return {
      message: "เกิดข้อผิดพลาดในการอัตเดตสถานะผู้ใช้",
    };
  }
};
