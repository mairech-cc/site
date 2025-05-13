import { Global } from "@emotion/react";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { LightUser } from "../auth/wrapper/main";
import { useApi } from "../auth/context";
import { IconAlertTriangle, IconInfoCircle } from "@tabler/icons-react";
import Turnstile from "react-turnstile";
import { Button } from "../modules/button";
import Modal, { LoaderModal } from "../components/modal/main";
import { useDocumentTitle } from "../utils/dom";
import { useConfetti } from "../modules/confetti";

export default function SignUp() {
  const { state } = useParams();
  const api = useApi();
  const confetti = useConfetti();

  const [title, setTitle] = useDocumentTitle();

  useEffect(() => {
    if (title != "Validez votre compte") {
      setTitle("Validez votre compte");
    }
  }, [title, setTitle]);

  const [user, setUser] = useState<LightUser | "loading" | null>("loading");

  const [consent, setConsent] = useState(false);
  const [eu, setEU] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [countryModal, setCountryModal] = useState(false);
  const [okModal, setOkModal] = useState<false | { next: string; }>(false);
  const [error, setError] = useState<ReactNode>();

  // const isValid = consent && eu && !!turnstileToken;

  const update = useCallback(async () => {
    if (!state) {
      setUser(null);
      return;
    }

    try {
      const res = await api.getPendingAccount(state);

      if (res) {
        setUser(res);
      }
    } catch {
      setUser(null);
    }
  }, [api, state]);

  useEffect(() => {
    update();
  }, [update]);

  const validate = async () => {
    if (!state || !user || !consent || !eu || !turnstileToken || loading) {
      const elements: ReactNode[] = [];

      if (!state) {
        elements.push(<li key="state">L'état n'est pas donné.</li>);
      }

      if (!user) {
        elements.push(<li key="user">L'utilisateur n'est pas chargé.</li>);
      }

      if (!consent) {
        elements.push(<li key="consent">Vous devez accepter les conditions d'utilisation et la politique de confidentialité</li>);
      }

      if (!eu) {
        elements.push(<li key="eu">Vous devez confirmer que vous vivez dans un État européen.</li>);
      }

      if (!turnstileToken) {
        elements.push(<li key="captcha">Vous devez valider le CAPTCHA.</li>);
      }

      if (loading) {
        elements.push(<li key="loading">Le formulaire est déjà en chargement.</li>);
      }

      setError(
        <>
          <p>Il y a des erreurs :</p>

          <ul css={{ paddingLeft: "1em" }}>{elements}</ul>
        </>
      );
      return;
    }

    try {
      setLoading(true);
      const res = await api.validateAccount(state, turnstileToken);
      setOkModal(res);
    } catch (err) {
      setError("Impossible de valider votre compte pour le moment. Réessayer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (okModal) {
      confetti.addConfetti();
    }
  }, [okModal, confetti]);

  return (
    <>
      <LoaderModal shown={loading} />

      <Global styles={[{
        "#root": {
          position: "absolute",
          inset: 0,
        }
      }, (user != null && user != "loading") ? {
        "#root": {
          display: "flex",
          justifyContent: "center",
        }
      } : {
        "#root": {
          display: "grid",
          placeItems: "center",
        }
      }]} />

      <div css={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "1em",
        maxWidth: "30em",
        margin: "2em",

        "& *": {
          margin: 0,
        }
      }}>
        {user == "loading" && (
          <p>
            Chargement...
          </p>
        )}

        {user == null ? (
          <>
            <Link to="/">
              ← Retour à l'accueil
            </Link>

            <div css={{
              display: "flex",
              background: "#ffa8a8",
              gap: "1em",
              padding: "1em",
              borderRadius: "1em",
              border: "1px gray solid",
              alignItems: "start",

              "@media (prefers-color-scheme: dark)": {
                background: "#ff4d4d",
                border: "1px black solid",
              },
            }}>
              <IconAlertTriangle size="3em" />

              <span>
                Impossible de charger correctement. Peut-être que l'état est déjà validé ou n'est plus valide.
              </span>
            </div>
          </>
        ) : user != "loading" ? (
          <>
            <h1 css={{ overflowWrap: "anywhere", width: "auto" }}>
              Validez votre compte 🧑‍🍳
            </h1>

            <p>
              Vous vous êtes connecté avec un compte Microsoft que nous ne connaissons pas encore.
              Vous devez donc l'enregistrer pour pouvoir continuer.
            </p>

            <div css={{
              display: "flex",
              justifyContent: "space-between",
              gap: ".5em",
              flexWrap: "wrap",
              margin: "1em 0",
            }}>
              <p>
                Nom
              </p>

              <p>
                {user.name || <em>Pas de nom</em>}
              </p>
            </div>

            <div css={{ display: "flex", gap: "1em", alignItems: "center" }}>
              <input id="form-consent" type="checkbox" checked={consent} onChange={e => setConsent(e.currentTarget.checked)} />

              <label htmlFor="form-consent">
                J'accepte les conditions d'utilisation et la politique de confidentialité.
              </label>
            </div>

            <div css={{ display: "flex", gap: "1em", alignItems: "center" }}>
              <input id="form-eu" type="checkbox" checked={eu} onChange={e => setEU(e.currentTarget.checked)} />

              <label htmlFor="form-eu">
                Je vis dans un État européen.<sup>1</sup>
              </label>
            </div>

            <Turnstile
              sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY!}
              fixedSize={true}
              language="fr"
              size="flexible"
              refreshExpired="auto"
              onSuccess={async token => setTurnstileToken(token)}
              onError={() => setTurnstileToken(null)}
              onExpire={() => setTurnstileToken(null)}
            />

            {error && (
              <div css={{
                background: "#ff7474",
                padding: "1em",
                display: "grid",
                gap: "1em",
                gridTemplateColumns: "auto 1fr",
                borderRadius: "1em",
                border: "1px solid gray",

                "@media (prefers-color-scheme: dark)": {
                  background: "#ff6060",
                }
              }}>
                <span><IconAlertTriangle /></span>

                <div css={{ display: "flex", flexDirection: "column", gap: ".5em" }}>{error}</div>
              </div>
            )}

            <Button disabled={loading} onClick={validate}>
              Valider
            </Button>

            <Modal shown={okModal != false} withCloseButton={false} size="25em">
              <h2 css={{ textAlign: "center", margin: ".5em 0" }}>
                Votre compte est maintenant validé !
              </h2>

              <div>
                Vous pouvez utiliser votre compte dès maintenant et retourner à la page où vous étiez précédemment !
              </div>

              <a href={okModal ? okModal.next : "/"}>
                <Button css={{ width: "100%" }}>
                  Retour
                </Button>
              </a>

              <a href="/">
                ← À l'accueil
              </a>
            </Modal>

            <Link to="/">
              ← Ne rien faire
            </Link>

            <hr css={{ border: "1px gray solid", margin: "1em" }} />

            <p css={{ fontSize: ".8em" }}>
              Si vous ne continuez pas, pensez à <a
                href="https://microsoft.com/consent"
                target="_blank"
                referrerPolicy="no-referrer"
              >
                retirer la connexion à votre compte
              </a>, nous ne sommes pas en mesure de le faire à votre place.
            </p>

            <p css={{ fontSize: ".8em" }}>
              Nous conservons une copie de vos informations pendant une durée de 24 heures, conformément à nos
              conditions d'utilisation.
            </p>

            <p css={{ fontSize: ".8em" }}>
              <sup>1</sup> Sont considérés comme pays européen les États membres de la EEE
              (espace économique européen). <IconInfoCircle size="1em" onClick={() => setCountryModal(true)} />
            </p>

            <Modal
              shown={countryModal}
              onClose={() => setCountryModal(false)}
              title="États européens"
              size="70%"
            >
              Voici la liste des États européens :

              <ul css={{ margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(10em, 1fr))", gap: "0 1.5em" }}>
                {[
                  ["🇩🇪", "Allemagne"], ["🇦🇹", "Autriche"], ["🇧🇪", "Belgique"], ["🇧🇬", "Bulgarie"], ["🇨🇾", "Chypre"],
                  ["🇭🇷", "Croatie"], ["🇩🇰", "Danemark"], ["🇪🇸", "Espagne"], ["🇪🇪", "Estonie"], ["🇫🇮", "Finlande"],
                  ["🇫🇷", "France"], ["🇬🇷", "Grèce"], ["🇭🇺", "Hongrie"], ["🇮🇪", "Irlande"], ["🇮🇸", "Islande"],
                  ["🇮🇹", "Italie"], ["🇱🇻", "Lettonie"], ["🇱🇮", "Liechtenstein"], ["🇱🇹", "Lituanie"], ["🇱🇺", "Luxembourg"],
                  ["🇲🇹", "Malte"], ["🇳🇴", "Norvège"], ["🇳🇱", "Pays-Bas"], ["🇵🇱", "Pologne"], ["🇵🇹", "Portugal"],
                  ["🇷🇴", "Roumanie"], ["🇬🇧", "Royaume-Uni"], ["🇸🇰", "Slovaquie"], ["🇸🇮", "Slovénie"], ["🇸🇪", "Suède"],
                  ["🇨🇭", "Suisse"], ["🇨🇿", "Tchéquie"]
                ].map(([flag, name]) => (
                  <li
                    key={name}
                    css={{ "::marker": { content: "attr(data-flag) ' '" } }}
                    data-flag={flag}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </Modal>
          </>
        ) : <></>}
      </div>
    </>
  )
}
