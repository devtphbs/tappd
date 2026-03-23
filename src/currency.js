// Currency utilities for Tappd

export const ALL_CURRENCIES = {
  // Major currencies
  USD: { name: 'US Dollar', symbol: '$', code: 'USD' },
  EUR: { name: 'Euro', symbol: '€', code: 'EUR' },
  GBP: { name: 'British Pound', symbol: '£', code: 'GBP' },
  JPY: { name: 'Japanese Yen', symbol: '¥', code: 'JPY' },
  CNY: { name: 'Chinese Yuan', symbol: '¥', code: 'CNY' },
  INR: { name: 'Indian Rupee', symbol: '₹', code: 'INR' },
  
  // Americas
  CAD: { name: 'Canadian Dollar', symbol: 'C$', code: 'CAD' },
  AUD: { name: 'Australian Dollar', symbol: 'A$', code: 'AUD' },
  NZD: { name: 'New Zealand Dollar', symbol: 'NZ$', code: 'NZD' },
  MXN: { name: 'Mexican Peso', symbol: '$', code: 'MXN' },
  BRL: { name: 'Brazilian Real', symbol: 'R$', code: 'BRL' },
  ARS: { name: 'Argentine Peso', symbol: '$', code: 'ARS' },
  CLP: { name: 'Chilean Peso', symbol: '$', code: 'CLP' },
  COP: { name: 'Colombian Peso', symbol: '$', code: 'COP' },
  PEN: { name: 'Peruvian Sol', symbol: 'S/', code: 'PEN' },
  
  // Europe
  CHF: { name: 'Swiss Franc', symbol: 'CHF', code: 'CHF' },
  NOK: { name: 'Norwegian Krone', symbol: 'kr', code: 'NOK' },
  SEK: { name: 'Swedish Krona', symbol: 'kr', code: 'SEK' },
  DKK: { name: 'Danish Krone', symbol: 'kr', code: 'DKK' },
  PLN: { name: 'Polish Złoty', symbol: 'zł', code: 'PLN' },
  CZK: { name: 'Czech Koruna', symbol: 'Kč', code: 'CZK' },
  HUF: { name: 'Hungarian Forint', symbol: 'Ft', code: 'HUF' },
  RON: { name: 'Romanian Leu', symbol: 'lei', code: 'RON' },
  BGN: { name: 'Bulgarian Lev', symbol: 'лв', code: 'BGN' },
  HRK: { name: 'Croatian Kuna', symbol: 'kn', code: 'HRK' },
  
  // Asia Pacific
  KRW: { name: 'South Korean Won', symbol: '₩', code: 'KRW' },
  HKD: { name: 'Hong Kong Dollar', symbol: 'HK$', code: 'HKD' },
  SGD: { name: 'Singapore Dollar', symbol: 'S$', code: 'SGD' },
  THB: { name: 'Thai Baht', symbol: '฿', code: 'THB' },
  MYR: { name: 'Malaysian Ringgit', symbol: 'RM', code: 'MYR' },
  IDR: { name: 'Indonesian Rupiah', symbol: 'Rp', code: 'IDR' },
  PHP: { name: 'Philippine Peso', symbol: '₱', code: 'PHP' },
  VND: { name: 'Vietnamese Dong', symbol: '₫', code: 'VND' },
  TWD: { name: 'Taiwan Dollar', symbol: 'NT$', code: 'TWD' },
  
  // Middle East & Africa
  ZAR: { name: 'South African Rand', symbol: 'R', code: 'ZAR' },
  NGN: { name: 'Nigerian Naira', symbol: '₦', code: 'NGN' },
  EGP: { name: 'Egyptian Pound', symbol: '£', code: 'EGP' },
  ILS: { name: 'Israeli Shekel', symbol: '₪', code: 'ILS' },
  SAR: { name: 'Saudi Riyal', symbol: 'SR', code: 'SAR' },
  AED: { name: 'UAE Dirham', symbol: 'د.إ', code: 'AED' },
  QAR: { name: 'Qatari Riyal', symbol: 'QR', code: 'QAR' },
  KWD: { name: 'Kuwaiti Dinar', symbol: 'KD', code: 'KWD' },
  BHD: { name: 'Bahraini Dinar', symbol: 'BD', code: 'BHD' },
  OMR: { name: 'Omani Rial', symbol: 'ر.ع.', code: 'OMR' },
  
  // Other
  RUB: { name: 'Russian Ruble', symbol: '₽', code: 'RUB' },
  TRY: { name: 'Turkish Lira', symbol: '₺', code: 'TRY' },
  ZMW: { name: 'Zambian Kwacha', symbol: 'ZK', code: 'ZMW' },
  GHS: { name: 'Ghanaian Cedi', symbol: 'GH₵', code: 'GHS' },
  KES: { name: 'Kenyan Shilling', symbol: 'KSh', code: 'KES' },
  UGX: { name: 'Ugandan Shilling', symbol: 'USh', code: 'UGX' },
  TZS: { name: 'Tanzanian Shilling', symbol: 'TSh', code: 'TZS' },
  RWF: { name: 'Rwandan Franc', symbol: 'RWF', code: 'RWF' },
  BIF: { name: 'Burundian Franc', symbol: 'FBu', code: 'BIF' },
  DJF: { name: 'Djiboutian Franc', symbol: 'Fdj', code: 'DJF' },
  ETB: { name: 'Ethiopian Birr', symbol: 'Br', code: 'ETB' },
  SDG: { name: 'Sudanese Pound', symbol: 'ج.س.', code: 'SDG' },
  LYD: { name: 'Libyan Dinar', symbol: 'LD', code: 'LYD' },
  TND: { name: 'Tunisian Dinar', symbol: 'DT', code: 'TND' },
  DZD: { name: 'Algerian Dinar', symbol: 'دج', code: 'DZD' },
  MAD: { name: 'Moroccan Dirham', symbol: 'د.م.', code: 'MAD' },
  
  // Caribbean
  JMD: { name: 'Jamaican Dollar', symbol: 'J$', code: 'JMD' },
  TTd: { name: 'Trinidad & Tobago Dollar', symbol: 'TT$', code: 'TTD' },
  BBD: { name: 'Barbadian Dollar', symbol: 'Bds$', code: 'BBD' },
  BZD: { name: 'Belize Dollar', symbol: 'BZ$', code: 'BZD' },
  XCD: { name: 'Eastern Caribbean Dollar', symbol: 'EC$', code: 'XCD' },
  
  // Pacific Islands
  FJD: { name: 'Fijian Dollar', symbol: 'FJ$', code: 'FJD' },
  PGK: { name: 'Papua New Guinea Kina', symbol: 'K', code: 'PGK' },
  SBD: { name: 'Solomon Islands Dollar', symbol: 'SI$', code: 'SBD' },
  VUV: { name: 'Vanuatu Vatu', symbol: 'VT', code: 'VUV' },
  WST: { name: 'Samoan Tālā', symbol: 'WS$', code: 'WST' },
  TOP: { name: 'Tongan Paʻanga', symbol: 'T$', code: 'TOP' },
  KID: { name: 'Kiribati Dollar', symbol: '$', code: 'KID' },
  
  // Cryptocurrencies (for future use)
  BTC: { name: 'Bitcoin', symbol: '₿', code: 'BTC' },
  ETH: { name: 'Ethereum', symbol: 'Ξ', code: 'ETH' },
};

