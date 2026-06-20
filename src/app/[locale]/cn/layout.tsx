import { CnHeader } from "@/components/ui/cn/cn-header";
import { CnSidebar } from "@/components/ui/cn/cn-sidebar";
import { CnStripes } from "@/components/ui/cn/cn-stripes";

export default function CnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CnHeader />

      <div className="flex flex-1 min-h-0">
        <aside
          className="w-[268px] shrink-0 border-r border-rule bg-base flex flex-col sticky top-[3.25rem] h-[calc(100vh-3.25rem)] overflow-hidden"
          aria-label="Navegação lateral CN"
        >
          <CnSidebar />
        </aside>

        <CnStripes />

        <main className="flex-1 min-w-0 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
