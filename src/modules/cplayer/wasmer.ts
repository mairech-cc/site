import { useCallback, useEffect, useState } from "react";
import wasmerSdkModule from "@wasmer/sdk/wasm?url";
import wasmerSdkUrl from "@wasmer/sdk?url";
import wasmerWorkerUrl from "../../../node_modules/@wasmer/sdk/dist/worker.mjs?url";
import { init, Wasmer } from "@wasmer/sdk";

await init({
  module: wasmerSdkModule,
  sdkUrl: new URL(wasmerSdkUrl, import.meta.url),
  workerUrl: new URL(wasmerWorkerUrl, import.meta.url),
});

const promiseCache: Record<string, Promise<Wasmer> | undefined> = {};
const cache: Record<string, Wasmer> = {};

export function useWasmerPackage(specifier: string): [false | Wasmer, () => void] {
  const [pak, setPak] = useState<Wasmer | false>(false);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    if (trigger == 0) {
      return;
    }

    if (cache[specifier]) {
      setPak(cache[specifier]);
      return;
    }

    if (promiseCache[specifier]) {
      promiseCache[specifier].then(v => setPak(v));
      return;
    }

    promiseCache[specifier] = Wasmer.fromRegistry(specifier).then(v => {
      setPak(cache[specifier] = v);
      promiseCache[specifier] = undefined;
      return v;
    });
  }, [pak, specifier, trigger]);

  const triggerUpdate = useCallback(() => {
    setTrigger(t => t + 1);
  }, []);

  return [pak, triggerUpdate];
}
