"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DashBoardContentProps {
  //  ที่ประกาศเป็น array เพราะค่าที่ getSaleData return ออกมาเป็น [{...}] / array obj
  data: Array<{
    date: string;
    revenue: number;
    cost: number;
    profit: number;
  }>;
}

const DashBoardContent = ({ data }: DashBoardContentProps) => {

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Weekly sales for month</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer>
              <BarChart data={data}>
                {/* เข้าถึง date ของ data ที่ส่งเข้ามา */}
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{fontSize : 12}} />
                <Legend />
                <Tooltip/>
                


                <Bar dataKey="revenue" fill="#4F46E5" name="รายรับ"  barSize={50}/>
                <Bar dataKey="cost" fill="#E53E3E" name="ต้นทุน"  barSize={50}/>
                <Bar dataKey="profit" fill="#22C55e" name="กำไร"  barSize={50}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashBoardContent;
