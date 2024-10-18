
import defaults from "./defaults";
// import { parse } from 'yaml';

type AnyMethod = (...args: any[]) => any;

interface HttpRequestConfig {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, any>;
}

interface HttpError extends Error {
  config: HttpRequestConfig;
  code?: string;
  request?: XMLHttpRequest;
  response?: HttpResponse;
  errors: FormDataError;
}
interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  config: HttpRequestConfig;
}

interface FormDataError {
  [key: string]: Record<string, any>;
}

interface HttpError extends Error {
  config: HttpRequestConfig;
  code?: string;
  response?: HttpResponse;
  errors: FormDataError;
}

interface RequestMethodConfig{
  baseURL?: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  formData?: Record<string, string>;
}

class Http {

  private requestAttributes = {};
  public defaults = defaults;
  private token: string|null|undefined = undefined;

  private baseURL: string | null = null;
  private headers: Record<string, string> = {};

  private tokenName: string = '';
  private withCredentials: boolean = true;
  private params: Record<string, string> = {};


  /**
   * Toaster system
   * @returns 
   */
  private toast?:  object ;

  /**
   * Method name
   * @returns
   */
  private mthodName?: string;

  constructor() {
    return new Proxy(this, {
      get: (target, mthodName: string) => {
        
        if (mthodName in target) {
          // @ts-ignore
          return target[mthodName];
        }
         // If the property is not defined, return a function to handle dynamic method invocation
         this.mthodName = mthodName;
         return <T = any>(...args: any[]): T => (target as any).actionRequestMethod(...args);
      }
    });
  }


  public actionRequestMethod<T = any>(url: string = "", ...args: any[]) {

    if(!this.mthodName){
      throw new Error("Method name required.");
    }

    const attributes = this.defaults.requestMethods[this.mthodName];

    if(attributes === undefined){
      throw new Error("Method not found exception");
    }

    // Prepare the request data
    const [argData = {}, argConfig = {}] = args;
    const data = argData || {};

    // Assuming argConfig is supposed to be an object, we use `...argConfig` 
    // to merge it into config. Omit the 'url' and 'method' keys from HttpRequestConfig.
    const config: Omit<HttpRequestConfig, 'url' | 'method'> = { ...argConfig };

    // Merge the configuration and return the request
    return this.request<T>({ ...config, url, method: attributes.method, data });
  }

  public setBaseUrl(baseURL: string) {
    this.baseURL = baseURL;
    return this;
  }

  private fixToken(token: any): string | null{

    if(typeof token === "string"){
      this.token = token.replace('Bearer ', '');
      return token;
    }
    return null;
  }

  public getToken(): string|null {
    // get temp token
    let value = null;
    if (typeof this.token === 'string' || this.token === null) {
      value = this.token;
    }
    
    value = this.defaults.token.get();

    value = this.fixToken(value);

    return value? "Bearer " + value: null;
  }

  public setToken(token: string| null = null, tokenName: string = '_token', storageName: "localStorage"|"cookies" = 'localStorage') {
    const value = this.fixToken(token);
    if(value === null){
      this.removeToken();
    } else {
      this.defaults.headers.common['Authorization'] = `Bearer ${value}`;
      this.defaults.token.set(token, tokenName, storageName);
    }
    
    return this;
  }

  public withToken(token: string| null){
    const value = this.fixToken(token);
    this.token = value? `Bearer ${value}`: null;
    return this;
  }

  private setParam(key: string, value: string) {
    this.params = { ...this.params, [key]: value };
    return this;
  }

  public addMethod(methods: string[]) {
    // Process the array of methods
    methods.forEach(method =>{
      this.addReqeustMethod(method.toLowerCase(), method.toUpperCase());
    });

    return this;
  }

  public setWithCredentials(withCredentials: boolean): void {
    this.withCredentials = withCredentials;
  }

  private getWithCredentials(): boolean {
    return this.withCredentials === true;
  }

  private removeToken() {
    localStorage.removeItem(this.tokenName);
  }

  public setToast(toast?:object): void{
    if(toast){
      this.toast = toast;
    }
  }

  private buildUrl(url: string): string {

    if (this.baseURL && !url.startsWith('http')) {
      return `${this.baseURL}${url.startsWith('/') ? '' : '/'}${url}`;
    } else if (this.defaults.baseURL && !url.startsWith('http')) {
      return `${this.defaults.baseURL}${url.startsWith('/') ? '' : '/'}${url}`;
    }
    return url;
  }

  // Reset
  private reset(): void {
    this.baseURL = null;
    this.headers = {};
    this.params = {};
  }

  
  public async request<T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    const { url, method = 'GET', headers = {}, data = null, params = {} } = config;

    console.log(url, method, headers, data);

    const queryParams = new URLSearchParams({ ...params, ...this.params }).toString();
    const fullUrl = this.buildUrl(queryParams ? `${url}?${queryParams}` : url);

    const combinedHeaders = { ...this.defaults.headers.common, ...this.headers, ...headers };

    if (typeof combinedHeaders['Authorization'] !== 'string') {
      const token = this.getToken();
      if(typeof token === 'string' ){
        combinedHeaders['Authorization'] = token;
      }
    }

    const fetchConfig: RequestInit = {
      method,
      headers: combinedHeaders,
      credentials: !this.getWithCredentials() ? 'include' : 'same-origin',
    };

    if (data && method.toUpperCase() !== 'GET') {
      fetchConfig.body = data instanceof FormData ? data : JSON.stringify(data);
    }

