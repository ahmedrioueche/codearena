import axios, { AxiosHeaders, ResponseType } from "axios";

interface FetchParams {
  data?: any;
  headers?: AxiosHeaders | {};
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";
  withCredentials?: boolean;
  responseType?: ResponseType;
  redirectOnUnAuthorized?: boolean;
  multiForm?: boolean;
}

export const handleFetch = async (
  url: string,
  {
    data,
    method = "GET",
    headers = {},
    multiForm = false,
    responseType,
    withCredentials = true,
  }: FetchParams = {}
) => {
  try {
    const { data: responseData } = await axios({
      url,
      data,
      method: method,
      timeout: 12000,
      responseType: responseType,
      headers: multiForm
        ? {
            ...headers,
            "Content-Type": "multipart/form-data",
          }
        : headers,
      withCredentials: withCredentials,
    });

    return responseData;
  } catch (error) {
    console.error(error);

    throw new Error(String(error));
  }
};
