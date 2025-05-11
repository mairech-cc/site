import { useEffect, useState } from "react";

export function getHello() {
  const hours = new Date().getHours();

  if (hours >= 5 && hours < 17) {
    return "Bonjour";
  }

  if (hours >= 17 && hours < 23) {
    return "Bonsoir";
  }

  return "Bonne nuit";
}

export function useHello() {
  const [hello, setHello] = useState(getHello);

  useEffect(() => {
    const updateHello = () => {
      setHello(getHello);
    };

    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1, 0, 0, 0);
    const delay = nextHour.getTime() - now.getTime();

    const interval = setInterval(updateHello, delay);

    return clearInterval.bind(null, interval);
  }, []);

  return hello;
}