    // return fetch(fullUrl, fetchConfig).then(async (response) => {

    //   const contentType = response.headers.get('Content-Type');
    //   //if json
    //   if (response.status >= 200 && response.status < 300) {
    //     // Success: Status codes from 200 to 299
    //     let responseData: any = "";
    //     if (contentType && contentType.includes('application/json')) {
    //       responseData = await response.json();

    //     }else if (contentType && contentType.includes('application/yaml')) {
    //      // Read the YAML response as text
    //         const yamlText = await response.text();
    //         // Parse YAML into a JavaScript object
    //         // responseData = parse(yamlText);
            
    //     }  else {
    //       responseData = await response.text();
    //     }  

    //     const httpResponse: HttpResponse<T> = {
    //       data: responseData,
    //       status: response.status,
    //       statusText: response.statusText,
    //       headers: response.headers,
    //       config,
    //     };
        
    //     return httpResponse;
    //   } else if (response.status >= 400 && response.status < 500) {
    //     // Client errors: Status codes from 400 to 499
    //     if (response.status === 401) {
    //       this.removeToken();
    //     }
    //     throw new Error(`Client error: ${response.status}`);
    //   } else if (response.status >= 500 && response.status < 600) {
    //     // Server errors: Status codes from 500 to 599
    //     throw new Error(`Server error: ${response.status}`);
    //   } else {
    //     // Unexpected status codes
    //     throw new Error(`Unexpected response code: ${response.status}`);
    //   }

    // }).catch(clientError => {
      
    //   const error: HttpError = new Error("newtwork error") as HttpError;
    //   let errors: FormDataError = {};

    //   error.config = config;
    //   error.code = '00';
    //   error.errors = errors;
    //   error.response = {
    //     data: null,
    //     status: 0,
    //     statusText: '',
    //     headers: {} as Headers,
    //     config,
    //   };


    //   throw error;
    // });

    try {
      const response = await fetch(fullUrl, fetchConfig);

      // console.log('response', response);
      var responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          this.removeToken();
        }

        const error: HttpError = new Error(response.statusText) as HttpError;
        let errors: FormDataError = {};

        if (responseData && responseData.errors) {
          errors = responseData.errors;
        }

        error.config = config;
        error.code = response.status.toString();
        error.errors = errors;
        error.response = {
          data: responseData,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          config,
        };

        if (typeof responseData === 'object' && 'message' in responseData) {
          const { message } = responseData;
          // if (typeof message === 'string' && this.toast && 'error' in this.toast) {
          //   this.toast.error(message);
          // }

          if (Array.isArray(message)) {
            message.forEach((msg: string) => {
              // toast.error(msg);
            });
          }
        }

        throw error;
      }

      const httpResponse: HttpResponse<T> = {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config,
      };

      if (typeof responseData === 'object' && 'message' in responseData) {
        const { message } = responseData;
        if (typeof message === 'string') {
          // toast.success(message);
        }

        if (Array.isArray(message)) {
          message.forEach((msg: string) => {
            // toast.success(msg);
          });
        }
      }

      return httpResponse;
    } catch (error) {
      
      if (error instanceof Error) {
        // toast.error(error.message);
      }
      throw error;
    } finally {
      this.reset();
    }
  }
  
  async get<T = any>(url: string, config?: Omit<HttpRequestConfig, 'url' | 'method'>): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, url, method: 'GET' });
  }

  // post<T = any>(url: string, data?: any, config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>): Promise<HttpResponse<T>> {
  //   return this.request<T>({ ...config, url, method: 'POST', data });
  // }

  // put<T = any>(url: string, data?: any, config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>): Promise<HttpResponse<T>> {
  //   return this.request<T>({ ...config, url, method: 'PUT', data });
  // }

  // delete<T = any>(url: string, config?: Omit<HttpRequestConfig, 'url' | 'method'>): Promise<HttpResponse<T>> {
  //   return this.request<T>({ ...config, url, method: 'DELETE' });
  // }

  // patch<T = any>(url: string, data?: any, config?: Omit<HttpRequestConfig, 'url' | 'method' | 'data'>): Promise<HttpResponse<T>> {
  //   return this.request<T>({ ...config, url, method: 'PATCH', data });
  // }

  // restore<T = any>(url: string, config?: Omit<HttpRequestConfig, 'url' | 'method'>): Promise<HttpResponse<T>> {
  //   this.setParam("_method", 'RESTORE');
  //   return this.request<T>({ ...config, url, method: 'POST' });
  // }

  // forceDelete<T = any>(url: string, config?: Omit<HttpRequestConfig, 'url' | 'method'>): Promise<HttpResponse<T>> {
  //   this.setParam("_method", 'FORCEDELETE');
  //   return this.request<T>({ ...config, url, method: 'POST' });
  // }

  public addReqeustMethod(name: string, method: string|null = null, config: RequestMethodConfig = {}){

    const methodName: string = method !==null ? method:  name.toUpperCase();
    
    this.defaults.requestMethods = {
      ...this.defaults.requestMethods,
      [name]: {
        baseURL: config.hasOwnProperty('baseURL')? config.baseURL as string: false,
        method: methodName,
        headers: config.hasOwnProperty('headers')? config.headers as Record<string, string>: {},
        params: config.hasOwnProperty('params')? config.params as Record<string, string>: {},
        formData: config.hasOwnProperty('formData')? config.formData as Record<string, string>: {},
      }
    }

    return this;
  }
}

const http = new Http() as Http & { [key: string]: AnyMethod };

export {http};
export default http;
