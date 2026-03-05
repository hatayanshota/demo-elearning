import { TrendingUp, TrendingDown } from "lucide-react";

type KpiCardViewProps = {
  label: string;
  value: string | number;
  suffix?: string;
  trend?: "up" | "down";
  bgColor: string;
  labelColor: string;
  isClickable?: boolean;
  onClick?: () => void;
};

export function KpiCardView({ label, value, suffix, trend, bgColor, labelColor, isClickable, onClick }: KpiCardViewProps) {
  return (
    <div
      className={`rounded-xl p-5 transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] ${isClickable ? "cursor-pointer" : ""}`}
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
    >
      <p className="text-sm font-medium" style={{ color: labelColor }}>{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        {suffix && <span className="text-sm text-white/80">{suffix}</span>}
        {trend === "up" && <TrendingUp className="h-4 w-4 text-white/70" />}
        {trend === "down" && <TrendingDown className="h-4 w-4 text-white/70" />}
      </div>
    </div>
  );
}
