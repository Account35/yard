# SMS OTP setup

Yard uses Supabase Phone Auth for OTPs. Supabase's configured test numbers keep
their fixed test OTP and are excluded from SMS delivery. Other numbers are sent
through SMSPortal, with Twilio used only when SMSPortal delivery fails and Twilio
is configured.

## Supabase dashboard setup

1. Open **Authentication → Providers → Phone** and enable Phone sign-in.
2. Under the phone provider's test phone numbers, add each test number in
   international digits format (for example, `27631819011`) and set its OTP to
   `123456`. Supabase's test-number facility handles these numbers without
   sending an SMS. Also list the same numbers in the `TEST_NUMBERS` function
   secret so the hook explicitly skips delivery if Supabase invokes it.
3. Deploy the `send-sms` Edge Function using the command below.
4. In **Authentication → Hooks**, enable the **Send SMS** hook and choose the
   Edge Function. Use this function URL:
   `https://<project-ref>.supabase.co/functions/v1/send-sms`
5. Generate a signing secret for the hook. Save the complete value, including
   its `v1,whsec_` prefix, as `SEND_SMS_HOOK_SECRET` in the function secrets.
   The function strips this prefix before signature verification.

## Configure function secrets

Replace each placeholder locally with the appropriate value. Do not commit real
values or paste them into the repository. `TEST_NUMBERS` is a comma-separated
list of test numbers in international digits format.

```sh
supabase secrets set SEND_SMS_HOOK_SECRET="v1,whsec_<hook-secret>" TEST_NUMBERS="27631819011" SMSPORTAL_CLIENT_ID="<smsportal-client-id>" SMSPORTAL_SECRET="<smsportal-secret>" TWILIO_ACCOUNT_SID="<twilio-account-sid>" TWILIO_AUTH_TOKEN="<twilio-auth-token>" TWILIO_MESSAGING_SERVICE_SID="<twilio-messaging-service-sid>"
```

Twilio is optional. If it is not being used, leave its three values unset; when
SMSPortal fails, the function then returns a friendly SMS delivery error to the
sign-in screen.

The function uses SMSPortal's versioned `POST /v3/BulkMessages` REST endpoint,
JSON messages array, and Basic authorization. See the [SMSPortal send messages
reference](https://docs.smsportal.com/reference/bulkmessages_postv3).

## Deploy

From the repository root, deploy the hook function with JWT verification
disabled. Supabase Auth authenticates requests with the signed webhook headers.

```sh
supabase functions deploy send-sms --no-verify-jwt
```

Netlify does not need these provider secrets. They belong to the Supabase Edge
Function environment only.

## Test delivery

1. Sign in using a configured Supabase test number such as `27631819011`.
   Enter `123456`. The SMSPortal dashboard should show no message sent for this
   attempt.
2. Sign in using a real South African mobile number. It should receive the Yard
   OTP by SMSPortal and the code should complete sign-in.
3. To check the fallback, temporarily configure invalid SMSPortal credentials
   and valid Twilio secrets, then sign in using a real number. Twilio should
   deliver the OTP. Restore the SMSPortal credentials afterwards.
4. A request without valid Standard Webhooks signature headers should receive
   HTTP 401.

Use numbers you control for real delivery tests. The code message expires in
five minutes and should not be shared.
