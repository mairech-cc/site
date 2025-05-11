import { z, ZodType } from "zod";
import { api, numberDateParser } from "./common";

export enum ApiReason {
  /** From an user request. */
  UserRequest,
  /** From an internal system error. */
  SystemError,
  /** From an automated moderation (OCR...)  */
  AutomatedModeration,
  /** From an human moderation. */
  PolicyViolation,
  /** From a failure of the transaction. */
  PaymentFailure,
  /** From a decline of the payment. */
  PaymentDeclined,
  /** From the suspension of the account. */
  AccountSuspension,
  /** From the fraud detector. */
  FraudDetection,
  /** From a service downtime. */
  ServiceDowntime,
  /** From the expiration of the subscription. */
  SubscriptionExpired,
  /** From the user manual deactivation. */
  AccountDeactivation,
  /** From a legal action. */
  LegalAction,
  /** From a subscription upgrade */
  SubscriptionUpgrade,
  /** From a subscription downgrade */
  SubscriptionDowngrade,
}

export function formatReason(reason: ApiReason) {
  return ({
    [ApiReason.UserRequest]: "Action de l'utilisateur",
    [ApiReason.SystemError]: "Erreur système",
    [ApiReason.AutomatedModeration]: "Modération automatique",
    [ApiReason.PolicyViolation]: "Voliation des politiques",
    [ApiReason.PaymentFailure]: "Erreur de paiement",
    [ApiReason.PaymentDeclined]: "Paiement refusé",
    [ApiReason.AccountSuspension]: "Compte suspendu",
    [ApiReason.FraudDetection]: "Détection de fraude",
    [ApiReason.ServiceDowntime]: "Service en panne",
    [ApiReason.SubscriptionExpired]: "Abonnement expiré",
    [ApiReason.AccountDeactivation]: "Compte désactivé",
    [ApiReason.LegalAction]: "Action légale",
    [ApiReason.SubscriptionUpgrade]: "Mise à jour de l'abonnement",
    [ApiReason.SubscriptionDowngrade]: "Réduction de l'abonnement",
  })[reason];
}

export type BaseActivity<T extends `${string}.${string}`, P> = T extends `${infer C}.${infer A}` ? {
  action: A;
  at: number;
  context: C;
  data: P;
} : never;

const base = z.object({ at: numberDateParser });

function action<C extends string, A extends string, P extends ZodType>(context: C, action: A, data: P) {
  return base.extend({
    context: z.literal(context),
    action: z.literal(action),
    data,
  }).strict();
}

const identifiedParser = z.object({ id: z.string().uuid() });

const actionParser = z.union([
  action("user", "create", z.object({ })),
  action("user", "login", z.object({ location: z.string() })),
  action("chat", "new", identifiedParser.extend({ title: z.string() })),
  action("chat", "delete", identifiedParser.extend({ title: z.string() })),
  action("file", "upload", identifiedParser.extend({ name: z.string(), size: z.number().int().positive() })),
  action("file", "delete", identifiedParser.extend({ name: z.string(), size: z.number().int().positive() })),
  action("file", "moderated", identifiedParser.extend({ reason: z.nativeEnum(ApiReason) })),
  action("subscription", "created", identifiedParser.extend({ paymentId: z.string().uuid().optional() })),
  action("subscription", "cancelled", identifiedParser.extend({ reason: z.nativeEnum(ApiReason) })),
  action("subscription", "renewed", identifiedParser.extend({ paymentId: z.string().uuid() })),
  action("subscription", "paused", identifiedParser.extend({ reason: z.nativeEnum(ApiReason) })),
  action("subscription", "reactivated", identifiedParser),
  action("payment", "billed", identifiedParser.extend({ parentId: z.string().uuid() })),
  action("payment", "failed", identifiedParser.extend({ reason: z.nativeEnum(ApiReason) })),
  action("payment", "refunded", identifiedParser.extend({ reason: z.nativeEnum(ApiReason) })),
  action("payment", "succeeded", identifiedParser.extend({ amount: z.number().int() })),
]);

export type ApiActivity = z.infer<typeof actionParser>;

// export type ApiActivity1 = BaseActivity<"user.login", { location: string; }>
//   | BaseActivity<"user.updated", { property: "firstname" | "surname", oldValue: string, newValue: string; }>
//   | BaseActivity<"chat.new", { id: string; title: string; }>
//   | BaseActivity<"chat.delete", { id: string; title: string; }>
//   | BaseActivity<"file.upload", { id: string; name: string; size: number; }>
//   | BaseActivity<"file.delete", { id: string; name: string; size: number; }>
//   | BaseActivity<"file.moderated", { id: string; reason: ApiReason; }>
//   | BaseActivity<"subscription.created", { id: string; paymentId?: string; }>
//   | BaseActivity<"subscription.cancelled", { id: string; reason: ApiReason; }>
//   | BaseActivity<"subscription.renewed", { id: string; paymentId: string; }>
//   | BaseActivity<"subscription.paused", { id: string; reason: string; }>
//   | BaseActivity<"subscription.reactivated", { id: string; }>
//   | BaseActivity<"payment.billed", { parentId: string; id: string; }>
//   | BaseActivity<"payment.failed", { id: string; reason: ApiReason; }>
//   | BaseActivity<"payment.refunded", { id: string; reason: ApiReason; }>
//   | BaseActivity<"payment.succeeded", { id: string; amount: number; }>;

export async function getActivity(id: string, limit: number = 50, startDate?: Date): Promise<ApiActivity[]> {
  const startTimestamp = startDate ? startDate.getTime() : undefined;

  const res = await api.get(`users/${id}/logs`, {
    params: {
      limit,
      startTimestamp,
    },
  });

  return actionParser.array().parse(res.data);
}
