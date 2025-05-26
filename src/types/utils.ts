export interface SignRequestInput {
  accessKey: string;
  secretKey: string;
  method: string;
  host: string;
  path: string;
  region: string;
  service: string;
  payload?: string | BodyInit;
}

export interface SignedHeaders {
  Authorization: string;
  "X-Amz-Date": string;
  Host: string;
}
