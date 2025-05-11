import { Suspense, useMemo, use, Fragment, useState, useEffect, memo, useId } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useAuth } from "../auth/context";
import { Activity } from "../auth/wrapper/activity";
import { formatSize } from "../utils/math";
import { formatReason } from "../auth/api/activity";
import { IconBubbleMinus, IconBubblePlus, IconEyeExclamation, IconFileUpload, IconLogin2, IconTrash, IconUserPlus } from "@tabler/icons-react";

export default function AccountActivity() {
  return (
    <ErrorBoundary fallback={<div>Une erreur est survenue.</div>}>
      <Suspense fallback={<div>Chargement...</div>}>
        <div>Voici les derniers événements de votre compte :</div>

        <AccountActivityViewer />
      </Suspense>
    </ErrorBoundary>
  );
}

export function AccountActivityViewer() {
  const auth = useAuth();

  const user = useMemo(() => auth.getUser(), [auth]);
  const [promise, setPromise] = useState(Promise.resolve<Activity[]>([]));
  const activity = use(promise);

  const viewFormId = useId();
  const [view, setView] = useState<"cozy" | "compact" | "table">("cozy");

  useEffect(() => {
    if (activity.length == 0 && user) {
      setPromise(user.getActivity());
    }
  }, [activity, user]);

  const rows = activity.map((x, i) => (
    <Fragment key={x.at.getTime() + x.action}>
      <ActivityRender activity={x} view={view} first={i == 0} last={i + 1 == activity.length} />
    </Fragment>
  ));

  return (
    <>
      <div css={{ display: "flex", gap: ".5em" }}>
        <label htmlFor={viewFormId}>Affichage</label>
        <select id={viewFormId} value={view} onChange={e => setView(e.currentTarget.value as "cozy" | "compact" | "table")}>
          <optgroup label="Liste">
            <option value="cozy">Agréable</option>
            <option value="compact">Compacte</option>
          </optgroup>
          <hr />
          <option value="table">Tableau</option>
        </select>
      </div>

      {view == "table" ? (
        <table css={{
          width: "100%",
          display: "table",
          borderCollapse: "collapse",
          border: "1px solid transparent",

          "& td, & th": {
            padding: ".5em",
            border: "1px solid black",

            "@media (prefers-color-scheme: dark)": {
              border: "1px solid white",
            }
          }
        }}>
          <thead>
            <tr>
              <th>Événement</th>
              <th>Date et heure</th>
            </tr>
          </thead>

          <tbody>{rows}</tbody>
        </table>
      ) : (
        <div css={{
          display: "flex",
          flexDirection: "column",
          gap: view == "cozy" ? "1em" : 0,
          transition: "all .2s",
        }}>
          {rows}
        </div>
      )}
    </>
  );
}

export const ActivityRender = memo(ActivityRender_);

function ActivityRender_({ activity: act, view, first, last }: {
  activity: Activity;
  view: "cozy" | "compact" | "table";
  first: boolean;
  last: boolean;
}) {
  const body = useMemo(() => {
    if (act.context == "payment" || act.context == "subscription") {
      return;
    }

    if (act.isType("chat", "new")) {
      return <div>Nouvelle conversation avec Mejib. Titre : {act.data.title}</div>;
    }

    if (act.isType("chat", "delete")) {
      return <div>Conversation avec Mejib supprimé. Titre : {act.data.title}</div>;
    }

    if (act.isType("file", "delete")) {
      return <div>Fichier « {act.data.name} » supprimé. Espace libéré : {formatSize(act.data.size)}</div>;
    }

    if (act.isType("file", "moderated")) {
      return <div>Un de vos fichier supprimé par la modération pour « {formatReason(act.data.reason)} ».</div>;
    }

    if (act.isType("file", "upload")) {
      return <div>Fichier « {act.data.name} » téléversé. Taille : {formatSize(act.data.size)}</div>;
    }

    if (act.isType("user", "login")) {
      return <div>Connexion à votre compte. Localisation : « {act.data.location == "unk" ? "Inconnue" : act.data.location} ».</div>;
    }

    if (act.isType("user", "create")) {
      return <div>Création de votre compte.</div>;
    }
  }, [act]);

  const Icon = useMemo(() => {
    if (act.context == "payment" || act.context == "subscription") {
      return;
    }

    if (act.isType("chat", "new")) {
      return IconBubblePlus;
    }

    if (act.isType("chat", "delete")) {
      return IconBubbleMinus;
    }

    if (act.isType("file", "delete")) {
      return IconTrash;
    }

    if (act.isType("file", "moderated")) {
      return IconEyeExclamation;
    }

    if (act.isType("file", "upload")) {
      return IconFileUpload;
    }

    if (act.isType("user", "login")) {
      return IconLogin2;
    }

    if (act.isType("user", "create")) {
      return IconUserPlus;
    }
  }, [act]);

  if (!body || !Icon) {
    return <></>;
  }

  if (view == "table") {
    return (
      <tr>
        <td>
          <div css={{ display: "flex", gap: ".5em" }}>
            <div>
              <Icon size="1.5em" />
            </div>

            <div>
              {body}
            </div>
          </div>
        </td>

        <td>
          Le {act.at.toLocaleString("fr", { dateStyle: "full", timeStyle: "medium" })}
        </td>
      </tr>
    );
  } else {
    return (
      <div css={[{
        background: "lightgray",
        borderRadius: view == "cozy" ? "1em" : first ? "1em 1em 0 0" : last ? "0 0 1em 1em" : 0,
        border: "1px solid gray",
        transition: "all .2s",

        "@media (prefers-color-scheme: dark)": {
          background: "#494949",
        },

        "&>div": {
          display: "flex",
          alignItems: "center",
        }
      }, view == "cozy" ? {
        display: "grid",
        padding: "1em",
        gridTemplateColumns: "auto 1fr auto",
        gap: ".5em 1em",
      } : {
        display: "grid",
        padding: ".5em 1em",
        gridTemplateColumns: "auto 1fr auto",
        gap: "1em",
        marginTop: first ? 0 : "-1px",
      }]}>
        <div><Icon size="1.5em" /></div>

        <div>{body}</div>

        <div>
          Le {act.at.toLocaleString("fr", { dateStyle: "full", timeStyle: "medium" })}
        </div>
      </div>
    );
  }
}
