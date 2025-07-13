export const generateOrderNumber = () => {
  const prefix = "ORD";
  const timeStamp = new Date().getTime().toString().substring(3, 10);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `${prefix}${timeStamp}${random}`;
};
