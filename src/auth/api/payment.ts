import { z } from "zod";
import { api, numberDateParser } from "./common";

export type ApiPayMethod = {
  /**
 * From free trial. No payment involved.
 * Duration is in days.
 */
  type: "trial";
  duration: number;
} | {
  /**
   * Paid by another user.
   */
  type: "offered";
  from: string;
  message?: string;
} | {
  /**
   * Paid using a card.
   */
  type: "card";
  cardId: string;
  amount: number;
} | {
  /**
   * Paid using a bank transfer.
   */
  type: "transfer";
  accountId: string;
  amount: number;
} | {
  /**
   * Paid using a check.
   * This is only valid within France.
   */
  type: "check";
  accountId: string;
  amount: number;
  billedAt: number;
};

export const payMethodParser = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("trial"),
    duration: z.number().int().positive(),
  }).strict(),
  z.object({
    type: z.literal("offered"),
    from: z.string().uuid(),
    message: z.string().optional(),
  }).strict(),
  z.object({
    type: z.literal("card"),
    cardId: z.string(),
    amount: z.number().int(),
  }).strict(),
  z.object({
    type: z.literal("transfer"),
    accountId: z.string(),
    amount: z.number().int(),
  }).strict(),
  z.object({
    type: z.literal("check"),
    accountId: z.string(),
    amount: z.number().int(),
    billedAt: numberDateParser,
  }).strict(),
]);

export interface BasePayMethod {
  at: number;
}

export const basePayMethodParser = z.object({ at: numberDateParser }).strict();

export interface ApiPayment {
  id: string;
  startDate: number;
  endDate: number;
  method: BasePayMethod & ApiPayMethod;
  status: "succeeded" | "pending" | "failed" | "refunded";
  receiptUrl: string;
  note?: string;
}

export const paymentParser = z.object({
  id: z.string().uuid(),
  startDate: numberDateParser,
  endDate: numberDateParser,
  method: z.intersection(basePayMethodParser, payMethodParser),
  status: z.enum(["succeeded", "pending", "failed", "refunded"]),
  receiptUrl: z.string(),
  note: z.string().optional(),
}).strict();

export async function getPayment(user: string, id: string): Promise<ApiPayment> {
  const res = await api.get(`users/${user}/payments/${id}`);

  return paymentParser.parse(res.data);
}
