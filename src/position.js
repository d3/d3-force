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

  function initialize() {
    if (!nodes) return;
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i];
      if (isNaN(node.x)) node.x = x + (Math.random() - 0.5) * 100;
      if (isNaN(node.y)) node.y = y + (Math.random() - 0.5) * 100;
      if (isNaN(node.vx)) node.vx = 0;
      if (isNaN(node.vy)) node.vy = 0;
    }
  }

  force.nodes = function(_) {
    return arguments.length ? (nodes = _, initialize(), force) : nodes;
  };

  force.strength = function(_) {
    return arguments.length ? (strength = +_, force) : strength;
  };

  force.position = function(_) {
    return arguments.length ? (x = +_[0], y = +_[1], force) : [x, y];
  };

  return force;
}
