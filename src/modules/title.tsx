import { forwardRef, useEffect, useRef } from "react";

const ANIMATIONS = {
  dismiss: [
    {
      opacity: 1,
      transform: "rotateX(0deg)",
    },
    {
      opacity: 0,
      transform: "rotateX(90deg)",
    }
  ] satisfies Keyframe[],
  show: [
    {
      opacity: 0,
      transform: "rotateX(-90deg)",
    },
    {
      opacity: 1,
      transform: "rotateX(0deg)",
    }
  ] satisfies Keyframe[],
};

function startMarquee(element: HTMLElement, duration: number) {
  const startTime = performance.now();
  const startX = 0;
  const endX = -element.offsetWidth;
  const teleportX = element.parentElement!.offsetWidth;

  function animate(time: number) {
    const elapsed = time - startTime;
    const progress = elapsed / duration;

    if (progress < 0.5) {
      element.style.transform = `translateX(${startX + progress * (endX - startX) * 2}px)`;
      requestAnimationFrame(animate);
    } else if (progress < 1) {
      element.style.transform = `translateX(${teleportX}px)`;

      requestAnimationFrame(newTime => {
        function moveBack(time: number) {
          const elapsedBack = time - newTime;
          const progressBack = elapsedBack / (duration / 2);

          if (progressBack < 1) {
            element.style.transform = `translateX(${teleportX + progressBack * (startX - teleportX)}px)`;
            requestAnimationFrame(moveBack);
          } else {
            element.style.transform = `translateX(${startX}px)`;
          }
        }

        moveBack(newTime);
      });
    }
  }

  requestAnimationFrame(animate);
}

export const Title = forwardRef<HTMLHeadingElement>((_, ref) => {
  const index = useRef(0);
  const firstSpanRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const span = firstSpanRef.current;

      if (span && window.innerWidth - 30 <= span.clientWidth) {
        setTimeout(() => {
          startMarquee(span, 8000);
        }, 100);
      }
    });

    const interval = setInterval(() => {
      const firstSpan = firstSpanRef.current;

      if (!firstSpan) {
        return;
      }

      const children = [...firstSpan.parentElement!.children];
      const isLast = index.current == children.length - 1;

      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;

        if (index.current == i) {
          const animation = child.animate(ANIMATIONS.dismiss, { duration: 500 });
          animation.addEventListener("finish", () => {
            child.style.visibility = "hidden";
          });
        }

        if (isLast ? i == 0 : index.current + 1 == i) {
          child.style.visibility = "visible";
          const animation = child.animate(ANIMATIONS.show, { duration: 500 });
          animation.addEventListener("finish", () => {
            if (window.innerWidth - 30 <= child.clientWidth) {
              setTimeout(() => {
                startMarquee(child, 8000);
              }, 100);
            }
          });
        }
      }

      index.current++;

      if (isLast) {
        index.current = 0;
      }
    }, 9500);

    return () => {
      clearInterval(interval);
    }
  }, []);

  return (
    <h1
      ref={ref}
      css={{
        position: "relative",
        height: "1em",
        width: "100%",
        display: "grid",
        gridTemplateAreas: '"A"',
        margin: 0,

        "&>span": {
          position: "absolute",
          width: "max-content",
          transformOrigin: "bottom",
        }
      }}
    >
      <span ref={firstSpanRef} style={{ visibility: "visible" }}>Nejib Mairech</span>
      <span style={{ visibility: "hidden" }}>Professeur de STI2D SIN</span>
    </h1>
  );
})
