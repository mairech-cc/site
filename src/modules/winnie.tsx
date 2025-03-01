import { useCallback, useEffect, useRef, useState } from "react";
import { clamp, Vec2 } from "../utils/math";
import gangnamStylePhonkMp3 from "../assets/gangnam-style-phonk.mp3";

const LASER_OPEN_ANGLE = Math.PI / 26;

export function WinnieAnimation({ src }: { src: string; }) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const winSizing = useRef<Vec2>(new Vec2(0, 0));
  const imgSizing = useRef<Vec2>(new Vec2(0, 0));

  const velocity = useRef<Vec2>(new Vec2(3, 3));

  const [pos, setPos] = useState(new Vec2(10, 10));
  const [start] = useState(Date.now());

  const updateSizes = useCallback(() => {
    const canvas = canvasRef.current!;

    winSizing.current = new Vec2(window.innerWidth, window.innerHeight);

    const boundingBoxImg = imgRef.current!.getBoundingClientRect();
    imgSizing.current = new Vec2(boundingBoxImg.width, boundingBoxImg.height);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, [canvasRef, imgRef]);

  useEffect(() => {
    updateSizes();

    const audio = new Audio(gangnamStylePhonkMp3);
    audio.loop = true;
    audio.play();

    window.addEventListener("resize", updateSizes);

    return () => {
      audio.pause();
      audio.remove();
      window.removeEventListener("resize", updateSizes);
    };
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (canvasRef.current == null || imgRef.current == null) return;

      const vel = velocity.current;
      const newPos = pos.add(vel);

      // Overflow on x axis
      if (newPos.x < 0 || newPos.add(imgSizing.current).x >= winSizing.current.x) {
        newPos.x = clamp(newPos.x, 0, newPos.add(imgSizing.current).x - 1);
        vel.x = -vel.x;
      }

      // Overflow on y axis
      if (newPos.y < 0 || newPos.add(imgSizing.current).y >= winSizing.current.y) {
        newPos.y = clamp(newPos.y, 0, newPos.add(imgSizing.current).y - 1);
        vel.y = -vel.y;
      }

      // Updating the position
      velocity.current = vel;
      setPos(newPos);

      const time = Date.now() - start;
      const l = Math.exp(Math.log(time) - 2) / (32 * Math.PI);

      const len = Math.max(window.innerWidth, window.innerHeight);

      const imgCenter = newPos.add(imgSizing.current.scale(new Vec2(1 / 2, 1 / 2)));

      const ctx = canvasRef.current.getContext("2d")!;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = 0; i < 10; i++) {
        const angle = l + i * Math.PI / 5;

        const firstLine = imgCenter.add(new Vec2(-len * Math.cos(angle), -len * Math.sin(angle)));
        const secondLine = imgCenter.add(new Vec2(-len * Math.cos(angle + LASER_OPEN_ANGLE), -len * Math.sin(angle + LASER_OPEN_ANGLE)));

        ctx.beginPath();
        ctx.moveTo(imgCenter.x, imgCenter.y);
        ctx.lineTo(firstLine.x, firstLine.y);
        ctx.lineTo(secondLine.x, secondLine.y);
        ctx.closePath();
        ctx.fillStyle = "rgb(230 220 120 / 25%)";
        ctx.fill();
      }
    });
  }, [canvasRef, imgRef, pos, start]);

  return (
    <>
      <img
        ref={imgRef}
        src={src}
        style={{
          position: "fixed",
          zIndex: 2010,
          left: pos.x,
          top: pos.y,
        }}
        onLoad={updateSizes}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2009
        }}
      />
    </>
  );
}
