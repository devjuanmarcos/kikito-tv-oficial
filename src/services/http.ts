import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

import { log } from "@/lib/logger";

interface CreateHttpClientOptions {
  /** URL base da API */
  baseURL: string;
  /** Timeout em ms (padrão: 10s) */
  timeout?: number;
  /** Adicionar Authorization header automaticamente */
  withAuth?: boolean;
  /** Callback para obter o token de autorização */
  getToken?: () => Promise<string | null> | string | null;
}

/** Erro tipado retornado por todos os clientes HTTP */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Factory de clientes Axios por domínio.
 * Nunca exponha a instância axios diretamente — use as funções tipadas do service.
 *
 * @example
 * // src/services/minha-api/axios.ts
 * export const minhaApiClient = createHttpClient({
 *   baseURL: env.BASE_URL_MINHA_API,
 *   withAuth: true,
 * })
 */
export function createHttpClient(options: CreateHttpClientOptions): AxiosInstance {
  const instance = axios.create({
    baseURL: options.baseURL,
    timeout: options.timeout ?? 10_000,
    headers: { "Content-Type": "application/json" },
  });

  // Request interceptor: adicionar Authorization header
  if (options.withAuth) {
    instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
      const token = options.getToken ? await options.getToken() : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Response interceptor: transformar erros HTTP em ApiError tipado
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? 0;
        const message = error.response?.data?.message ?? error.message ?? "Erro desconhecido";
        const code = error.response?.data?.code ?? `HTTP_${status}`;

        log.error(`API error [${status}]`, error, { url: error.config?.url, code });

        throw new ApiError(status, code, message, error.response?.data);
      }
      throw error;
    }
  );

  return instance;
}
