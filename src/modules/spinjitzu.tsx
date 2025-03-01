import gif from "../assets/spinjitzu.gif";
import { ReactEventHandler, useCallback, useEffect, useState } from "react";
import { diff, Vec2 } from "../utils/math";

const DURATION = 3_000;

export function SpinjitzuSpawner({ invokeRef }: { invokeRef: (invoker: () => void) => void }) {
  const [timestamps, setTimestamps] = useState<number[]>([]);

  useEffect(() => {
    const list: number[] = [];

    queueMicrotask(() => {
      invokeRef(() => () => {
        const start = Date.now();

        setTimestamps(t => [...t, start]);

        list.push(window.setTimeout(() => {
          setTimestamps(t => t.filter(k => k != start));
        }, DURATION));
      });
    });

    return () => list.forEach(x => clearTimeout(x));
  }, [invokeRef]);

  return (
    <>
      {timestamps.map(t => (
        <SpinjitzuGif key={t} start={t} />
      ))}
    </>
  );
}

export function SpinjitzuGif({ start }: { start: number }) {
  const onLoad: ReactEventHandler<HTMLImageElement> = useCallback((ev) => {
    let nextFrame: number;

    const img = ev.currentTarget;
    const imgSizing = img.getBoundingClientRect();
    const screenSizing = new Vec2(window.innerWidth, window.innerHeight);

    const y = screenSizing.y - imgSizing.height
    const startX = -imgSizing.width;
    const endX = screenSizing.x;

    function ratioVec(x: number) {
      return new Vec2(startX + diff(startX, endX) * x, y);
    }

    function tick() {
      const time = Date.now();

      if ((time - start) > DURATION) return;

      const pos = ratioVec((time - start) / DURATION);
      
      img.style.left = pos.x + "px";
      img.style.top = pos.y + "px";
      img.style.visibility = "visible";

      nextFrame = requestAnimationFrame(tick);
    }

    tick();

    return () => cancelAnimationFrame(nextFrame);
  }, [start]);

  return (
    <>
      <img
        src={gif}
        onLoad={onLoad}
        style={{
          position: "fixed",
          zIndex: 2005,
          visibility: "hidden",
        }}
      />
    </>
  );
}
