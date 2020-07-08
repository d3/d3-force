var tape = require("tape"),
    force = require("../");

require("./nodeEqual.js");

tape("forceCenter repositions nodes", function(test) {
  const center = force.forceCenter(0, 0);
  const f = force.forceSimulation().force("center", center).stop();
  const a = { x: 100, y: 0 }, b = { x: 200, y: 0 }, c = { x: 300, y: 0 };
  f.nodes([a, b, c]);
  f.tick();
  test.nodeEqual(a, { index: 0, x: -100, y: 0, vy: 0, vx: 0 });
  test.nodeEqual(b, { index: 1, x: 0, y: 0, vy: 0, vx: 0 });
  test.nodeEqual(c, { index: 2, x: 100, y: 0, vy: 0, vx: 0 });
  test.end();
});


tape("forceCenter respects fixed positions", function(test) {
  const center = force.forceCenter();
  const f = force.forceSimulation().force("center", center).stop();
  const a = { fx: 0, fy:0 }, b = {}, c = {};
  f.nodes([a, b, c]);
  f.tick();
  test.nodeEqual(a, { fx: 0, fy: 0, index: 0, x: 0, y: 0, vy: 0, vx: 0 });
  test.end();
});
