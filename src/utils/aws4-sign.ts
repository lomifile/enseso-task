import { SignRequestInput, SignedHeaders } from "../types/utils";

export async function signRequest({
  accessKey,
  secretKey,
  method,
  host,
  path,
  region,
  service,
  payload = "",
}: SignRequestInput): Promise<{ headers: SignedHeaders }> {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);

  const canonicalUri = path; // Should already be encoded correctly
  const canonicalQueryString = "";

  const canonicalHeaders = `host:${host}\n` + `x-amz-date:${amzDate}\n`;

  const signedHeaders = "host;x-amz-date";

  const payloadHash = await sha256Hex(payload);

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const algorithm = "AWS4-HMAC-SHA256";
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;

  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join("\n");

  const signingKey = await getSignatureKey(
    secretKey,
    dateStamp,
    region,
    service,
  );
  const signature = await hmacHex(signingKey, stringToSign);

  const authorization = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return {
    headers: {
      Authorization: authorization,
      "X-Amz-Date": amzDate,
      Host: host,
    },
  };
}

// Utility functions

async function sha256Hex(message: string | BodyInit): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message as string);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return bufferToHex(hash);
}

async function hmac(
  key: ArrayBuffer | Uint8Array,
  message: string,
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message));
}

async function hmacHex(
  key: ArrayBuffer | Uint8Array,
  message: string,
): Promise<string> {
  const sig = await hmac(key, message);
  return bufferToHex(sig);
}

async function getSignatureKey(
  secretKey: string,
  date: string,
  region: string,
  service: string,
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();

  const kSecret = encoder.encode(`AWS4${secretKey}`);
  const kDate = await hmac(kSecret, date);
  const kRegion = await hmac(new Uint8Array(kDate), region);
  const kService = await hmac(new Uint8Array(kRegion), service);
  return await hmac(new Uint8Array(kService), "aws4_request");
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
