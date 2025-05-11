import { ApiReason } from "../api/activity";
import { ApiLightSubscription, ApiPlan, ApiPlanFeature, ApiPlanPricing, ApiSubscription, cancelSubscription, getPlan } from "../api/subscription";
import { MagicApi } from "./main";
import { Payment } from "./payment";
import { User } from "./user";

export class LightSubscription {
  public readonly user: User;

  readonly #id: string;
  readonly #subscription: string;
  readonly #subscribedAt: Date;
  #status: "active" | "cancelled" | "expired";
  readonly #billing: boolean;

  public constructor(user: User, subscription: ApiLightSubscription) {
    this.user = user;
    this.#id = subscription.id;
    this.#subscription = subscription.subscription;
    this.#subscribedAt = new Date(subscription.subscribedAt);
    this.#status = subscription.status;
    this.#billing = subscription.billing;
  }

  public get id(): string {
    return this.#id;
  }

  public get subscription(): string {
    return this.#subscription;
  }

  public get subscribedAt(): Date {
    return this.#subscribedAt;
  }

  public get status(): "active" | "cancelled" | "expired" {
    return this.#status;
  }

  public get billing(): boolean {
    return this.#billing;
  }

  public async fetch(): Promise<Subscription | null> {
    const subscription = await this.user.getSubscription(this.#id);

    if (subscription) {
      return subscription;
    } else {
      return null;
    }
  }
}

export class Subscription extends LightSubscription {
  readonly #canceledAt: Date;
  readonly #payments: Payment[];

  public constructor(user: User, subscription: ApiSubscription) {
    super(user, subscription);
    this.#canceledAt = new Date(subscription.canceledAt);
    this.#payments = subscription.payments.map(payment => new Payment(this, payment));
  }

  public get canceledAt(): Date {
    return this.#canceledAt;
  }

  public get payments(): Payment[] {
    return this.#payments;
  }

  public get isCanceled(): boolean {
    return this.#canceledAt.getTime() !== -1;
  }

  public get isActive(): boolean {
    return this.status == "active" && !this.isCanceled;
  }

  public async fetch(): Promise<Subscription> {
    return this;
  }

  public async cancel(reason: ApiReason): Promise<void> {
    await cancelSubscription(this.user.id, this.id, reason);
  }

  public async getPlan(): Promise<Plan | null> {
    const plan = this.user.root.getCachePlan(this.subscription);

    if (plan) {
      return plan;
    }

    const remote = await getPlan(this.subscription);

    if (remote) {
      return this.user.root.cachePlan(new Plan(this.user.root, remote));
    }

    return null;
  }
}

export class Plan {
  public readonly root: MagicApi;

  readonly #group: string;
  readonly #id: string;
  readonly #displayName: string;
  readonly #features: ApiPlanFeature[];
  readonly #pricing: ApiPlanPricing;

  public constructor(root: MagicApi, plan: ApiPlan) {
    this.root = root;
    this.#group = plan.group;
    this.#id = plan.id;
    this.#displayName = plan.displayName;
    this.#features = plan.features;
    this.#pricing = plan.pricing;
  }

  public get group(): string {
    return this.#group;
  }

  public get id(): string {
    return this.#id;
  }

  public get displayName(): string {
    return this.#displayName;
  }

  public get features(): ApiPlanFeature[] {
    return this.#features;
  }

  public get pricing(): ApiPlanPricing {
    return this.#pricing;
  }
}