export function detectCurrencyFromText(text) {
  const currencyPatterns = {
    // Dollar symbols
    USD: /\$(?!\d+\.\d{2}\s?[A-Z]{3})|\bUSD\b|\bUS\s?\$/i,
    CAD: /\bC?\$|\bCAD\b|\bCAN\s?\$/i,
    AUD: /\bA?\$|\bAUD\b|\bAU\s?\$/i,
    NZD: /\bNZ?\$|\bNZD\b|\bNZ\s?\$/i,
    HKD: /\bHK?\$|\bHKD\b|\bHK\s?\$/i,
    SGD: /\bS?\$|\bSGD\b|\bSG\s?\$/i,
    FJD: /\bFJ?\$|\bFJD\b|\bFJ\s?\$/i,
    
    // Euro
    EUR: /€|\bEUR\b/i,
    
    // Pound
    GBP: /£|\bGBP\b|\b£\s?GBP/i,
    
    // Yen/Yuan
    JPY: /¥|\bJPY\b|\bJP\s?¥/i,
    CNY: /¥|\bCNY\b|\bCN\s?¥/i,
    
    // Other Asian currencies
    KRW: /₩|\bKRW\b|\bKR\s?₩/i,
    INR: /₹|\bINR\b|\bRS\b/i,
    THB: /฿|\bTHB\b/i,
    VND: /₫|\bVND\b/i,
    PHP: /₱|\bPHP\b/i,
    MYR: /RM|\bMYR\b/i,
    IDR: /Rp|\bIDR\b/i,
    TWD: /NT\$/i,
    
    // European currencies
    CHF: /CHF|\bSwiss\s?Franc/i,
    NOK: /kr\s?NOK|\bNOK\b/i,
    SEK: /kr\s?SEK|\bSEK\b/i,
    DKK: /kr\s?DKK|\bDKK\b/i,
    PLN: /zł|\bPLN\b/i,
    CZK: /Kč|\bCZK\b/i,
    HUF: /Ft|\bHUF\b/i,
    RON: /lei|\bRON\b/i,
    BGN: /лв|\bBGN\b/i,
    HRK: /kn|\bHRK\b/i,
    
    // Middle Eastern currencies
    ILS: /₪|\bILS\b/i,
    SAR: /SR|\bSAR\b/i,
    AED: /د\.إ|\bAED\b/i,
    QAR: /QR|\bQAR\b/i,
    KWD: /KD|\bKWD\b/i,
    BHD: /BD|\bBHD\b/i,
    OMR: /ر\.ع\.|\bOMR\b/i,
    
    // African currencies
    ZAR: /R|\bZAR\b/i,
    NGN: /₦|\bNGN\b/i,
    EGP: /£|\bEGP\b/i,
    KES: /KSh|\bKES\b/i,
    GHS: /GH₵|\bGHS\b/i,
    UGX: /USh|\bUGX\b/i,
    TZS: /TSh|\bTZS\b/i,
    RWF: /RWF|\bRWF\b/i,
    
    // Americas
    MXN: /\$\s?MXN|\bMXN\b/i,
    BRL: /R\$|\bBRL\b/i,
    ARS: /\$\s?ARS|\bARS\b/i,
    CLP: /\$\s?CLP|\bCLP\b/i,
    COP: /\$\s?COP|\bCOP\b/i,
    PEN: /S\/|\bPEN\b/i,
    JMD: /J\$|\bJMD\b/i,
    TTD: /TT\$|\bTTD\b/i,
    BBD: /Bds\$|\bBBD\b/i,
    BZD: /BZ\$|\bBZD\b/i,
    XCD: /EC\$|\bXCD\b/i,
    
    // Other
    RUB: /₽|\bRUB\b/i,
    TRY: /₺|\bTRY\b/i,
    
    // Cryptocurrencies
    BTC: /₿|\bBTC\b/i,
    ETH: /Ξ|\bETH\b/i,
  };

  for (const [currency, pattern] of Object.entries(currencyPatterns)) {
    if (pattern.test(text)) {
      return currency;
    }
  }

  // Default to USD if no currency detected
  return 'USD';
}

