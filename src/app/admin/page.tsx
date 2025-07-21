import DashBoardContent from "@/features/dashboard/components/dashborad-content";
import DateRangePicker from "@/features/dashboard/components/date-range-picker";
import { getSaleData } from "@/features/dashboard/db/dashboard";
import dayjs from "@/lib/dayjs";

interface AdminPageProps {
  searchParams: Promise<{
    start?: string;
    end: string;
  }>;
}

const AdminPage = async ({ searchParams } : AdminPageProps) => {

  const { start , end } = await searchParams


  const startDate = start ||  dayjs().subtract(1, "month").format("YYYY-MM-DD"); // default ลดไป 1 m จาก ปัจจุบัน
  const endDate = end || dayjs().format("YYYY-MM-DD"); // ปัจจุบัน

  const saleData = await getSaleData({ from: startDate, to: endDate });
  
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div className="gap1 flex flex-col">
        <h2 className="text-2xl font-bold sm:text-3xl">Dashborad</h2>
        <p className="text-muted-foreground text-sm">
          Your store analytics and sale summay
        </p>
      </div>
      <DateRangePicker start={startDate} end={endDate} />
      <DashBoardContent data={saleData} />
    </div>
  );
};
export default AdminPage;
