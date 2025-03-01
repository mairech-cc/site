import "leaflet/dist/leaflet.css";

import { useEffect, useState } from "react";
import markerPng from "leaflet/dist/images/marker-icon-2x.png?url";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png?url";
import L from "leaflet";
import { ClassNames } from "@emotion/react";

export function LeafletMap() {
  return (
    <ClassNames>
      {({ css }) => (
        <LeafletMapImpl
          className={css({
            scale: "0.5"
          })}
        />
      )}
    </ClassNames>
  )
}

export function LeafletMapImpl({ className }: { className: string; }) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!container) {
      return;
    }

    const map = L.map(container, {
      center: [47.731158, 7.3012456],
      zoom: 14,
      layers: [
        L.tileLayer("https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png ")
      ],
    });

    L.marker([47.731158, 7.3012456], {
      icon: L.icon({
        iconUrl: new URL(markerPng, import.meta.url).href,
        iconSize: L.point(50 / 3, 82 / 3),
        shadowUrl: new URL(markerShadowPng, import.meta.url).href,
        shadowSize: L.point(41 / 3, 41 / 3),
      }),
    }).bindPopup(L.popup({
      content: "Lycée Louis Armand<br />3 Bd des Nations, 68200 Mulhouse"
    })).addTo(map);

    map.attributionControl
      .addAttribution("&copy; <a href=\"https://osm.org/copyright\" target=\"_blank\">OpenStreetMap France</a>");

    return () => {
      map.remove();
    }
  }, [container, className]);

  return (
    <div
      ref={setContainer}
      style={{
        height: 300,
        width: "100%",
        maxWidth: 500,
      }}
    />
  )
}
