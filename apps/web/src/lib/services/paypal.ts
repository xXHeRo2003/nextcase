import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

export const COIN_CONVERSION_RATE = 100; // 100 coins per 1 USD

function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID || '';
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';

  if (process.env.NODE_ENV === 'production') {
    return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
  }
  return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

export function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

/**
 * Creates a PayPal order for a specific amount of coins.
 * @param coins The number of NextCase Coins to purchase.
 * @returns The PayPal order result.
 */
export async function createOrder(coins: number) {
  const amount = (coins / COIN_CONVERSION_RATE).toFixed(2);
  
  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: amount
      }
    }]
  });

  const response = await client().execute(request);
  return response.result;
}

/**
 * Captures a PayPal order by its ID.
 * @param orderId The PayPal order ID to capture.
 * @returns The PayPal capture result.
 */
export async function captureOrder(orderId: string) {
  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
  // @ts-ignore - PayPal SDK types are sometimes overly restrictive for empty body
  request.requestBody({});

  const response = await client().execute(request);
  return response.result;
}
