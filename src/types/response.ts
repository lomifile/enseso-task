import { EconomicOperator } from "./models/economic-operator";

export type BaseResponse = {
  errorCode: number;
  errorMessage: string;
  status: "success" | "fail";
  timestamp: string;
};

export interface ListResponse extends BaseResponse {
  operators: EconomicOperator[];
}

export interface CreateResponse extends BaseResponse {
  EO_ID: string;
}

export interface GetOneResponse extends BaseResponse {
  operator: EconomicOperator;
}
