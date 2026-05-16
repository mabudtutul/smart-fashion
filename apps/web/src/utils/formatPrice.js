const bengaliDigits = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

export const convertToBengaliNumerals = (str) => {
  if (!str) return '';
  return str.toString().replace(/[0-9]/g, (w) => bengaliDigits[w]);
};

export const formatPrice = (price, language = 'en') => {
  const numPrice = Number(price) || 0;
  const fixedPrice = numPrice.toFixed(2);

  if (language.startsWith('bn')) {
    return `৳${convertToBengaliNumerals(fixedPrice)}`;
  }

  // Default to English format
  return `₹${fixedPrice}`;
};