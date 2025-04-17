import { ipAddress } from "@vercel/functions";
import { ALLOWED_ORIGINS, FALCONER_ENDPOINT } from "../const";

interface FeedbackRequest {
  domain: string;
  name: string;
  email: string;
  message: string;
  ip: string;
  captcha_token: string;
}

interface FeedbackErrorResponse {
  error_type: "validation";
  error_description: string;
}

interface FeedbackSuccessResponse {
  success: true;
}

type FeedbackResponse = FeedbackSuccessResponse | FeedbackErrorResponse;

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
  console.log("IP Address:", ip);

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

  const { email, token, name, message, domain }: Record<string, string> =
    await request.json();
  console.log("Request Data:", { email, token, name, message, domain });

  const feedbackRequest: FeedbackRequest = {
    domain,
    ip,
    email,
    name,
    message,
    captcha_token: token,
  };
  console.log("Feedback Request:", feedbackRequest);

  const feedbackUrl = new URL("/feedback/send", FALCONER_ENDPOINT);
  const feedbackResponse = await fetch(feedbackUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(feedbackRequest),
  });
  console.log("Feedback Response Status:", feedbackResponse.status);

  const feedbackResponseJson: FeedbackResponse = await feedbackResponse.json();
  console.log("Feedback Response JSON:", feedbackResponseJson);

  if ("success" in feedbackResponseJson && feedbackResponseJson.success) {
    return new Response(
      JSON.stringify({
        message: "Message sent",
      }),
      { status: 200, headers: responseHeaders }
    );
  } else {
    console.log("Error:", { feedbackResponseJson });
    return new Response(
      JSON.stringify({
        error: (feedbackResponseJson as FeedbackErrorResponse)
          .error_description,
      }),
      { status: 400, headers: responseHeaders }
    );
  }
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
