import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  accentColor?: string;
  iconBg?: string;
  iconColor?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  accentColor = "bg-indigo-500",
  iconBg = "bg-indigo-50 dark:bg-indigo-950",
  iconColor = "text-indigo-600 dark:text-indigo-400",
}: StatsCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className={cn("h-1 w-full", accentColor)} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-foreground leading-none">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground pt-0.5">{description}</p>
            )}
          </div>
          <div className={cn("p-2.5 rounded-lg shrink-0", iconBg)}>
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
        </div>
      </div>
    </div>
  );
}
