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
                text: `Analyze this receipt image and extract the following information in JSON format:
{
  "merchant": "merchant name",
  "date": "YYYY-MM-DD",
  "items": [
    {"name": "item name", "price": 0.00}
  ],
  "subtotal": 0.00,
  "tax": 0.00,
  "total": 0.00,
  "currency": "USD",
  "category": "food|shopping|travel|entertainment|health|transport|bills|other"
}

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
    
    return JSON.parse(jsonMatch[0]);
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

Be helpful, conversational, and specific. If the question can't be answered with the data, say so politely.`
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
