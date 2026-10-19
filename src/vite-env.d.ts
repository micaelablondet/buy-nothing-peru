/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_PUBLIC_URL?: string;
  readonly VITE_APP_IOS_STORE_URL?: string;
  readonly VITE_APP_ANDROID_STORE_URL?: string;
  readonly VITE_BASE_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
