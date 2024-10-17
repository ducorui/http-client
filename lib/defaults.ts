import token, { TokenData } from "./token";

export interface requestMethodState {
  baseURL?: string | false; // undefined
  method: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  formData?: Record<string, any>;
}

export interface DefaultsData {
  baseURL: string | null | undefined;
  requestMethods: {
    [key: string]: requestMethodState;
  },
  headers: {
    [key: string]: Record<string, string>
  };
  token: TokenData,
}


const defaults: DefaultsData = {
  baseURL: null,
  requestMethods: {
    'get': {
      method: "GET",
    },
    'post': {
      method: "POST",
    },
    'put': {
      method: "PUT",
    },
    'patch': {
      method: "PATCH",
    },
    'delete': {
      method: "DELETE",
    },
  },
  headers: {
    common: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    // methods headers
    get: {},
    post: {},
    put: {},
    patch: {},
    delete: {},
  },
  token: token,
};

export default defaults;