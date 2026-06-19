import { type AxiosResponse } from "axios";

import {
  type LoginRequest,
  type LoginResponse,
  RefreshTokenRequest,
  type resetPasswordRequest,
  type resetPasswordResponse,
  type resetPasswordSolicitationRequest,
  type resetPasswordSolicitationResponse,
  type setFirstAccessPasswordRequest,
  type ValidateFirstAccessCodeRequest,
} from "@/@types/auth";

import api from "../axios";

export async function loginService({ email, password }: LoginRequest): Promise<AxiosResponse<LoginResponse>> {
  return await api.post<LoginResponse>("/auth/login", { email, password }, { ignoreBearerToken: true } as any);
}

export async function logoutService(refresh_token: string): Promise<AxiosResponse<void>> {
  return await api.post<void>("/auth/logout", { refresh_token });
}

export async function forgotPasswordService(email: string): Promise<AxiosResponse<void>> {
  return await api.post<void>("/auth/forgot-password", { email }, { ignoreBearerToken: true } as any);
}

export async function resetPasswordService({
  code,
  newPassword,
}: resetPasswordRequest): Promise<AxiosResponse<resetPasswordResponse>> {
  return await api.post("/auth/reset-password", { code, newPassword }, { ignoreBearerToken: true } as any);
}
export async function validateFirstAccessCodeService(
  request: ValidateFirstAccessCodeRequest
): Promise<AxiosResponse<void>> {
  return await api.post<void>("/auth/validate-first-access-code", request, { ignoreBearerToken: true } as any);
}

export async function setFirstAccessPasswordService(
  request: setFirstAccessPasswordRequest
): Promise<AxiosResponse<void>> {
  return await api.post<void>("/auth/set-first-access-password", request, { ignoreBearerToken: true } as any);
}

export async function resetPasswordSolicitationService({
  email,
}: resetPasswordSolicitationRequest): Promise<AxiosResponse<resetPasswordSolicitationResponse>> {
  return await api.post("/auth/forgot-password", { email }, { ignoreBearerToken: true } as any);
}
