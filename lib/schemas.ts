import { z } from "zod";

export const GeneratePackRequestSchema = z.object({
  input: z.string().min(1).max(500),
});

export const TargetCompanySchema = z.object({
  name: z.string(),
  domain: z.string(),
  inputRaw: z.string(),
  snapshot: z.string(),
  industryHint: z.string().nullable(),
  sizeHint: z.string().nullable(),
});

export const PublicSignalSchema = z.object({
  id: z.string(),
  sourceLabel: z.string(),
  sourceUrl: z.string(),
  excerpt: z.string(),
  whyItMatters: z.string(),
});

export const OpportunityHypothesisSchema = z.object({
  id: z.string(),
  title: z.string(),
  valueScore: z.number().min(1).max(5),
  effortScore: z.number().min(1).max(5),
  rank: z.number().int().min(1),
  rationale: z.string(),
  tryFirst: z.string(),
  confidence: z.enum(["high", "medium", "low"]),
  signalIds: z.array(z.string()),
});

export const OutreachDraftSchema = z.object({
  channel: z.enum(["email", "linkedin"]),
  addresseeRole: z.string(),
  subject: z.string().nullable(),
  body: z.string(),
  draftLabel: z.string(),
  relatedOpportunityIds: z.array(z.string()),
});

export const ProofPackSchema = z.object({
  status: z.enum(["complete", "partial", "error"]),
  company: TargetCompanySchema.nullable(),
  signals: z.array(PublicSignalSchema),
  opportunities: z.array(OpportunityHypothesisSchema).max(5),
  drafts: z.array(OutreachDraftSchema),
  gaps: z.array(z.string()),
  generatedAt: z.string(),
  warnings: z.array(z.string()),
});

export const ErrorBodySchema = z.object({
  error: z.string(),
});

export type GeneratePackRequest = z.infer<typeof GeneratePackRequestSchema>;

export const GenerateAuditRequestSchema = z.object({
  input: z.string().min(1).max(500),
});

export const LeakSchema = z.object({
  id: z.string(),
  title: z.string(),
  impactScore: z.number().min(1).max(5),
  effortScore: z.number().min(1).max(5),
  rank: z.number().int().min(1),
  rationale: z.string(),
  tryFirst: z.string(),
  confidence: z.enum(["high", "medium", "low"]),
  signalIds: z.array(z.string()),
  conceptualFix: z.string(),
  stagingPreviewHtml: z.string().nullable(),
});

export const AuditOutreachDraftSchema = z.object({
  channel: z.enum(["email", "linkedin"]),
  addresseeRole: z.string(),
  subject: z.string().nullable(),
  body: z.string(),
  draftLabel: z.string(),
  relatedLeakIds: z.array(z.string()),
});

export const AuditPackSchema = z.object({
  status: z.enum(["complete", "partial", "error"]),
  mode: z.literal("aggressive-auditor"),
  company: TargetCompanySchema.nullable(),
  signals: z.array(PublicSignalSchema),
  leaks: z.array(LeakSchema).max(5),
  drafts: z.array(AuditOutreachDraftSchema),
  gaps: z.array(z.string()),
  generatedAt: z.string(),
  warnings: z.array(z.string()),
});

export type GenerateAuditRequest = z.infer<typeof GenerateAuditRequestSchema>;
