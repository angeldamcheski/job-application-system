import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  subText: string;
  topColor: string; // Tailwind bg color
  textColor: string; // Tailwind text color
  fullWidth?: boolean; // Whether the card should span the full row
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subText,
  topColor,
  textColor,
  fullWidth = false,
}) => {
  return (
    <div
      className={`${topColor} p-4 rounded-lg border border-slate-200/20 inset-shadow-sm/20 ${
        fullWidth ? "col-span-2" : ""
      } hover:inset-shadow-sm/30 transition-all duration-100`}
    >
      <div className={`text-xs font-bold ${textColor}`}>{label}</div>
      <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
      <div className={`text-xs ${textColor}`}>{subText}</div>
    </div>
  );
};

export default MetricCard;
