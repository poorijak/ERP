export const generatePromptPayQR = (amount: number) => {
  try {
    const promptPayId = process.env.NEXT_PUBLIC_PROMPTPAY_ID;
    const formattedAmount = amount.toFixed(2);

    const qrcodeDataUrl = `https://promptpay.io/${promptPayId}/${formattedAmount}`;

    return qrcodeDataUrl;
  } catch (error) {
    console.error("Error generating PromptPay QR : ", error);
    throw new Error("ไม่สามารถสร้าง QR Code ได้");
  }
};

