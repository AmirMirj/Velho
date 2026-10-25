import { formatEur } from "./business-case.ts";
import { findDemoType } from "./demonstrations.ts";
import type { BusinessCase, DemoTypeId, ExampleCompany, MeetingDraft, Signal } from "./types.ts";

export const DRAFT_LABEL = "Internal draft — never sent";
export const ADDRESSEE = "COO / Head of Operations";

function lowerFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

export function buildMeetingDraft(
  company: ExampleCompany,
  signal: Signal,
  demoId: DemoTypeId,
  bc: BusinessCase
): MeetingDraft {
  const demo = findDemoType(demoId);
  const subject = `${company.name}: a 30-minute look at ${demo.name.toLowerCase()}`;
  const body = [
    `Hello [Name],`,
    ``,
    `We noticed that ${lowerFirst(signal.evidence[0]?.text ?? signal.title)} Our working hypothesis — and it is only a hypothesis — is that ${lowerFirst(signal.hypothesis)}`,
    ``,
    `To test this rather than pitch it, we sketched a small ${demo.name.toLowerCase()} proof: ${demo.steps.slice(0, 2).map(lowerFirst).join(", then ")}. Using illustrative assumptions (${bc.clamped.hoursPerWeek} h/week, ${bc.clamped.automationPct}% automated, ${bc.clamped.costPerHour} €/h), that would free roughly ${bc.hoursPerYear} hours a year — about ${formatEur(bc.annual)} in capacity value, not guaranteed savings.`,
    ``,
    `Would you be open to a 30-minute conversation to check whether the assumption holds? If it does not, we will tell you so.`,
    ``,
    `Best regards,`,
    `[Your name], Velho`,
  ].join("\n");
  return { addressee: ADDRESSEE, subject, body, label: DRAFT_LABEL };
}
