import { AxiosError } from 'axios';
import { RequestConfig } from './requestConfig';
import { UtilityTypes } from './utilityTypes';

export interface Config {
  host: string;
  strictGDPR?: boolean;
  /** Adds `'X-Atlassian-Token': 'no-check'` to each request header */
  noCheckAtlassianToken?: boolean;
  baseRequestConfig?: Config.BaseRequestConfig;
  authentication?: Config.Authentication;
  middlewares?: Config.Middlewares;
}

export namespace Config {
  export type BaseRequestConfig = RequestConfig;
  export type Error = AxiosError;

  export type Authentication = UtilityTypes.XOR3<
  {
    personalAccessToken: Authentication.PersonalAccessToken;
  },
  {
    basic: Authentication.Basic;
  },
  {
    oauth2: Authentication.OAuth2;
  }
  >;

  export interface Middlewares {
    onError?: Config.Middlewares.OnErrorHandler;
    onResponse?: Config.Middlewares.OnResponseHandler;
  }

  export namespace Middlewares {
    export type OnErrorHandler = (error: Config.Error) => void;
    export type OnResponseHandler = (data: any) => void;
  }

  export namespace Authentication {
    export type JWT = {
      /** The key from the app descriptor. */
      issuer: string;
      /** The sharedsecret key received during the app installation handshake */
      secret: string;
      /** Token expiry time (default 3 minutes after issuing) */
      expiryTimeSeconds?: number;
    };

    export type Basic = UtilityTypes.XOR<
    {
      email: string;
      apiToken: string;
    },
    {
      username: string;
      password: string;
    }
    >;

    export interface OAuth {
      consumerKey: string;
      consumerSecret: string;
      accessToken: string;
      tokenSecret: string;
    }

    export type OAuth2 = {
      accessToken: string;
    };
    export type PersonalAccessToken = string;
  }
}
