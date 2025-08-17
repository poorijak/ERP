const formatPhoneNumber = (tel?: string) => {
  if (!tel) return;
  const cleanTel = tel.replace("/\D/g", "");

  if (cleanTel.length === 10) {
    return `${cleanTel.slice(0, 3)}-${cleanTel.slice(3, 6)}-${cleanTel.slice(6)}`;
  }

  return tel
};

export default formatPhoneNumber
