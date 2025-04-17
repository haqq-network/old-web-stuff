export const config = {
  runtime: "edge",
};

// Health check endpoint
export async function GET(request: Request) {
  const responseHeaders = new Headers({
    "Content-Type": "application/json",
  });

  return new Response(
    JSON.stringify({
      status: "ok",
      time: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: responseHeaders,
    }
  );
}
