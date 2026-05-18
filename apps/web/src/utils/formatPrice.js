const bengaliDigits = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export const convertToBengaliNumerals = (str) => {
  if (str == null || str === '') return '';
  return str.toString().replace(/[0-9]/g, (w) => bengaliDigits[w]);
};

/**
 * Bangladesh Taka (BDT) — used everywhere (storefront + admin).
 * Examples: ৳ 1,200  |  ৳ ১,২০০
 */
export const formatPrice = (price, language = 'bn') => {
  const numPrice = Number(price);
  if (!Number.isFinite(numPrice)) {
    return '৳ 0';
  }

  const hasDecimals = Math.abs(numPrice % 1) > 0.001;
  const locale = language?.startsWith('bn') ? 'bn-BD' : 'en-BD';

  let formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(numPrice);

  if (language?.startsWith('bn')) {
    formatted = convertToBengaliNumerals(formatted);
  }

  return `৳ ${formatted}`;
};

/** Taka symbol for admin input adornments. */
export const BDT_SYMBOL = '৳';
