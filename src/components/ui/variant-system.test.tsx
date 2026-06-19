import { alertVariants } from "@/components/ui/alert";
import { badgeVariants } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

describe("component variant system", () => {
  it("composes button intent, appearance and size variants", () => {
    const className = buttonVariants({
      intent: "tertiary",
      appearance: "soft",
      size: "xs",
    });

    expect(className).toContain("bg-tertiary-soft");
    expect(className).toContain("text-tertiary-soft-foreground");
    expect(className).toContain("h-7");
  });

  it("composes badge intent, appearance and size variants", () => {
    const className = badgeVariants({
      intent: "success",
      appearance: "outline",
      size: "lg",
    });

    expect(className).toContain("border-success");
    expect(className).toContain("text-success");
    expect(className).toContain("h-7");
  });

  it("composes alert intent, appearance and size variants", () => {
    const className = alertVariants({
      intent: "warning",
      appearance: "dashed",
      size: "sm",
    });

    expect(className).toContain("border-dashed");
    expect(className).toContain("border-warning");
    expect(className).toContain("bg-warning-soft");
  });
});
