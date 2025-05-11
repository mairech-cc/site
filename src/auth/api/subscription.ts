import { z } from "zod";
import { api, numberDateParser } from "./common";
import { ApiPayment, paymentParser } from "./payment";
import { ApiReason } from "./activity";

export interface ApiLightSubscription {
  id: string;
  subscription: string;
  subscribedAt: number;
  status: "active" | "cancelled" | "expired";
  billing: boolean;
}

export const lightSubscriptionParser = z.object({
  id: z.string().uuid(),
  subscription: z.string(),
  subscribedAt: numberDateParser,
  status: z.enum(["active", "cancelled", "expired"]),
  billing: z.boolean(),
}).strict();

export interface ApiSubscription extends ApiLightSubscription {
  /**
   * Default to `-1` is not canceled.
   */
  canceledAt: number;
  payments: ApiPayment[];
}

export const subscriptionParser = lightSubscriptionParser.extend({
  canceledAt: numberDateParser,
  payments: z.array(paymentParser),
}).strict();

export interface ApiPlanPricing {
  mode: "monthly" | "yearly";
  trial: number;
  price: number;
}

export const planPricingParser = z.object({
  mode: z.enum(["monthly", "yearly"]),
  trial: z.number().int().nonnegative(),
  price: z.number().int().positive(),
}).strict();

export interface ApiPlanFeature {
  name: string;
  available: number;
  advanced: boolean;
}

export const planFeatureParser = z.object({
  name: z.string(),
  available: z.number(),
  advanced: z.boolean(),
}).strict();

export interface ApiPlan {
  group: string;
  id: string;
  displayName: string;
  features: ApiPlanFeature[];
  pricing: ApiPlanPricing;
}

export const planParser = z.object({
  group: z.string(),
  id: z.string().uuid(),
  displayName: z.string(),
  features: planFeatureParser.array(),
  pricing: planPricingParser,
})

export async function getSubscription(user: string, id: string): Promise<ApiSubscription> {
  const res = await api.get(`users/${user}/subscriptions/${id}`);

  return subscriptionParser.parse(res.data);
}

export async function cancelSubscription(user: string, id: string, reason: ApiReason) {
  await api.post(`users/${user}/subscriptions/${id}/cancel`, {
    params: {
      reason
    }
  });
}

export async function getPossiblePlans(): Promise<ApiPlan[]> {
  const res = await api.get("subscriptions/plans");
  
  return planParser.array().parse(res.data);
}

export async function getPlan(id: string): Promise<ApiPlan> {
  const res = await api.get(`subscriptions/plans/${id}`);

  return planParser.parse(res.data);
}
