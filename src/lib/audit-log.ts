import { log } from "./logger";

interface AuditEntry {
  action: string;
  userId?: string;
  userEmail?: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  success: boolean;
  errorMessage?: string;
}

/**
 * Registra ações críticas do usuário para rastreabilidade e compliance.
 *
 * @example
 * await auditLog({ action: "user.login", userId: user.id, success: true })
 * await auditLog({ action: "resource.delete", userId, success: false, errorMessage: e.message })
 */
export async function auditLog(entry: AuditEntry): Promise<void> {
  try {
    log.info(`AUDIT:${entry.action}`, {
      type: "AUDIT",
      ...entry,
      timestamp: new Date().toISOString(),
    });
  } catch {
    // auditLog nunca deve quebrar a operação do usuário
  }
}

/**
 * Extrai o IP real do cliente a partir dos headers da request.
 */
export function getClientIP(headers: Headers): string | null {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    headers.get("cf-connecting-ip") ??
    null
  );
}
