// // metricsData.ts
// export const getMetrics = (userApplications: any[]) => {
//   const total = userApplications?.length || 0;
//   const inReview =
//     userApplications?.filter((a) => a.applicationStatus === "IN_REVIEW")
//       .length || 0;
//   const accepted =
//     userApplications?.filter((a) => a.applicationStatus === "ACCEPTED")
//       .length || 0;
//   const rejected =
//     userApplications?.filter((a) => a.applicationStatus === "REJECTED")
//       .length || 0;
//   const successRate = total ? Math.round((accepted / total) * 100) : 0;

//   return [
//     {
//       label: "Total Applications",
//       value: total,
//       topColor: "bg-neutral-400/10",
//       textColor: "text-slate-700/80",
//       subText: "All submissions",
//     },
//     {
//       label: "In Review",
//       value: inReview,
//       topColor: "bg-amber-500/10",
//       textColor: "text-amber-600/75",
//       subText:
//         total > 0 ? `${Math.round((inReview / total) * 100)}% of total` : "0%",
//     },
//     {
//       label: "Accepted",
//       value: accepted,
//       topColor: "bg-emerald-400/10",
//       textColor: "text-green-700/80",
//       subText:
//         total > 0 ? `${Math.round((accepted / total) * 100)}% of total` : "0%",
//     },
//     {
//       label: "Rejected",
//       value: rejected,
//       topColor: "bg-red-300/30",
//       textColor: "text-red-700/65",
//       subText:
//         total > 0 ? `${Math.round((rejected / total) * 100)}% of total` : "0%",
//     },
//     {
//       label: "Success Rate",
//       value: `${successRate}%`,
//       topColor: "bg-blue-300/30",
//       textColor: "text-blue-700/75",
//       subText: "Success of applicant",
//       fullWidth: true, // spans whole row
//     },
//   ];
// };
// metricsData.ts
export const getMetrics = (userApplications: any[]) => {
  const total = userApplications?.length || 0;
  const inReview = userApplications?.filter((a) => a.applicationStatus === "IN_REVIEW").length || 0;
  const accepted = userApplications?.filter((a) => a.applicationStatus === "ACCEPTED").length || 0;
  const rejected = userApplications?.filter((a) => a.applicationStatus === "REJECTED").length || 0;
  const successRate = total ? Math.round((accepted / total) * 100) : 0;

  return [
    {
      label: "Total Applications",
      value: total,
      color: "slate", // Changed from topColor/textColor
      subText: "All submissions",
    },
    {
      label: "In Review",
      value: inReview,
      color: "amber",
      subText: total > 0 ? `${Math.round((inReview / total) * 100)}% of total` : "0%",
    },
    {
      label: "Accepted",
      value: accepted,
      color: "emerald",
      subText: total > 0 ? `${Math.round((accepted / total) * 100)}% of total` : "0%",
    },
    {
      label: "Rejected",
      value: rejected,
      color: "rose", // Apple uses 'Rose' or 'Red' for rejections
      subText: total > 0 ? `${Math.round((rejected / total) * 100)}% of total` : "0%",
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      color: "blue",
      subText: "Success of applicant",
      fullWidth: true,
    },
  ];
};