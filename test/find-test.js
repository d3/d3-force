var tape = require("tape"),
    force = require("../");

require("./nodeEqual.js");

tape("simulation.find finds a node", function(test) {
  const f = force.forceSimulation().stop();
  const a = { x: 5, y: 0 }, b = { x: 10, y: 16 }, c = { x: -10, y: -4};
  f.nodes([a, b, c]);
  test.equal(f.find(0, 0), a);
  test.equal(f.find(0, 20), b);
  test.end();
});

tape("simulation.find(x, y, radius) finds a node within radius", function(test) {
  const f = force.forceSimulation().stop();
  const a = { x: 5, y: 0 }, b = { x: 10, y: 16 }, c = { x: -10, y: -4};
  f.nodes([a, b, c]);
  test.equal(f.find(0, 0), a);
  test.equal(f.find(0, 0, 1), undefined);
  test.equal(f.find(0, 20), b);
  test.end();
});

