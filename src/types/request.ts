export type AwsCredentials = {
  accessKeyId: string;
  secretAccessKey: string;
};

export type AwsRequestCredentials = {
  awsCredentials?: AwsCredentials;
};
