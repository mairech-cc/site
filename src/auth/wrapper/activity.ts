import { ApiActivity } from "../api/activity";
import { MagicApi } from "./main";

export type PA<A extends ApiActivity> = A extends unknown ? [A["context"], A["action"]] : never;
export type Action<A extends ApiActivity, C extends A["context"]> = PA<A> extends infer K ? K extends [C, infer U] ? U : never : never;
export type Data<A extends ApiActivity, C extends A["context"], Ac extends Action<A, C>> = A extends infer K ? K extends {
  context: C;
  action: Ac;
  data: infer U;
} ? U : never : never;

export class Activity<
  C extends ApiActivity["context"] = ApiActivity["context"],
  A extends Action<ApiActivity, C> = Action<ApiActivity, C>,
  D extends Data<ApiActivity, C, A> = Data<ApiActivity, C, A>,
> {
  readonly #root: MagicApi;

  readonly #context: C;
  readonly #action: A;
  readonly #data: D;
  readonly #at: Date;

  public constructor(root: MagicApi, activity: ApiActivity) {
    this.#root = root;
    this.#context = activity.context as C;
    this.#action = activity.action as A;
    this.#data = activity.data as D;
    this.#at = new Date(activity.at);
  }

  public get context(): C {
    return this.#context;
  }

  public get action(): A {
    return this.#action;
  }

  public get data(): D {
    return this.#data;
  }

  public get at(): Date {
    return this.#at;
  }

  public isType<T1 extends C, T2 extends Action<ApiActivity, T1>>(c: T1, a: T2): this is Activity<T1, T2> {
    return this.#context == c && this.#action == a as unknown;
  }
}
