import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiCtx, AuthContext, AuthCtx, useApi } from "./context";
import { login, logout, relogin } from "./api/user";
import Turnstile from "react-turnstile";
import IconLoader from "../modules/loader";
import { MagicApi, User } from "./wrapper/main";
import { isAxiosError } from "axios";
import { isCaptchaRequired } from "./api/common";
import Modal from "../modules/modal";

export function AuthProvider({ children, interval }: {
  children: React.ReactNode;
  interval: number;
}) {
  const api = useApi();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const [suspect, setSuspect] = useState(false);
  const [turnstile, setTurnstile] = useState<string | null>(null);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  const update = useCallback(async () => {
    if (suspect) {
      return;
    }

    try {
      const user = await api.getCurrentUser();

      if (user != null) {
        setLoading(false);
      }

      setUser(user);
    } catch (err: unknown) {
      if (isAxiosError(err) && isCaptchaRequired(err)) {
        setSuspect(true);
        return;
      }

      setUser(null);
      setLoading(false);
    }
  }, [api, suspect]);

  useEffect(() => {
    update();

    const id = setInterval(() => {
      update();
    }, interval * 1000);

    return clearInterval.bind(null, id);
  }, [update, interval]);

  useEffect(() => {
    if (turnstile) {
      setCaptchaLoading(true);

      api.validateTurnstile(turnstile)
        .then(duration => {
          if (duration > 0) {
            setSuspect(false);
            setTurnstile(null);
            update();
          } else {
            setSuspect(true);
          }
        }).catch(() => {
          setSuspect(true);
          setCaptchaError(true);
        }).finally(() => {
          setCaptchaLoading(false);
        });
    }
  }, [api, turnstile, update]);

  const ctx: AuthContext = useMemo(() => ({
    getUser: () => user,
    isChecking: () => loading,
    isLogged: () => user != null,
    login: url => login(url),
    logout: url => logout(url),
    relogin: url => relogin(url),
  }), [user, loading]);

  return (
    <AuthCtx.Provider value={ctx}>
      <Modal
        shown={suspect}
        withCloseButton={false}
        size="400px"
        css={{
          position: "relative",
          padding: "2em",
        }}
      >
        {captchaLoading && <div css={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          background: "rgba(0, 0, 0, 0.2)",
        }}>
          <IconLoader />
        </div>}

        <h2>Avant de continuer...</h2>

        <div>
          Nous avons détecté une activité suspecte sur votre compte. Pour continuer, veuillez
          valider que vous n'êtes pas un robot.
        </div>

        <Turnstile
          sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY!}
          fixedSize={true}
          language="fr"
          theme="light"
          size="flexible"
          refreshExpired="auto"
          onSuccess={async token => {
            setTurnstile(token);
          }}
          onError={() => {
            setTurnstile(null);
          }}
        />

        {captchaError && (
          <div css={{
            color: "red",
            fontSize: ".8em",
            textAlign: "center",
          }}>
            Une erreur est survenue lors de la validation du CAPTCHA. Veuillez réessayer.
          </div>
        )}

        <div css={{ fontSize: ".8em" }}>
          mairech.cc s'efforce de limiter les accès automatisés à ses services.
        </div>

        <div css={{
          fontSize: ".8em",
          fontStyle: "italic",
        }}>
          Ce dispositif respecte la vie privée des utilisateurs et ne collecte pas de données
          personnelles.
        </div>

        {/* {createPortal(
        <AnimatePresence>
          {suspect && (
            <>
              <Global
                styles={{
                  "#root": {
                    filter: "blur(5px)",
                  },
                }}
                />

              <motion.div
                key="captcha"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                css={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 10000,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <div css={{
                  position: "relative",
                  background: "lightgray",
                  color: "black",
                  padding: "2em",
                  borderRadius: "1em",
                  maxWidth: "400px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1em",
                  border: "1px solid gray",
                }}>
                  {inner content}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )} */}
      </Modal>

      {children}
    </AuthCtx.Provider>
  );
}

export function ApiProvider({ children, interval }: {
  children: React.ReactNode;
  interval: number;
}) {
  const api = useMemo(() => new MagicApi(), []);

  return (
    <ApiCtx.Provider value={api}>
      <AuthProvider interval={interval}>{children}</AuthProvider>
    </ApiCtx.Provider>
  );
}
