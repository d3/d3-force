import {test} from "vitest";
import assert from "assert";
import {forceSimulation} from "../src/index.js";
import {assertNodeEqual} from "./asserts.js";

test("forceSimulation() returns a simulation", () => {
  const f = forceSimulation().stop();
  assert.deepStrictEqual(Object.keys(f).sort(), [ 'alpha', 'alphaDecay', 'alphaMin', 'alphaTarget', 'find', 'force', 'nodes', 'on', 'randomSource', 'restart', 'stop', 'tick', 'velocityDecay' ]);
});

test("simulation.nodes(nodes) initializes a simulation with indices & phyllotaxis positions, 0 speed", () => {
  const f = forceSimulation().stop();
  const a = {}, b = {}, c = {};
  f.nodes([a, b, c]);
  assertNodeEqual(a, {index: 0, x: 7.0710678118654755, y: 0, vy: 0, vx: 0});
  assertNodeEqual(b, {index: 1, x: -9.03088751750192, y: 8.27303273571596, vy: 0, vx: 0});
  assertNodeEqual(c, {index: 2, x: 1.3823220809823638, y: -15.750847141167634, vy: 0, vx: 0});
});

