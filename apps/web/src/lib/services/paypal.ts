import {
  CheckoutPaymentIntent,
  Client,
  Environment,
  LogLevel,
  OrdersController,
} from "@paypal/paypal-server-sdk";

const clientId = process.env.PAYPAL_CLIENT_ID || "";
const clientSecret = process.env.PAYPAL_CLIENT_SECRET || "";

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: clientId,
    oAuthClientSecret: clientSecret,
  },
  timeout: 0,
  environment: Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: { logBody: true },
    logResponse: { logHeaders: true },
  },
});

const ordersController = new OrdersController(client);

export const COIN_CONVERSION_RATE = 100; // 1 EUR = 100 Coins

export async function createOrder(coins: number) {
  const amount = (coins / COIN_CONVERSION_RATE).toFixed(2);
  
  const { body } = await ordersController.createOrder({
    body: {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [
        {
          amount: {
            currencyCode: "EUR",
            value: amount,
          },
          description: `Purchase of ${coins} NextCase Coins`,
        },
      ],
    },
  });

  return body;
}

export async function captureOrder(orderId: string) {
  const { body } = await ordersController.captureOrder({
    id: orderId,
  });

  return body;
}
