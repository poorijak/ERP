import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "../ui/pagination";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPage: number;
  onPageChange: (newPage: number) => void;
}

const Paginaiton = ({ page, totalPage, onPageChange  }: PaginationProps) => {
  const [isMobile, setIsMoblie] = useState(false);

  useEffect(() => {
    const hanldeResize = () => {
      setIsMoblie(window.innerWidth < 1024);
    };

    hanldeResize();

    window.addEventListener("resize", hanldeResize);
    return window.removeEventListener("resize", hanldeResize);
  }, []);

  const getPaginationPage = (
    currentPgae: number,
    totalPage : number,
    maxVisible: number,
  ) => {
    const range = [];

    let start = Math.max(1, currentPgae - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (start <= 1) start = 1;

    if (end > totalPage) {
      end = totalPage;
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  const maxVisible = isMobile ? 4 : 8;

  const pagePagination = getPaginationPage(page, totalPage , maxVisible);

  return (
    <Pagination>
      <PaginationContent className="flex justify-between gap-6">
        <Button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          variant="outline"
        >
          <ArrowLeft strokeWidth={2} />
          <span className="text-md hidden md:flex">Preverous</span>
        </Button>

        <PaginationItem>
          {pagePagination.map((item, i) => (
            <PaginationLink
              className={cn( page === item && "bg-primary text-white")}
              key={i}
              onClick={() => {
                if (typeof item === "number") {
                  onPageChange(item);
                } else if (typeof item === "string") {
                  // หลุดออกมาจากเงื่อนไขที่ item จะเป็น number
                  const prevItem = pagePagination[i - 1];
                  const nextItem = pagePagination[i + 1];

                  if (typeof prevItem === "number" && prevItem < page) {
                    onPageChange(page - 1);
                  } else if (typeof nextItem === "number" && nextItem > page) {
                    onPageChange(page + 1);
                  }
                }
              }}
            >
              {item}
            </PaginationLink>
          ))}
        </PaginationItem>
        <Button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPage}
          variant="outline"
          className="flex items-center"
        >
          <span className="text-md hidden md:flex">Next</span>
          <ArrowRight strokeWidth={2} />
        </Button>
      </PaginationContent>
    </Pagination>
  );
};

export default Paginaiton;
