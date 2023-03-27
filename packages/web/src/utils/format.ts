import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const formatTime = (date: string, form = "YYYY-MM-DD HH:mm:ss") => {
  return dayjs.utc(date).local().format(form);
};

// 格式化日期为可读的字符串
export const formatDateToRead = (
  date: string,
  form = "YYYY-MM-DD HH:mm:ss"
) => {
  const localDate = dayjs.utc(date).local();
  if (Math.abs(localDate.diff(new Date(), "day")) < 0) {
    return localDate.format(form);
  } else if (Math.abs(localDate.diff(new Date(), "year")) <= 1) {
    return localDate.format("MM-DD HH:mm:ss");
  } else {
    return localDate.format(form);
  }
};
