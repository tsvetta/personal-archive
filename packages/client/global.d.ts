export {};

declare global {
  interface Window {
    __APOLLO_STATE__?: any;
    __ARCHIVE_USER_ID__?: string;
  }
}
