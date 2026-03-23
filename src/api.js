// API utilities for Tappd

export async function analyzeReceipt(imageData) {
  try {
    // Remove the data URL prefix to get base64 data
    const base64Data = imageData.split(',')[1];
    
    const response = await fetch('https://router.requesty.ai/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_REQUESTY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this receipt image and extract the following information in JSON format. Pay special attention to detecting the correct currency from symbols, text, and context:

{
  "merchant": "merchant name",
  "date": "YYYY-MM-DD",
  "items": [
    {"name": "item name", "price": 0.00}
  ],
  "subtotal": 0.00,
  "tax": 0.00,
  "total": 0.00,
  "currency": "3-letter currency code (USD, EUR, GBP, JPY, etc.)",
  "category": "food|shopping|travel|entertainment|health|transport|bills|other"
}

Currency detection guidelines:
- Look for currency symbols: $, €, £, ¥, ₹, ₩, ₪, ₫, ₱, ₿, etc.
- Check for currency codes: USD, EUR, GBP, JPY, CAD, AUD, etc.
- Consider the merchant name and location context
- If multiple currencies appear, use the one that matches the total amount
- Default to USD if uncertain

Only return the JSON object, no other text. If you cannot find certain fields, use null or reasonable estimates. The category should be based on the merchant type.`
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: base64Data
                }
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();
    const content = result.content[0].text;
    
    // Parse JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from API response');
    }
    
    const extractedData = JSON.parse(jsonMatch[0]);
    
    // Validate and normalize currency
    if (!extractedData.currency || !extractedData.currency.match(/^[A-Z]{3}$/)) {
      extractedData.currency = 'USD';
    }
    
    return extractedData;
  } catch (error) {
    console.error('Error analyzing receipt:', error);
    throw error;
  }
}

export async function askAIAboutSpending(question, receiptsData) {
  try {
    const response = await fetch('https://router.requesty.ai/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_REQUESTY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: `You are a helpful spending assistant. Here's the user's spending data:

${JSON.stringify(receiptsData, null, 2)}

Answer this question about their spending: "${question}"

Be helpful, conversational, and specific. If the question can't be answered with the data, say so politely. When mentioning amounts, always include the currency symbol and code for clarity.`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();
    return result.content[0].text;
  } catch (error) {
    console.error('Error asking AI:', error);
    throw error;
  }
}

export async function getExchangeRates(baseCurrency = 'USD') {
  try {
    const response = await fetch(`https://open.exchangerate-api.com/v6/latest/${baseCurrency}`);
    
    if (!response.ok) {
      throw new Error(`Exchange rate API failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.error('Error getting exchange rates:', error);
    throw error;
  }
}

export function convertCurrency(amount, fromCurrency, toCurrency, rates) {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to USD first, then to target currency
  const usdAmount = fromCurrency === 'USD' ? amount : amount / rates[fromCurrency];
  const convertedAmount = toCurrency === 'USD' ? usdAmount : usdAmount * rates[toCurrency];
  
  return Math.round(convertedAmount * 100) / 100;
}

// Enhanced currency conversion with fallback rates
export async function convertCurrencyWithFallback(amount, fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return amount;
  
  try {
    const rates = await getExchangeRates('USD');
    return convertCurrency(amount, fromCurrency, toCurrency, rates);
  } catch (error) {
    console.error('Error converting currency, using fallback rates:', error);
    
    // Fallback rates (approximate, should be updated periodically)
    const fallbackRates = {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110.0,
      CAD: 1.25,
      AUD: 1.35,
      CHF: 0.92,
      CNY: 6.45,
      INR: 74.0,
      KRW: 1180.0,
      MXN: 20.0,
      BRL: 5.2,
      RUB: 74.0,
      TRY: 8.5,
      ZAR: 15.0,
      SGD: 1.35,
      HKD: 7.8,
      THB: 32.0,
      MYR: 4.2,
      IDR: 14000.0,
      PHP: 50.0,
      VND: 23000.0,
      NOK: 8.5,
      SEK: 8.7,
      DKK: 6.3,
      PLN: 3.9,
      CZK: 21.5,
      HUF: 310.0,
      RON: 4.0,
      BGN: 1.65,
      HRK: 6.3,
      ILS: 3.2,
      SAR: 3.75,
      AED: 3.67,
      QAR: 3.64,
      KWD: 0.30,
      BHD: 0.38,
      OMR: 0.38,
      NGN: 410.0,
      EGP: 15.7,
      KES: 110.0,
      GHS: 6.0,
      UGX: 3600.0,
      TZS: 2300.0,
      RWF: 1000.0,
      JMD: 150.0,
      TTD: 6.7,
      BBD: 2.0,
      BZD: 2.0,
      XCD: 2.7,
      NZD: 1.4,
      FJD: 2.1,
      PGK: 3.5,
      SBD: 8.0,
      VUV: 110.0,
      WST: 2.6,
      TOP: 2.3,
      KID: 1.3,
      ARS: 98.0,
      CLP: 800.0,
      COP: 3800.0,
      PEN: 4.0,
      TWD: 28.0,
      LBP: 1500.0,
      IQD: 1460.0,
      JOD: 0.71,
      LKR: 200.0,
      MMK: 1800.0,
      NPR: 120.0,
      PKR: 160.0,
      LAK: 10000.0,
      KHR: 4100.0,
      MVR: 15.5,
      BTN: 74.0,
      AFN: 85.0,
      AMD: 480.0,
      AZN: 1.7,
      GEL: 3.2,
      KZT: 430.0,
      KGS: 85.0,
      TJS: 11.0,
      TMT: 3.4,
      UZS: 10700.0,
      BYN: 2.6,
      MDL: 17.5,
      RSD: 100.0,
      MKD: 55.0,
      BAM: 1.7,
      ALL: 100.0,
      MKD: 55.0,
      RON: 4.0,
      BGN: 1.65,
      HRK: 6.3,
      RSD: 100.0,
      MKD: 55.0,
      BAM: 1.7,
      ALL: 100.0,
    };
    
    return convertCurrency(amount, fromCurrency, toCurrency, fallbackRates);
  }
}
