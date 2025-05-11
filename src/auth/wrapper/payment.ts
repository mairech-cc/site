import { ApiPayment, ApiPayMethod } from "../api/payment";
import { Subscription } from "./subscription";

export class Payment {
  public readonly subscription: Subscription;

  readonly #id: string;
  readonly #startDate: Date;
  readonly #endDate: Date;
  readonly #method: UnknownPayMethod;
  #status: "succeeded" | "pending" | "failed" | "refunded";
  readonly #receiptUrl: string;
  #note?: string;

  public constructor(subscription: Subscription, payment: ApiPayment) {
    this.subscription = subscription;

    this.#id = payment.id;
    this.#startDate = new Date(payment.startDate);
    this.#endDate = new Date(payment.endDate);
    this.#method = this.#parseMethod(payment.method);
    this.#status = payment.status;
    this.#receiptUrl = payment.receiptUrl;
    this.#note = payment.note;
  }

  #parseMethod(method: ApiPayMethod): UnknownPayMethod {
    switch (method.type) {
      case "trial":
        return new TrialPayMethod(method.duration);
      case "offered":
        return new OfferedPayMethod(method.from, method.message);
      case "card":
        return new CardPayMethod(method.cardId, method.amount);
      case "transfer":
        return new TransferPayMethod(method.accountId, method.amount);
      case "check":
        return new CheckPayMethod(method.accountId, method.amount, new Date(method.billedAt));
    }
  }

  public get id(): string {
    return this.#id;
  }

  public get startDate(): Date {
    return this.#startDate;
  }

  public get endDate(): Date {
    return this.#endDate;
  }

  public get method(): UnknownPayMethod {
    return this.#method;
  }

  public get status(): "succeeded" | "pending" | "failed" | "refunded" {
    return this.#status;
  }

  public set status(status: "succeeded" | "pending" | "failed" | "refunded") {
    this.#status = status;
  }

  public get receiptUrl(): string {
    return this.#receiptUrl;
  }

  public get note(): string | undefined {
    return this.#note;
  }

  public set note(note: string | undefined) {
    this.#note = note;
  }
}

export class TrialPayMethod {
  readonly #duration: number;

  public constructor(duration: number) {
    this.#duration = duration;
  }

  public get type(): "trial" {
    return "trial";
  }

  public get duration(): number {
    return this.#duration;
  }
}

export class OfferedPayMethod {
  readonly #from: string;
  readonly #message?: string;

  public constructor(from: string, message?: string) {
    this.#from = from;
    this.#message = message;
  }

  public get type(): "offered" {
    return "offered";
  }

  public get from(): string {
    return this.#from;
  }

  public get message(): string | undefined {
    return this.#message;
  }
}

export class CardPayMethod {
  readonly #cardId: string;
  readonly #amount: number;

  public constructor(cardId: string, amount: number) {
    this.#cardId = cardId;
    this.#amount = amount;
  }

  public get type(): "card" {
    return "card";
  }

  public get cardId(): string {
    return this.#cardId;
  }

  public get amount(): number {
    return this.#amount;
  }
}

export class TransferPayMethod {
  readonly #accountId: string;
  readonly #amount: number;

  public constructor(accountId: string, amount: number) {
    this.#accountId = accountId;
    this.#amount = amount;
  }

  public get type(): "transfer" {
    return "transfer";
  }

  public get accountId(): string {
    return this.#accountId;
  }

  public get amount(): number {
    return this.#amount;
  }
}

export class CheckPayMethod {
  readonly #accountId: string;
  readonly #amount: number;
  readonly #billedAt: Date;

  public constructor(accountId: string, amount: number, billedAt: Date) {
    this.#accountId = accountId;
    this.#amount = amount;
    this.#billedAt = billedAt;
  }

  public get type(): "check" {
    return "check";
  }

  public get accountId(): string {
    return this.#accountId;
  }

  public get amount(): number {
    return this.#amount;
  }

  public get billedAt(): Date {
    return this.#billedAt;
  }
}

export type UnknownPayMethod = TrialPayMethod | OfferedPayMethod | CardPayMethod | TransferPayMethod | CheckPayMethod;
