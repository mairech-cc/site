import z from "zod";

export const GroupParser = z.object({
  text: z.string(),
  description: z.string(),
  required: z.boolean(),
});

export const GroupName = z.enum(["essentials", "analytics", "security"])

export const GroupsParser = z.record(GroupName, GroupParser);

export const ServiceParser = z.object({
  id: z.string(),
  name: z.string(),
  purpose: z.string(),
  collected: z.string().array(),
  sentTo: z.object({
    country: z.string(),
    recipient: z.string(),
  }).optional(),
  retention: z.string().optional(),
  links: z.string().url().array(),
  group: GroupName,
});
