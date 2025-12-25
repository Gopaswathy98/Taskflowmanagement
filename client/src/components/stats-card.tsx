import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor,
}: StatsCardProps) {
  const changeColors = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-blue-600",
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-secondary-600 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-secondary-900 mt-1">{value}</p>
            {change && (
              <p className={`text-sm mt-2 ${changeColors[changeType]}`}>
                {change}
              </p>
            )}
          </div>
          <div className={`h-12 w-12 ${iconColor} rounded-xl flex items-center justify-center`}>
            <Icon size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
