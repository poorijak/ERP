import { authCheck } from "@/features/auths/db/auths";
import { redirect } from "next/navigation";
import dayjs from "@/lib/dayjs";
import { db } from "@/lib/db";

interface DateRangeParas {
  from: string;
  to: string;
}

interface dailyDataRecord {
  [key: string]: {
    date: string;
    revenue: number;
    cost: number;
    profit: number;
  };
}

// รับเป็น object key from , to 
export const getSaleData = async ({ from, to }: DateRangeParas) => {
  const user = await authCheck();

  if (!user || user.role !== "Admin") {
    redirect("/");
  }

  try {
    // format วันตาม input
    const startDate = dayjs(from).startOf("day").format();
    const endDate = dayjs(to).endOf("day").format();

    const order = await db.order.findMany({
      where: {
        createdAt: {
          gte: startDate, // เริ่มตั้งแต่ (>=)
          lte: endDate, // จนถึง (<=)
        },
      },
      include: {
        items: {
          include: { product: true }, // เอามาเพื่อคำนวณ
        },
      },
    });

    const dailyData: dailyDataRecord = {};

    order.forEach((order) => {
      const date = dayjs(order.createdAt).format("YYYY-MM-DD");

      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          revenue: 0,
          cost: 0,
          profit: 0,
        };
      }

      const revenue = order.totalAmount;
      const cost = order.items.reduce(
        (sum, item) => sum + item.product.cost * item.quantity,
        0,
      );
      const profit = revenue - cost;

      dailyData[date].revenue += revenue;
      dailyData[date].cost += cost;
      dailyData[date].profit += profit;
    });

    const totalDay = dayjs(endDate).diff(startDate, "day") + 1;

    for (let i = 0; i < totalDay; i++) {
      const date = dayjs(startDate).add(i, "day").format("YYYY-MM-DD");

      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          revenue: 0,
          cost: 0,
          profit: 0,
        };
      }
    }

    // เข้าถึงค่า value แล้ว
    const dailyDataSort = Object.values(dailyData).sort((a, b) =>
      a.date.localeCompare(b.date),
    );
    return dailyDataSort; // ส่งออกไปเป็นแค่ value ของ obj ไม่ได้ส่งเป็น key : value
  } catch (error) {
    console.error("Error getting sale data : ", error);
    return [];
  }
};
