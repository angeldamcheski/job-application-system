// import React from "react";

// interface MetricCardProps {
//   label: string;
//   value: string | number;
//   subText: string;
//   topColor: string; // Tailwind bg color
//   textColor: string; // Tailwind text color
//   fullWidth?: boolean; // Whether the card should span the full row
// }

// const MetricCard: React.FC<MetricCardProps> = ({
//   label,
//   value,
//   subText,
//   topColor,
//   textColor,
//   fullWidth = false,
// }) => {
//   return (
//     <div
//       className={`${topColor} p-4 rounded-lg border border-slate-200/20 inset-shadow-sm/20 ${
//         fullWidth ? "col-span-2" : ""
//       } hover:inset-shadow-sm/30 transition-all duration-100`}
//     >
//       <div className={`text-xs font-bold ${textColor}`}>{label}</div>
//       <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
//       <div className={`text-xs ${textColor}`}>{subText}</div>
//     </div>
//   );
// };

// export default MetricCard;
import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  subText: string;
  color?: "blue" | "emerald" | "amber" | "violet" | "rose" | "slate";
  fullWidth?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subText,
  color = "blue",
  fullWidth = false,
}) => {
  // Mapping the 'color' prop to actual Tailwind classes
  const themeMap = {
    blue: {
      text: "text-blue-600",
      bg: "bg-blue-500/50",
      glow: "group-hover:bg-blue-500/80",
    },
    emerald: {
      text: "text-emerald-600",
      bg: "bg-emerald-500/50",
      glow: "group-hover:bg-emerald-500/80",
    },
    amber: {
      text: "text-amber-600",
      bg: "bg-amber-500/50",
      glow: "group-hover:bg-amber-500/80",
    },
    violet: {
      text: "text-violet-600",
      bg: "bg-violet-500/50",
      glow: "group-hover:bg-violet-500/80",
    },
    rose: {
      text: "text-rose-600",
      bg: "bg-rose-500/50",
      glow: "group-hover:bg-rose-500/80",
    },
    slate: {
      text: "text-slate-600",
      bg: "bg-slate-500/50",
      glow: "group-hover:bg-slate-500/80",
    },
  };

  const theme = themeMap[color];

  return (
    // <div
    //   className={`
    //     group relative flex flex-col justify-between overflow-hidden
    //     rounded-2xl p-5 transition-all duration-300 ease-out
    //     bg-white/80 backdrop-blur-xl border border-slate-400/80
    //     shadow-[0_8px_30px_rgb(0,0,0,0.04)]
    //     hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]
    //     hover:-translate-y-0.5 active:scale-[0.98]
    //     ${fullWidth ? "col-span-2" : "col-span-1"}
    //   `}
    // >
    //   {/* Dynamic Background Glow - This makes the card feel "alive" */}
    //   <div
    //     className={`absolute -right-4 -top-4 h-24 w-32 rounded-full blur-3xl transition-colors duration-500 ${theme.bg} ${theme.glow}`}
    //   />

    //   <div className="relative z-10">
    //     <div
    //       className={`text-[10px] font-bold uppercase tracking-widest ${theme.text}`}
    //     >
    //       {label}
    //     </div>
    //     <div className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
    //       {value}
    //     </div>
    //   </div>

    //   <div className="relative z-10 mt-3 text-[12px] font-medium text-slate-400">
    //     {subText}
    //   </div>
    // </div>
    <div
      className={`
    group relative flex flex-col justify-between overflow-hidden
    rounded-2xl p-6
    bg-white/70 backdrop-blur-md
    border border-white/40
    shadow-sm hover:shadow-md
    transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]
    hover:-translate-y-0.5
    ${fullWidth ? "col-span-2" : "col-span-1"}
  `}
    >
      {/* Ambient light effect */}
      <div
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 hover:border-${theme.bg} transition-opacity duration-500`}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${theme.bg}`} />
          <span className="text-[12px] text-slate-500">{label}</span>
        </div>

        <div className="mt-2 text-3xl font-semibold text-slate-900 tracking-tight">
          {value}
        </div>
      </div>

      <div className="relative z-10 mt-3 text-sm text-slate-500">{subText}</div>
    </div>
  );
};

export default MetricCard;
