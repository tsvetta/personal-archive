import { CookieOptions } from 'express';

type Cookie = Record<string, string | number | undefined>;
type CookieGetOptions = { doNotParse: boolean };

export type UniversalCookies = {
  HAS_DOCUMENT_COOKIE: boolean;
  cookies: Cookie;
  get: (name: string, options?: CookieGetOptions) => string;
  getAll: (options?: CookieGetOptions) => Cookie;
  set: (name: string, value: string, options?: CookieOptions) => void;
  remove: (name: string, options: CookieOptions) => void;
};
