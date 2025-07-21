"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDateToYMD } from "@/lib/formatDate";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import dayjs from "@/lib/dayjs";
import { CalendarIcon } from "lucide-react";

interface DateRangePicker {
  start: string;
  end: string;
}

const DateRangePicker = ({ start, end }: DateRangePicker) => {
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const searchParams = useSearchParams();
  // 
  const router = useRouter();

  const startDate = new Date(start);
  const endDate = new Date(end);

  const handleSelect = (
    type: "start" | "end",
    selectedDate: Date | undefined,
  ) => {
    if (selectedDate) {
      const newParams = new URLSearchParams(searchParams);
      const value = dayjs(selectedDate).format("YYYY-MM-DD");
      newParams.set(type, value);
      router.push(`/admin?${newParams.toString()}`);
    }
    if (type === 'start') {
        setOpenStart(false)
    } else {
        setOpenEnd(false)
    }
  };

  return (
    <div className="mb-2 flex flex-col gap-4 md:mb-6">
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground font-normal">Start</Label>
          <Popover open={openStart} onOpenChange={setOpenStart}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="flex w-48 items-center justify-between"
              >
                {formatDateToYMD(startDate)}
                <CalendarIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                captionLayout="dropdown"
                mode="single"
                selected={startDate}
                hidden={{ after : endDate }} // ซ้อนวันที่มากกว่า endDate
                onSelect={(selectedDate) => { 
                  handleSelect("start", selectedDate);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground font-normal">End</Label>
          <Popover open={openEnd} onOpenChange={setOpenEnd}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="flex w-48 items-center justify-between"
              >
                {formatDateToYMD(endDate)}
                <CalendarIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                captionLayout="dropdown"
                mode="single"
                selected={endDate}
                onSelect={(selectedDate) => handleSelect("end", selectedDate)}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
