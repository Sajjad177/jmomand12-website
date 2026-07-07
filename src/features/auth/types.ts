export type AuthFlow = "signup" | "forgot";

export type AuthResult = {
  ok: boolean;
  message?: string;
};

export type RememberedCredentials = {
  email: string;
  password: string;
};

export type SignUpPayload = {
  name: string;
  email: string;
  password: string;
  remember: boolean;
};

export type ResetPasswordPayload = {
  newPassword: string;
  confirmPassword: string;
};

