export default function(x, y) {
  var nodes, strength = 0.05;

  if (x == null) x = 0;
  if (y == null) y = 0;

  function force(alpha) {
    var i,
        n = nodes.length,
        node,
        sx = 0,
        sy = 0;

    for (i = 0; i < n; ++i) {
      node = nodes[i], sx += node.x, sy += node.y;
    }

    sx = (sx / n - x) * alpha * strength;
    sy = (sy / n - y) * alpha * strength;
    for (i = 0; i < n; ++i) {
      node = nodes[i], node.vx -= sx, node.vy -= sy;
    }
  }

  force.initialize = function(_) {
    nodes = _;
  };

  force.x = function(_) {
    return arguments.length ? (x = +_, force) : x;
  };

  force.y = function(_) {
    return arguments.length ? (y = +_, force) : y;
  };

  return force;
}
