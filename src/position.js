export default function(x, y) {
  var strength = 0.1,
      nodes;

  function force(alpha) {
    for (var i = 0, n = nodes.length, node, k = strength * alpha; i < n; ++i) {
      node = nodes[i];
      node.vx += (x - node.x) * k;
      node.vy += (y - node.y) * k;
    }
  }

  force.initialize = function(simulation) {
    nodes = simulation.nodes();
  };

  force.strength = function(_) {
    return arguments.length ? (strength = +_, force) : strength;
  };

  force.position = function(_) {
    return arguments.length ? (x = +_[0], y = +_[1], force) : [x, y];
  };

  return force;
}
