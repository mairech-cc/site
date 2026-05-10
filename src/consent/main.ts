import { create } from "zustand/react";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import z from "zod";
import { JSONWebKeySet, createLocalJWKSet, jwtVerify } from "jose";
import { GroupParser, GroupsParser, ServiceParser } from "./zod";
import { api } from "../auth/api/common";

const commitHash = import.meta.env.VITE_GIT_COMMIT_HASH as string;

export type Group = z.infer<typeof GroupParser>;
export type Groups = z.infer<typeof GroupsParser>;
export type Service = z.infer<typeof ServiceParser>;

export interface ConsentData {
  hasConsent: boolean;
  services: string[];
  token?: string;
}

export interface CookieConsent {
  groups: Groups;
  services: Service[];
  servicesHash?: string;
  consent: ConsentData;
  jwks?: JSONWebKeySet & { at: number; hash?: string; };
  localKeySet?: typeof createLocalJWKSet extends (...args: never[]) => infer U ? U : never;

  fetchServices(): Promise<void>;
  validateConsent(services: string[]): Promise<void>;
  getKeySet(): Promise<NonNullable<CookieConsent["localKeySet"]>>;
  hydrateFrom(token: string): Promise<void>;
}

export const useCookieConsent = create(persist(immer<CookieConsent>((set, get) => ({
  groups: {},
  services: [],
  consent: {
    hasConsent: false,
    services: [],
  },

  async fetchServices() {
    const { servicesHash } = get();

    if (servicesHash && servicesHash == commitHash) {
      return;
    }

    const result = await api.get("/consent/services");
    set(prev => {
      if (!commitHash) {
        console.warn("Built without `VITE_GIT_COMMIT_HASH`, version diffing cannot be done. " +
          "It will refetch services each reload.");
      }

      prev.groups = GroupsParser.parse(result.data.groups);
      prev.services = ServiceParser.array().parse(result.data.services);
      prev.servicesHash = commitHash;
    });
  },

  async validateConsent(services: string[]) {
    const result = await api.post("/consent/validate", { services });
    get().hydrateFrom(result.data);
  },

  async getKeySet() {
    const { localKeySet, jwks } = get();

    if (localKeySet) {
      return localKeySet;
    }

    if (
      jwks &&
      "hash" in jwks &&
      jwks.hash == commitHash &&
      jwks.at + 7 * 24 * 3600 * 1000 >= Date.now()
    ) {
      const keySet = createLocalJWKSet(jwks!);

      set(prev => {
        prev.localKeySet = keySet;
      });

      return keySet;
    }

    const remoteKeys = await api.get("/consent/jwks.json");
    const keySet = createLocalJWKSet(remoteKeys.data);

    set(prev => {
      if (!commitHash) {
        console.warn("Built without `VITE_GIT_COMMIT_HASH`, version diffing cannot be done. " +
          "It will refetch JWKS each reload.");
      }

      prev.jwks = { ...remoteKeys.data, at: Date.now(), hash: commitHash };
      prev.localKeySet = keySet;
    });

    return keySet;
  },

  async hydrateFrom(token: string) {
    const { getKeySet } = get();

    try {
      const jws = await jwtVerify(token, await getKeySet());

      set(prev => {
        prev.consent = {
          hasConsent: true,
          services: jws.payload.services as string[],
          token,
        }
      });
    } catch {
      set(prev => {
        prev.consent = {
          hasConsent: false,
          services: [],
        };
      });
    }
  }
})), { name: "__consent" }));

/**
 * This hook should be used on components required a service.
 * 
 * Note: This returns always `false` before any consent by user.
 * 
 * @returns `true` if all passed services are consented, `false` otherwises.
 */
export function useHasConsent(services: string[]): boolean {
  const consented = useCookieConsent(v => v.consent.services);

  return services.every(v => consented.includes(v));
}

// Hydratation of consent state.
const state = useCookieConsent.getState();

await state.fetchServices();

if (state.consent.token) {
  await state.hydrateFrom(state.consent.token);
} else if (state.consent.hasConsent) {
  useCookieConsent.setState(prev => {
    prev.consent.hasConsent = false;
    prev.consent.services = [];
  });
}