export async function getUserLocationCurrency() {
  try {
    // Get user's timezone to infer country
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Map common timezones to currencies
    const timezoneToCurrency = {
      'America/New_York': 'USD',
      'America/Chicago': 'USD',
      'America/Denver': 'USD',
      'America/Los_Angeles': 'USD',
      'America/Toronto': 'CAD',
      'America/Vancouver': 'CAD',
      'America/Montreal': 'CAD',
      'America/Sao_Paulo': 'BRL',
      'America/Mexico_City': 'MXN',
      'America/Argentina/Buenos_Aires': 'ARS',
      'Europe/London': 'GBP',
      'Europe/Paris': 'EUR',
      'Europe/Berlin': 'EUR',
      'Europe/Rome': 'EUR',
      'Europe/Madrid': 'EUR',
      'Europe/Amsterdam': 'EUR',
      'Europe/Brussels': 'EUR',
      'Europe/Vienna': 'EUR',
      'Europe/Zurich': 'CHF',
      'Europe/Oslo': 'NOK',
      'Europe/Stockholm': 'SEK',
      'Europe/Copenhagen': 'DKK',
      'Europe/Warsaw': 'PLN',
      'Europe/Prague': 'CZK',
      'Europe/Budapest': 'HUF',
      'Europe/Bucharest': 'RON',
      'Europe/Sofia': 'BGN',
      'Europe/Zagreb': 'HRK',
      'Asia/Tokyo': 'JPY',
      'Asia/Shanghai': 'CNY',
      'Asia/Hong_Kong': 'HKD',
      'Asia/Seoul': 'KRW',
      'Asia/Singapore': 'SGD',
      'Asia/Bangkok': 'THB',
      'Asia/Jakarta': 'IDR',
      'Asia/Manila': 'PHP',
      'Asia/Kuala_Lumpur': 'MYR',
      'Asia/Taipei': 'TWD',
      'Asia/Mumbai': 'INR',
      'Asia/Dubai': 'AED',
      'Asia/Riyadh': 'SAR',
      'Asia/Qatar': 'QAR',
      'Asia/Kuwait': 'KWD',
      'Asia/Bahrain': 'BHD',
      'Asia/Muscat': 'OMR',
      'Africa/Johannesburg': 'ZAR',
      'Africa/Lagos': 'NGN',
      'Africa/Cairo': 'EGP',
      'Africa/Nairobi': 'KES',
      'Africa/Accra': 'GHS',
      'Africa/Kampala': 'UGX',
      'Africa/Dar_es_Salaam': 'TZS',
      'Africa/Kigali': 'RWF',
      'Australia/Sydney': 'AUD',
      'Australia/Melbourne': 'AUD',
      'Australia/Brisbane': 'AUD',
      'Australia/Perth': 'AUD',
      'Pacific/Auckland': 'NZD',
      'Pacific/Fiji': 'FJD',
    };

    return timezoneToCurrency[timezone] || 'USD';
  } catch (error) {
    console.error('Error detecting user currency:', error);
    return 'USD';
  }
}

