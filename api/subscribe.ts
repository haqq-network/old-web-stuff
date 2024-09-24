import { ipAddress } from "@vercel/edge";
import { FALCONER_ENDPOINT } from "../const";

interface SubscribeRequest {
  email: string;
  ip: string;
  domain: "haqq.network";
  captcha_token: string;
}

interface SubscribeResponse {
  status: number;
  error?: string;
}

export const config = {
  runtime: "edge",
};

export async function POST(request: Request) {
  const ip = ipAddress(request) || "unknown";
  const { email, token }: Record<string, string> = await request.json();
  const subscribeRequest: SubscribeRequest = {
    domain: "haqq.network",
    ip,
    email,
    captcha_token: token,
  };
  const subscribeUrl = new URL("/email/subscribe", FALCONER_ENDPOINT);
  const subscribeResponse = await fetch(subscribeUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscribeRequest),
  });
  const subscribeResponseJson: SubscribeResponse =
    await subscribeResponse.json();

  if (subscribeResponseJson.error) {
    return new Response(
      JSON.stringify({
        error: subscribeResponseJson.error,
      }),
      { status: 400 }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Subscription successful",
    }),
    { status: 200 }
  );
}
