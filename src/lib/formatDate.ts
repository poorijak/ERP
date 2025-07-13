import dayjs from "@/lib/dayjs";

const formatDate = (date: Date | null | undefined) => {
  if (!date) {
    return "-";
  }

  return dayjs(date).format("DD/MM/YYYY HH:mm");
};

export default formatDate;

