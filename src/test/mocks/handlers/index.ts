import { rest } from "msw";

export const handlers = [
  // Mock de health check
  rest.get("/api/health", (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ status: "ok" }));
  }),

  // Mock de autenticação — adicione handlers específicos conforme necessário
  rest.post("/api/auth/signin", (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ ok: true }));
  }),
];
