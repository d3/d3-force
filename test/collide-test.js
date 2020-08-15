var tape = require("tape"),
    force = require("../");

require("./nodeEqual.js");

tape("forceCollide collides nodes", function(test) {
  const collide = force.forceCollide(1);
  const f = force.forceSimulation().force("collide", collide).stop();
  const a = {}, b = {}, c = {};
  f.nodes([a, b, c]);
  f.tick(10);
  test.nodeEqual(a, { index: 0, x: 7.0710678118654755, y: 0, vy: 0, vx: 0 });
  test.nodeEqual(b, { index: 1, x: -9.03088751750192, y: 8.27303273571596, vy: 0, vx: 0 });
  test.nodeEqual(c, { index: 2, x: 1.3823220809823638, y: -15.750847141167634, vy: 0, vx: 0 });
  collide.radius(100);
  f.tick(10);
  test.nodeEqual(a,  { index: 0, x: 174.08616723117228, y: 66.51743051995625, vy: 0.26976816231064354, vx: 0.677346615710878 });
  test.nodeEqual(b, { index: 1, x: -139.73606544743998, y: 95.69860503079263, vy: 0.3545632444404687, vx: -0.5300880593105067 });
  test.nodeEqual(c, { index: 2, x: -34.9275994083864, y: -169.69384995620052, vy: -0.6243314067511122, vx: -0.1472585564003713 });
  test.end();
});


tape("forceCollide respects fixed positions", function(test) {
  const collide = force.forceCollide(1);
  const f = force.forceSimulation().force("collide", collide).stop();
  const a = { fx: 0, fy:0 }, b = {}, c = {};
  f.nodes([a, b, c]);
  f.tick(10);
  test.nodeEqual(a, { fx: 0, fy: 0, index: 0, x: 0, y: 0, vy: 0, vx: 0 });
  collide.radius(100);
  f.tick(10);
  test.nodeEqual(a, { fx: 0, fy: 0, index: 0, x: 0, y: 0, vy: 0, vx: 0 });
  test.end();
});

tape("forceCollide jiggles equal positions", function(test) {
  const collide = force.forceCollide(1);
  const f = force.forceSimulation().force("collide", collide).stop();
  const a = { x: 0, y:0 }, b = { x:0, y: 0 };
  f.nodes([a, b]);
  f.tick();
  test.assert(a.x !== b.x);
  test.assert(a.y !== b.y);
  test.equal(a.vx, -b.vx);
  test.equal(a.vy, -b.vy);
  test.end();
});

tape("forceCollide jiggles in a reproducible way", function(test) {
  const nodes = Array.from({length:10}, () => ({x:0,y:0}));
  force.forceSimulation()
    .nodes(nodes)
    .force("collide", force.forceCollide()).stop().tick(50);
  test.nodeEqual(nodes[0], {x: -5.371433857229194, y: -2.6644608278592576, index: 0, vy: 0, vx: 0});
  test.end();
});
