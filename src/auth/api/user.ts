import { z } from "zod";
import { api, baseURL, numberDateParser } from "./common";
import { ApiLightSubscription, lightSubscriptionParser } from "./subscription";

export interface ApiLightUser {
  id: string;
  name: string;
}

export const lightUserParser = z.object({
  id: z.string().uuid(),
  name: z.string(),
}).strict();

export interface ApiUser extends ApiLightUser {
  email: string;
  createdAt: number;
  subscriptions: ApiLightSubscription[];
}

export const userParser = lightUserParser.extend({
  email: z.string().email(),
  createdAt: numberDateParser,
  subscriptions: z.array(lightSubscriptionParser),
}).strict();

export async function getCurrentUser(): Promise<ApiUser> {
  const res = await api.get("session/@me");

  return userParser.parse(res.data);
}

export async function fetchUser(id: string): Promise<ApiUser | ApiLightUser> {
  const res = await api.get(`users/${id}`);
  return lightUserParser.or(userParser).parse(res.data);
}

export async function deleteUser(id: string) {
  await api.delete(`users/${id}`);
}

export function login(redirectUrl: string) {
  window.location.href = new URL(`login?target=${encodeURIComponent(redirectUrl)}`, baseURL).href;
}

export function logout(redirectUrl: string) {
  window.location.href = new URL(`logout?target=${encodeURIComponent(redirectUrl)}`, baseURL).href;
}

export function relogin(redirectUrl: string) {
  const loginUrl = new URL(`login?target=${encodeURIComponent(redirectUrl)}`, baseURL).href;
  logout(loginUrl);
}

export async function getPendingAccount(state: string): Promise<ApiLightUser> {
  const res = await api.get(`session/${state}`);

  return lightUserParser.parse(res.data);
}

export async function validateAccount(state: string, token: string) {
  const res = await api.post(`session/${state}`, {
    security: {
      method: "turnstile",
      token,
    },
    meta: {}
  });

  return z.object({ next: z.string() }).parse(res.data);
}
