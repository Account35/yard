import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

function normalizePhone(value: unknown): string | null {
  if (typeof value !== "string") return null;
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = `27${digits.slice(1)}`;
  return digits.startsWith("27") && digits.length === 11 ? digits : null;
}

async function sendViaSmsPortal(to: string, text: string): Promise<void> {
  const clientId = (Deno.env.get("SMSPORTAL_CLIENT_ID") ?? "").trim();
  const secret = (Deno.env.get("SMSPORTAL_SECRET") ?? "").trim();
  if (!clientId || !secret) throw new Error("SMSPortal keys missing");
  const testMode = Deno.env.get("SMSPORTAL_TEST_MODE") === "true";

  const response = await fetch("https://rest.smsportal.com/v3/BulkMessages", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${secret}`)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sendOptions: { testMode },
      messages: [{ content: text, destination: to }],
    }),
  });

  const body = await response.text();
  if (!response.ok) throw new Error(`SMSPortal ${response.status}: ${body}`);

  type SmsPortalResponse = {
    sendResponse?: {
      errorReport?: { faults?: unknown[]; noNetwork?: boolean };
      messages?: number;
    };
  };
  let data: SmsPortalResponse;
  try {
    data = JSON.parse(body) as SmsPortalResponse;
  } catch {
    throw new Error("SMSPortal returned an invalid response");
  }

  const report = data.sendResponse?.errorReport;
  if (
    (report?.faults?.length ?? 0) > 0 ||
    report?.noNetwork ||
    data.sendResponse?.messages === 0
  ) {
    throw new Error("SMSPortal rejected the destination");
  }
}

async function sendTwilio(destination: string, content: string): Promise<void> {
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const messagingServiceSid = Deno.env.get("TWILIO_MESSAGING_SERVICE_SID");
  if (!accountSid || !authToken || !messagingServiceSid) {
    throw new Error("credentials are not fully configured");
  }
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(accountSid)}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: `+${destination}`,
        MessagingServiceSid: messagingServiceSid,
        Body: content,
      }),
    },
  );
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const configuredSecret = Deno.env.get("SEND_SMS_HOOK_SECRET") ?? "";
  const secret = configuredSecret.replace(/^v1,whsec_/, "");
  if (!secret) return json({ error: "Hook secret is not configured" }, 500);

  let payload: { user?: { phone?: unknown }; sms?: { otp?: unknown } };
  try {
    const verified = new Webhook(secret).verify(await request.text(), request.headers);
    if (!verified || typeof verified !== "object") return json({ error: "Invalid signature" }, 401);
    payload = verified as typeof payload;
  } catch {
    return json({ error: "Invalid signature" }, 401);
  }

  const phone = normalizePhone(payload.user?.phone);
  const otp = payload.sms?.otp;
  if (!phone || typeof otp !== "string" || !/^\d+$/.test(otp)) {
    return json({ error: "Invalid SMS hook payload" }, 400);
  }
  const testNumbers = (Deno.env.get("TEST_NUMBERS") ?? "")
    .split(",")
    .map((number) => normalizePhone(number.trim()))
    .filter((number): number is string => number !== null);
  if (testNumbers.includes(phone)) return json({});

  const content = `Your Yard code is ${otp}. It expires in 5 minutes. Don't share it with anyone.`;
  try {
    await sendViaSmsPortal(phone, content);
    return json({});
  } catch {
    console.error("SMSPortal delivery failed", { phone: `***${phone.slice(-3)}` });
  }
  // Test mode is for validating SMSPortal without delivering a real SMS. Do not
  // let the Twilio fallback turn a provider test into a live message.
  if (Deno.env.get("SMSPORTAL_TEST_MODE") === "true") {
    return json(
      { error: { http_code: 500, message: "Could not send the verification SMS. Please try again." } },
      500,
    );
  }
  if (Deno.env.get("TWILIO_ACCOUNT_SID")) {
    try {
      await sendTwilio(phone, content);
      return json({});
    } catch {
      console.error("Twilio delivery failed", { phone: `***${phone.slice(-3)}` });
    }
  }
  return json(
    { error: { http_code: 500, message: "Could not send the verification SMS. Please try again." } },
    500,
  );
});
