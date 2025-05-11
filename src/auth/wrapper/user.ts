import { getActivity } from "../api/activity";
import { getSubscription } from "../api/subscription";
import { ApiLightUser, ApiUser, fetchUser } from "../api/user";
import { Activity } from "./activity";
import { MagicApi } from "./main";
import { LightSubscription, Subscription } from "./subscription";

export class LightUser {
  public readonly root: MagicApi;

  readonly #id: string;
  readonly #name: string;

  public constructor(root: MagicApi, user: ApiLightUser) {
    this.root = root;

    this.#id = user.id;
    this.#name = user.name;
  }

  public get id(): string {
    return this.#id;
  }

  public get name(): string {
    return this.#name;
  }

  /**
   * Fetches the full user object from the API.
   * @returns The full user object or null if the full user cannot be fetched.
   */
  public async fetch(): Promise<User | null> {
    const user = await fetchUser(this.#id);

    if ("email" in user) {
      return new User(this.root, user);
    }

    return null;
  }
}

export class User extends LightUser {
  public readonly root: MagicApi;

  readonly #email: string;
  readonly #createdAt: Date;
  readonly #subscriptions: LightSubscription[];

  public constructor(root: MagicApi, user: ApiUser) {
    super(root, user);
    this.root = root;
    this.#email = user.email;
    this.#createdAt = new Date(user.createdAt);
    this.#subscriptions = user.subscriptions.map(subscription => new LightSubscription(this, subscription));
  }

  public get email(): string {
    return this.#email;
  }

  public get createdAt(): Date {
    return this.#createdAt;
  }

  public get subscriptions(): LightSubscription[] {
    return this.#subscriptions;
  }

  public fetch(): Promise<User> {
    return Promise.resolve(this);
  }

  public async getActivity(limit: number = 50, startDate?: Date): Promise<Activity[]> {
    const logs = await getActivity(this.id, limit, startDate);
    return logs.map(activity => new Activity(this.root, activity));
  }

  public async getSubscription(id: string): Promise<Subscription | null> {
    const subscription = this.root.getCacheSubscription(id);

    if (subscription) {
      return subscription;
    }

    const remote = await getSubscription(this.id, id);

    if (remote) {
      return this.root.cacheSubscription(new Subscription(this, remote));
    }

    return null;
  }
}
