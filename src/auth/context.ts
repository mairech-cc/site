import { createContext, useContext } from "react";
import { MagicApi, User } from "./wrapper/main";

export interface AuthContext {
  /**
   * Gets if the context is checking for authentication.
   */
  isChecking(): boolean;
  /**
   * Returns if an authentication is stored and valid.
   */
  isLogged(): boolean;
  /**
   * Enforces the user to the auth page if not logged.
   */
  login(redirectUrl: string): void;
  /**
   * Logs out the user if logged.
   */
  logout(redirectUrl: string): void;
  /**
   * Logs out and logins the user if logged.
   */
  relogin(redirectUrl: string): void;
  /**
   * Gets the logged user.
   */
  getUser(): User | null;
}

export const AuthCtx = createContext<AuthContext | null>(null);
export const ApiCtx = createContext<MagicApi | null>(null);

export function useAuth() {
  const context = useContext(AuthCtx);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export function useApi() {
  const context = useContext(ApiCtx);

  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }

  return context;
}
