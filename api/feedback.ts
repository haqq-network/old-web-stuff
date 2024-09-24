import { ipAddress } from "@vercel/edge";
import { FALCONER_ENDPOINT } from "../const";

interface FeedbackRequest {
  name: string;
  email: string;
  message: string;
  ip: string;
  domain: "haqq.network" | "islamiccoin.net";
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

export async function POST(request: Request) {
  const ip = ipAddress(request) || "unknown";
  console.log("IP Address:", ip); // Log IP address

  const { email, token, name, message }: Record<string, string> =
    await request.json();
  console.log("Request Data:", { email, token, name, message }); // Log request data

  const feedbackRequest: FeedbackRequest = {
    domain: "haqq.network",
    ip,
    email,
    name,
    message,
    captcha_token: token,
  };
  console.log("Feedback Request:", feedbackRequest); // Log feedback request

  const feedbackUrl = new URL("/feedback/send", FALCONER_ENDPOINT);
  const feedbackResponse = await fetch(feedbackUrl.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(feedbackRequest),
  });
  console.log("Feedback Response Status:", feedbackResponse.status); // Log response status

  const feedbackResponseJson: FeedbackResponse = await feedbackResponse.json();
  console.log("Feedback Response JSON:", feedbackResponseJson); // Log response JSON

  if ("success" in feedbackResponseJson && feedbackResponseJson.success) {
    return new Response(
      JSON.stringify({
        message: "Message sent",
      }),
      { status: 200 }
    );
  } else {
    console.log("Error:", { feedbackResponseJson }); // Log error
    return new Response(
      JSON.stringify({
        error: (feedbackResponseJson as FeedbackErrorResponse)
          .error_description,
      }),
      { status: 400 }
    );
  }
}
