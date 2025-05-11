import { validateTurnstile } from "../api/security";
import { fetchUser, getCurrentUser, getPendingAccount, validateAccount } from "../api/user";
import { Payment } from "./payment";
import { Plan, Subscription } from "./subscription";
import { LightUser, User } from "./user";

export * from "./activity";
export * from "./payment";
export * from "./subscription";
export * from "./user";

export class MagicApi {
  readonly #usersCache: Map<string, User>;
  readonly #paymentsCache: Map<string, Payment>;
  readonly #subscriptionsCache: Map<string, Subscription>;
  readonly #plansCache: Map<string, Plan>;

  public constructor() {
    this.#usersCache = new Map();
    this.#paymentsCache = new Map();
    this.#subscriptionsCache = new Map();
    this.#plansCache = new Map();
  }

  public getCacheUser(id: string): User | null {
    return this.#usersCache.get(id) ?? null;
  }

  public getCachePayment(id: string): Payment | null {
    return this.#paymentsCache.get(id) ?? null;
  }

  public getCacheSubscription(id: string): Subscription | null {
    return this.#subscriptionsCache.get(id) ?? null;
  }

  public getCachePlan(id: string): Plan | null {
    return this.#plansCache.get(id) ?? null;
  }

  public cacheUser(user: User): User {
    this.#usersCache.set(user.id, user);
    return user;
  }

  public cachePayment(payment: Payment): Payment {
    this.#paymentsCache.set(payment.id, payment);
    return payment;
  }

  public cacheSubscription(subscription: Subscription): Subscription {
    this.#subscriptionsCache.set(subscription.id, subscription);
    return subscription;
  }

  public cachePlan(plan: Plan): Plan {
    this.#plansCache.set(plan.id, plan);
    return plan;
  }

  public clearCache(): void {
    this.#usersCache.clear();
    this.#paymentsCache.clear();
    this.#subscriptionsCache.clear();
    this.#plansCache.clear();
  }

  public async validateTurnstile(token: string) {
    return await validateTurnstile(token);
  }

  public async fetchUser(id: string): Promise<LightUser | null> {
    const user = this.getCacheUser(id);

    if (user) {
      return user;
    }

    const remote = await fetchUser(id);

    if (remote && "email" in remote) {
      return this.cacheUser(new User(this, remote));
    }

    return new LightUser(this, remote);
  }

  public async getCurrentUser(): Promise<User | null> {
    return await getCurrentUser()
      .then(user => {
        if (user) {
          return this.cacheUser(new User(this, user));
        }

        return null;
      });
  }

  public async getPendingAccount(state: string) {
    return new LightUser(this, await getPendingAccount(state));
  }

  public async validateAccount(state: string, token: string) {
    return await validateAccount(state, token);
  }
}
