import { Global } from "@emotion/react";
import { useAuth } from "../auth/context";
import { Link, useHref } from "react-router";
import IconLoader from "../modules/loader";
import { Button } from "../modules/button";
import { useHello } from "../utils/time";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useEffect, useMemo } from "react";
import { useDocumentTitle } from "../utils/dom";
import AccountActivity from "./activity";

export default function AccountManager() {
  const auth = useAuth();
  const href = useHref(".");
  const [title, setTitle] = useDocumentTitle();

  useEffect(() => {
    if (title != "Gestion de compte") {
      setTitle("Gestion de compte");
    }
  }, [title, setTitle]);

  return auth.isChecking() ? (
    <Wrapper>
      <IconLoader />
    </Wrapper>
  ) :
    auth.isLogged() ? <AccountManagerImpl /> : (
      <Wrapper>
        <span>Vous devez être connecté pour continuer...</span>

        <Button onClick={() => auth.login(new URL(href, location.href).href)}>Se connecter</Button>

        <Link to="/">
          <Button css={{ width: "100%" }}>Retour</Button>
        </Link>
      </Wrapper>
    );
}

function Wrapper({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Global styles={{
        body: { margin: 0 }
      }} />

      <div css={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        placeItems: "center"
      }}>
        <div css={{
          display: "flex",
          flexDirection: "column",
          gap: "1em",
        }}>
          {children}
        </div>
      </div>
    </>
  )
}

export function AccountManagerImpl() {
  const auth = useAuth();
  const hello = useHello();
  const href = useHref(".");

  const user = auth.getUser()!;

  const subscriptionsText = useMemo(() => {
    const len = user.subscriptions.filter(v => v.status == "active").length;

    if (len == 0) {
      return "Aucun actif";
    }

    if (len == 1) {
      return "1 actif";
    } else {
      return `${len} actifs`;
    }
  }, [user]);

  return (
    <div css={{ display: "flex", flexDirection: "column", gap: ".5em" }}>
      <h1 css={{
        margin: 0,
        fontSize: "2em",
        textWrap: "wrap",
        width: "100%",
      }}>
        {hello}, {user.name} 👋
      </h1>

      <div css={{ display: "flex", gap: "1em" }}>
        <Button css={{ width: "max-content" }} onClick={() => auth.logout(new URL(href, location.href).href)}>
          Se déconnecter
        </Button>
        
        <Button css={{ width: "max-content" }} onClick={() => auth.relogin(new URL(href, location.href).href)}>
          Se reconnecter
        </Button>
      </div>

      <p>
        Voici les informations que nos petits lutins ont récupéré sur vous :
      </p>

      <div css={{
        display: "flex",
        gap: "1em 4em",
        flexWrap: "wrap",
      }}>
        <div css={{
          display: "grid",
          gridTemplateColumns: "repeat(2, max-content)",
          gap: ".3em 2em",
          height: "max-content"
        }}>
          <div>Nom</div>
          <div>{user.name}</div>

          <div>Adresse courriel</div>
          <div>{user.email}</div>

          <div>Abonnements</div>
          <div>
            {subscriptionsText} <Link to="/account/subscriptions">Gérer</Link>
          </div>
        </div>

        <div css={{
          display: "grid",
          gridTemplateColumns: "2em 1fr",
          maxWidth: "20em",
          gap: "1em",
          padding: "1em",
          background: "#ff6f6f",
          borderRadius: "1em",
          color: "black",
        }}>
          <IconAlertTriangle size="2em" />

          <span>
            Pour changer une information du compte, il vous suffit de vous reconnecter. Les données sont récupérées depuis
            votre compte Microsoft.
          </span>
        </div>
      </div>

      <div>Compte créé le {new Date(user.createdAt).toLocaleString("fr", { dateStyle: "full", timeStyle: "medium" })}</div>

      <hr css={{ width: "100%" }} />

      <AccountActivity />
    </div >
  );
}
