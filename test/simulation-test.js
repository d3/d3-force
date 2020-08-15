var tape = require("tape"),
    force = require("../");

require("./nodeEqual.js");

tape("forceSimulation() returns a simulation", function(test) {
  const f = force.forceSimulation().stop();
  test.deepEqual(Object.keys(f).sort(), [ 'alpha', 'alphaDecay', 'alphaMin', 'alphaTarget', 'find', 'force', 'nodes', 'on', 'randomSource', 'restart', 'stop', 'tick', 'velocityDecay' ]);
  test.end();
});

tape("simulation.nodes(nodes) initializes a simulation with indices & phyllotaxis positions, 0 speed", function(test) {
  const f = force.forceSimulation().stop();
  const a = {}, b = {}, c = {};
  f.nodes([a, b, c]);
  test.nodeEqual(a, { index: 0, x: 7.0710678118654755, y: 0, vy: 0, vx: 0 });
  test.nodeEqual(b, { index: 1, x: -9.03088751750192, y: 8.27303273571596, vy: 0, vx: 0 });
  test.nodeEqual(c, { index: 2, x: 1.3823220809823638, y: -15.750847141167634, vy: 0, vx: 0 });
  test.end();
});

