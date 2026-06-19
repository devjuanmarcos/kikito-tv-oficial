import { CnSidebar } from "@/components/ui/cn/cn-sidebar";

export default function CnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className="w-[268px] shrink-0 border-r border-rule bg-base flex flex-col sticky top-0 h-screen overflow-hidden"
        aria-label="Navegação lateral CN"
      >
        <CnSidebar />
      </aside>

      <main className="flex-1 min-w-0 overflow-x-hidden">{children}</main>
    </div>
  );
}
