export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ISignUpRequest {
  username: string;
  email: string;
  password: string;
}

export interface ISignInRequest {
  email: string;
  password: string;
}

export interface IOtp {
  email: string;
  otp: string;
  expiresAt: Date;
}

export interface ISendOtpRequest {
  email: string;
}

export interface IVerifyOtpRequest {
  email: string;
  otp: string;
}
