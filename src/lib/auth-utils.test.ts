import { AUTH_ROUTES, buildLoginUrl, getRequiredRoles, isPublicRoute, stripLocaleFromPathname } from "@/lib/auth-utils";

describe("auth route helpers", () => {
  it("uses the localized auth route as the login entrypoint", () => {
    expect(AUTH_ROUTES.login).toBe("/auth");
    expect(buildLoginUrl("pt", "/pt/administrador/dashboard")).toBe(
      "/pt/auth?callbackUrl=%2Fpt%2Fadministrador%2Fdashboard"
    );
  });

  it("detects public auth routes with or without locale", () => {
    expect(isPublicRoute("/auth")).toBe(true);
    expect(isPublicRoute("/pt/auth")).toBe(true);
    expect(isPublicRoute("/pt/auth/nova-senha")).toBe(true);
  });

  it("maps dashboard admin routes to admin role after stripping locale", () => {
    expect(stripLocaleFromPathname("/pt/administrador/dashboard")).toBe("/administrador/dashboard");
    expect(getRequiredRoles("/pt/administrador/dashboard")).toEqual(["admin"]);
  });
});
