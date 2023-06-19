// deno-lint-ignore-file no-explicit-any
import {jspicl} from "https://raw.githubusercontent.com/DevTheo/deno-jspicl/v3.0.1pre3/src/mod.ts";
import { JspiclPluginOptions, banner } from "./constants.ts";


export function transpile (javascriptCode: string, options: JspiclPluginOptions) {
  const { includeBanner, polyfillTransform, jspicl: jspiclOptions = {} } = options;
  const jspiclBanner = includeBanner && `${banner}` || "";

  const { code, polyfills } = jspicl(javascriptCode, jspiclOptions);
  const polyfillOutput = polyfillTransform ? polyfillTransform(polyfills) : Object.values(polyfills).join("\n");
  const lua = `${polyfillOutput}${code}`;

  return {
    lua,
    polyfillOutput,
    toString () {
      return `${jspiclBanner}${lua}`;
    }
  };
}
