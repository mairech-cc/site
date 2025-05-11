import { api } from "./common";

/**
 * Validates the session using Turnstile.
 * 
 * Notice: The API may block malicious requests and requiring you to validate yourself.
 * 
 * @param token The Turnstile token after the challenge is resolved.
 * @returns The trust duration during requests are fully trusted, `-1` if not trusted.
 */
export async function validateTurnstile(token: string) {
  const res = await api.post<{ ok: true; duration: number; } | { ok: false; }>("session/@me/security/check", {
    method: "turnstile",
    token,
  });

  return res.data.ok ? res.data.duration : -1;
}
