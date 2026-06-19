"use server";

import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

import { expireAuthSession, getAccessTokenValue, refreshAuthSession } from "@/services/auth/session-tokens";

type AuthenticatedRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  ignoreBearerToken?: boolean;
};

const URL_API = process.env.BASE_URL_BIOCONECTA || "";

const api: AxiosInstance = axios.create({
  withCredentials: true,
  withXSRFToken: true,
  baseURL: URL_API,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string | null> | null = null;

async function getFreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = refreshAuthSession()
      .then((tokens) => tokens.access_token)
      .catch(async () => {
        await expireAuthSession();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

api.interceptors.request.use(async (config: AuthenticatedRequestConfig) => {
  if (config.ignoreBearerToken) {
    return config;
  }

  const token = (await getAccessTokenValue()) ?? (await getFreshAccessToken());
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalConfig = error.config as AuthenticatedRequestConfig | undefined;

    if (
      !originalConfig ||
      originalConfig.ignoreBearerToken ||
      error.response?.status !== 401 ||
      originalConfig._retry
    ) {
      return Promise.reject(error);
    }

    if ((error.response?.data as { message?: string } | undefined)?.message === "Invalid credentials") {
      return Promise.reject(error);
    }

    originalConfig._retry = true;
    const token = await getFreshAccessToken();

    if (!token) {
      return Promise.reject({
        response: {
          status: 401,
          data: { message: "Refresh token failed, redirect to login" },
        },
      });
    }

    originalConfig.headers.Authorization = `Bearer ${token}`;
    return api(originalConfig);
  }
);

export default api;
