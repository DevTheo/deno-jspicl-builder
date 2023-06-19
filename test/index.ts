// import { expect } from "chai";
// import fs from "fs";
import { describe, it, expect } from "./bdd.js";
import plugin from "../src/plugin.ts";
import { defaultOptions } from "../src/constants.ts";

const __dirname = Deno.cwd();

const defaultUnitTestOptions = {
  ...defaultOptions,
  spritesheetImagePath: `${__dirname}/fixtures/spritesheet.png`,
  includeBanner: false,
  showStats: false,
  reloadOnSave: false
};

// deno-lint-ignore no-explicit-any
const setup = (options: any) => plugin({
  ...defaultUnitTestOptions,
  ...options
});

describe("jspicl-cli", () => {
  it("should only overwrite lua section with transpiled code", async () => {
    const { renderChunk } = setup({
      cartridgePath: `${__dirname}/fixtures/replaceLua.txt`
    });

    const result = await renderChunk("var a = 1;");
    expect(result.code).to.equal(Deno.readTextFileSync(`${__dirname}/expected/replaceLua.txt`));
  });

  it("should handle case where cartridge does not end with two newlines", async () => {
    const { renderChunk } = setup({
      cartridgePath: `${__dirname}/fixtures/singleNewline.txt`
    });

    const result = await renderChunk("var a = 1;");
    expect(result.code).to.equal(Deno.readTextFileSync(`${__dirname}/expected/singleNewline.txt`));
  });

  it("includes banner", async () => {
    const { renderChunk } = setup({
      includeBanner: true,
      cartridgePath: `${__dirname}/fixtures/banner.txt`
    });

    const result = await renderChunk("var a = 1;");
    expect(result.code).to.equal(Deno.readTextFileSync(`${__dirname}/expected/banner.txt`));
  });

  it("ignores specific sections from imported cartridge", async () => {
    const { renderChunk } = setup({
      cartridgePath: `${__dirname}/fixtures/ignoreSections.txt`
    });

    const result = await renderChunk("");
    expect(result.code).to.equal(Deno.readTextFileSync(`${__dirname}/expected/ignoreSections.txt`));
  });
});
