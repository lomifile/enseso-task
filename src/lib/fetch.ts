import { AwsRequestCredentials } from "../types/request";
import { signRequest } from "../utils/aws4-sign";
import { computeXAmzSha256 } from "../utils/sha256";

const url = import.meta.env.VITE_PUBLIC_API_URL;

const baseRequestInit: RequestInit = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  credentials: "include",
};

export const api = async (
  input: string,
  init?: RequestInit & AwsRequestCredentials,
) => {
  let req = baseRequestInit;

  if (init) {
    const headers = baseRequestInit.headers;
    req = {
      ...init,
    };
    req.headers = { ...init.headers, ...headers };
  }

  if (init?.awsCredentials) {
    const parsedUrl = new URL(url + input);
    const { accessKeyId, secretAccessKey } = init.awsCredentials;

    const signed = await signRequest({
      accessKey: accessKeyId,
      secretKey: secretAccessKey,
      method: init.method ?? "GET",
      host: parsedUrl.host,
      path: canonicalUri(parsedUrl.pathname).trim(),
      region: "us-east-1",
      service: "execute-api",
      payload: init.body ? init.body : "",
    });

    req.headers = {
      ...req.headers,
      ...signed.headers,
    };

    if (init.body) {
      req.headers = {
        ...req.headers,
        "X-Amz-Content-Sha256": await computeXAmzSha256(init.body as string),
      };
    }
  }

  return await fetch(`${url || "http://localhost:5000"}${input}`, req);
};

export function canonicalUri(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}
