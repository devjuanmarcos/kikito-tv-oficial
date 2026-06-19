import type { z } from "zod";

/**
 * Deriva um schema Zod que valida apenas os campos do step.
 * Útil para validação ao clicar em "Próximo" sem validar campos de outros steps.
 *
 * @param schema - Schema completo (ZodObject)
 * @param fields - Nomes dos campos do step
 * @returns Schema que valida apenas os campos indicados
 */
export function pickStepSchema<T extends z.ZodRawShape, K extends keyof T>(
  schema: z.ZodObject<T>,
  fields: K[]
): z.ZodObject<Pick<T, K>> {
  const shape = Object.fromEntries(fields.map((f) => [f, true])) as { [P in K]?: true };
  return schema.pick(shape) as z.ZodObject<Pick<T, K>>;
}
