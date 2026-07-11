import type { RememberedCredentials } from "../types";

export const REMEMBERED_CREDENTIALS_KEY = "jmomand_auth_remember";
export const SIGNUP_ACCESS_TOKEN_KEY = "jmomand_auth_access_token";
export const PASSWORD_RESET_TOKEN_KEY = "jmomand_password_reset_token";

const canUseStorage = () => typeof window !== "undefined";

export const readStorage = (key: string) => {
  if (!canUseStorage()) return "";

  return window.localStorage.getItem(key) || "";
};

export const writeStorage = (key: string, value: string) => {
  if (!canUseStorage()) return;

  window.localStorage.setItem(key, value);
};

export const removeStorage = (key: string) => {
  if (!canUseStorage()) return;

  window.localStorage.removeItem(key);
};

export const getRememberedCredentials = (): RememberedCredentials | null => {
  if (!canUseStorage()) return null;

  try {
    const value = window.localStorage.getItem(REMEMBERED_CREDENTIALS_KEY);
    return value ? (JSON.parse(value) as RememberedCredentials) : null;
  } catch {
    return null;
  }
};

export const saveRememberedCredentials = (
  email: string,
  password: string,
  remember: boolean,
) => {
  if (!canUseStorage()) return;

  if (remember) {
    window.localStorage.setItem(
      REMEMBERED_CREDENTIALS_KEY,
      JSON.stringify({ email, password }),
    );
    return;
  }

  window.localStorage.removeItem(REMEMBERED_CREDENTIALS_KEY);
};

