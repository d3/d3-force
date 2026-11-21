import assert from "node:assert";
import {it} from "vitest";
import {forceLink, forceSimulation} from "d3-force";

it("forceLink jiggles coincident linked nodes", () => {
  const a = {x: 0, y: 0}, b = {x: 0, y: 0};
  const f = forceSimulation([a, b]).force("link", forceLink([{source: 0, target: 1}])).stop();
  f.tick();
  for (const node of [a, b]) {
    assert(Number.isFinite(node.x) && Number.isFinite(node.y), "position should be finite");
    assert(Number.isFinite(node.vx) && Number.isFinite(node.vy), "velocity should be finite");
  }
  assert(a.x !== b.x);
  assert(a.y !== b.y);
  assert.strictEqual(a.vx, -b.vx);
  assert.strictEqual(a.vy, -b.vy);
});

it("forceLink jiggles coincident linked nodes in a reproducible way", () => {
  const run = () => {
    const nodes = [{x: 0, y: 0}, {x: 0, y: 0}];
    forceSimulation(nodes).force("link", forceLink([{source: 0, target: 1}])).stop().tick(10);
    return nodes;
  };
  assert.deepStrictEqual(run(), run());
});
