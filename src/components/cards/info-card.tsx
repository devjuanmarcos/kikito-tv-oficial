import { LucideIcon } from "lucide-react";
import { SimpleTitleIcon, TitleIcon } from "../ui/title-icon";

interface InfoCardProps {
  id: string;
  title: string;
  icon: LucideIcon;
  items: {
    label: string;
    value: string;
    highlight?: boolean;
  }[];
}

export const InfoCard = ({ id, title, icon: Icon, items }: InfoCardProps) => {
  return (
    <div className="relative flex flex-col gap-2 px-6 py-5 bg-card rounded-xl shadow-sm border border-border">
      {/* Linha lateral colorida */}
      <span className="absolute left-0 top-5 bottom-5 w-1 rounded bg-primary" />

      <div className="flex items-center gap-2 mb-1">
        <SimpleTitleIcon variant="default" icon={Icon} />
        <span className="body-title-bold ">{title}</span>
      </div>

      {items.map((item, index) => (
        <div key={`${id}-${index}`} className="text-sm text-muted-foreground">
          <span className="body-callout-medium text-muted-foreground">{item.label}:</span>{" "}
          {item.highlight ? <span className="">{item.value}</span> : item.value}
        </div>
      ))}
    </div>
  );
};
