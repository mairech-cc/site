import { motion } from "framer-motion";
import { useAuth } from "../../auth/context";
import { Link, useHref } from "react-router";
import { Button } from "../button";

export default function AccountPopver({ ref, style, ...props }: {
  ref: React.Ref<HTMLDivElement>;
  style: React.CSSProperties;
} & Record<string, unknown>) {
  const auth = useAuth();
  const href = useHref(".");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      key="popover"
      ref={ref}
      {...props}
      style={style}
      css={{
        zIndex: 1000,
        transformOrigin: "top right",
      }}
    >
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          gap: "1em",
          padding: "1em",
          backgroundColor: "white",
          color: "black",
          borderRadius: "0.5em",
          border: "1px solid gray",
          width: "max-content",

          "& > *": {
            margin: 0,
          }
        }}
      >
        {auth.isChecking() ? (
          <>
            <h2>Chargement...</h2>
          </>
        ) : auth.isLogged() ? (
          <>
            <h2>Votre compte</h2>
            <p>{auth.getUser()!.name}</p>
            <Link to="/account">Gérer</Link>
            <Button scheme="light" onClick={() => auth.logout(new URL(href, location.href).href)}>Se déconnecter</Button>
          </>
        ) : (
          <>
            <p>Vous n'êtes pas connecté</p>
            <Button scheme="light" onClick={() => auth.login(new URL(href, location.href).href)}>Se connecter</Button>
          </>
        )}
      </div>
    </motion.div>
  )
}
