import type { ReportInput } from "./types.ts";

// Illustrative sample reports — NOT any company's real files.
export const SAMPLE_REPORTS: ReportInput[] = [
  {
    name: "Site Oulu — weekly ops report",
    origin: "sample",
    text: [
      "Weekly operations report - Site Oulu (sample)",
      "Metric, Value, Unit",
      "Units produced, 4120, count",
      "Scrap rate, 2.1, %",
      "Overtime hours, 64, hours",
      "On-time delivery, 94, %",
      "Open quality issues, 7, count",
    ].join("\n"),
  },
  {
    name: "Site Tampere — weekly ops report",
    origin: "sample",
    text: [
      "Site Tampere weekly summary (sample)",
      "Metric, Value, Unit",
      "Units produced, 3890, count",
      "Scrap rate, 3.4, %",
      "Overtime hours, 41, hours",
      "On-time delivery, 89, %",
      "Open quality issues, 12, count",
    ].join("\n"),
  },
  {
    name: "Site Vaasa — weekly ops report",
    origin: "sample",
    text: [
      "VAASA - week report (sample; different layout)",
      "metric,value,unit",
      "units produced,2950,count",
      "scrap rate,2.4,%",
      "overtime hours,88,hours",
      "on-time delivery,96,%",
      "open quality issues,5,count",
    ].join("\n"),
  },
];
