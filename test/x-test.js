var tape = require("tape"),
    force = require("../");

require("./nodeEqual.js");

tape("forceX centers nodes", function(test) {
  const x = force.forceX(200);
  const f = force.forceSimulation().force("x", x).stop();
  const a = { x: 100, y: 0 }, b = { x: 200, y: 0 }, c = { x: 300, y: 0 };
  f.nodes([a, b, c]);
  f.tick(30);
  test.assert(a.x > 190);
  test.assert(a.vx > 0);
  test.equal(b.x, 200);
  test.equal(b.vx, 0);
  test.assert(c.x < 210);
  test.assert(c.vx < 0);
  test.end();
});

tape("forceY centers nodes", function(test) {
  const y = force.forceY(200);
  const f = force.forceSimulation().force("y", y).stop();
  const a = { y: 100, x: 0 }, b = { y: 200, x: 0 }, c = { y: 300, x: 0 };
  f.nodes([a, b, c]);
  f.tick(30);
  test.assert(a.y > 190);
  test.assert(a.vy > 0);
  test.equal(b.y, 200);
  test.equal(b.vy, 0);
  test.assert(c.y < 210);
  test.assert(c.vy < 0);
  test.end();
});

tape("forceX respects fixed positions", function(test) {
  const x = force.forceX(200);
  const f = force.forceSimulation().force("x", x).stop();
  const a = { fx: 0, fy:0 }, b = {}, c = {};
  f.nodes([a, b, c]);
  f.tick();
  test.nodeEqual(a, { fx: 0, fy: 0, index: 0, x: 0, y: 0, vy: 0, vx: 0 });
  test.end();
});

tape("forceY respects fixed positions", function(test) {
  const y = force.forceX(200);
  const f = force.forceSimulation().force("y", y).stop();
  const a = { fx: 0, fy:0 }, b = {}, c = {};
  f.nodes([a, b, c]);
  f.tick();
  test.nodeEqual(a, { fx: 0, fy: 0, index: 0, x: 0, y: 0, vy: 0, vx: 0 });
  test.end();
});

tape("forceX.x() accessor", function(test) {
  const x = force.forceX().x(d => d.x0);
  const f = force.forceSimulation().force("x", x).stop();
  const a = { x: 100, y: 0, x0: 300 }, b = { x: 200, y: 0, x0: 200 }, c = { x: 300, y: 0, x0: 100 };
  f.nodes([a, b, c]);
  f.tick(30);
  test.assert(a.x > 290);
  test.assert(a.vx > 0);
  test.equal(b.x, 200);
  test.equal(b.vx, 0);
  test.assert(c.x < 110);
  test.assert(c.vx < 0);
  test.end();
});

tape("forceY.y() accessor", function(test) {
  const y = force.forceY().y(d => d.y0);
  const f = force.forceSimulation().force("y", y).stop();
  const a = { y: 100, x: 0, y0: 300 }, b = { y: 200, x: 0, y0: 200 }, c = { y: 300, x: 0, y0: 100 };
  f.nodes([a, b, c]);
  f.tick(30);
  test.assert(a.y > 290);
  test.assert(a.vy > 0);
  test.equal(b.y, 200);
  test.equal(b.vy, 0);
  test.assert(c.y < 110);
  test.assert(c.vy < 0);
  test.end();
});
