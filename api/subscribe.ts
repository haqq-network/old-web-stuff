import { ipAddress } from "@vercel/edge";
import { ALLOWED_ORIGINS, FALCONER_ENDPOINT } from "../const";

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

function getCorsHeaders(origin: string) {
  if (ALLOWED_ORIGINS.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
    };
  }

  return null; // Explicitly return null for disallowed origins
}

export async function POST(request: Request) {
  const ip = ipAddress(request) || "unknown";
  const origin = request.headers.get("origin") || "";
  const corsHeaders = getCorsHeaders(origin);

  // Initialize responseHeaders early
  const responseHeaders = new Headers({
    "Content-Type": "application/json",
  });

  if (!corsHeaders) {
    // Return an error response if origin is not allowed
    return new Response(JSON.stringify({ error: "CORS origin not allowed." }), {
      status: 403,
      headers: responseHeaders,
    });
  }

  // Add CORS headers to responseHeaders
  Object.entries(corsHeaders).forEach(([key, value]) => {
    responseHeaders.set(key, value);
  });

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
      { status: 400, headers: responseHeaders }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Subscription successful",
    }),
    { status: 200, headers: responseHeaders }
  );
}

// OPTIONS handler for preflight CORS requests
export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin") || "";
  const corsHeaders = getCorsHeaders(origin);

  if (!corsHeaders) {
    // Return a response with empty headers for disallowed origins
    return new Response(null, {
      status: 204,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
