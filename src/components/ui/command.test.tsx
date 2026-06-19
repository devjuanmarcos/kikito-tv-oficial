import { render, screen } from "@testing-library/react";

import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

describe("CommandItem", () => {
  it("styles disabled state only when data-disabled is true", () => {
    render(
      <Command>
        <CommandList>
          <CommandGroup>
            <CommandItem value="enabled-item">Enabled item</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );

    const item = screen.getByText("Enabled item");

    expect(item).toHaveAttribute("data-disabled", "false");
    expect(item).toHaveClass("data-[disabled=true]:pointer-events-none");
    expect(item).not.toHaveClass("data-[disabled]:pointer-events-none");
  });

  it("keeps disabled semantics for disabled items", () => {
    render(
      <Command>
        <CommandList>
          <CommandGroup>
            <CommandItem value="disabled-item" disabled>
              Disabled item
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );

    expect(screen.getByText("Disabled item")).toHaveAttribute("aria-disabled", "true");
  });
});
