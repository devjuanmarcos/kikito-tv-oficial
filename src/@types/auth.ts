export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ValidateFirstAccessCodeRequest {
  email: string;
  code: string;
}

export interface setFirstAccessPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface resetPasswordResponse {
  message: string;
}

export interface resetPasswordRequest {
  code: string;
  newPassword: string;
}

export interface resetPasswordSolicitationRequest {
  email: string;
}

export interface resetPasswordSolicitationResponse {
  message: string;
}
