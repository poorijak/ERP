export const formatPrice = (price: number) => {
  const newPrice = new Intl.NumberFormat("th-TH", {
    currency: "THB",
    style: "currency",
  });

  return newPrice.format(price)
};