export function formatCurrency(amount, currency = 'USD') {
  try {
    const currencyInfo = ALL_CURRENCIES[currency];
    if (!currencyInfo) {
      return `${currency} ${amount.toFixed(2)}`;
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'JPY' || currency === 'KRW' ? 0 : 2,
      maximumFractionDigits: currency === 'JPY' || currency === 'KRW' ? 0 : 2,
    }).format(amount);
  } catch (error) {
    // Fallback for unsupported currencies
    const currencyInfo = ALL_CURRENCIES[currency];
    const symbol = currencyInfo?.symbol || currency;
    return `${symbol} ${amount.toFixed(2)}`;
  }
}

export function getCurrencySelectOptions() {
  return Object.entries(ALL_CURRENCIES)
    .map(([code, info]) => ({
      value: code,
      label: `${info.symbol} ${info.name} (${code})`,
      group: getCurrencyGroup(code)
    }))
    .sort((a, b) => {
      if (a.group !== b.group) {
        return a.group.localeCompare(b.group);
      }
      return a.label.localeCompare(b.label);
    });
}

function getCurrencyGroup(currency) {
  if (['USD', 'CAD', 'AUD', 'NZD', 'HKD', 'SGD', 'FJD', 'JMD', 'TTD', 'BBD', 'BZD', 'XCD'].includes(currency)) return 'Americas & Pacific';
  if (['EUR', 'GBP', 'CHF', 'NOK', 'SEK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK'].includes(currency)) return 'Europe';
  if (['JPY', 'CNY', 'KRW', 'HKD', 'SGD', 'THB', 'VND', 'PHP', 'MYR', 'IDR', 'TWD', 'INR'].includes(currency)) return 'Asia Pacific';
  if (['ILS', 'SAR', 'AED', 'QAR', 'KWD', 'BHD', 'OMR'].includes(currency)) return 'Middle East';
  if (['ZAR', 'NGN', 'EGP', 'KES', 'GHS', 'UGX', 'TZS', 'RWF', 'BIF', 'DJF', 'ETB', 'SDG', 'LYD', 'TND', 'DZD', 'MAD'].includes(currency)) return 'Africa';
  if (['RUB', 'TRY'].includes(currency)) return 'Eastern Europe';
  if (['MXN', 'BRL', 'ARS', 'CLP', 'COP', 'PEN'].includes(currency)) return 'Latin America';
  if (['BTC', 'ETH'].includes(currency)) return 'Cryptocurrency';
  return 'Other';
}
