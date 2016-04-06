function custom(nodes, x, y, k) {

  function force(alpha) {
    for (var i = 0, n = nodes.length, node, ka = k * alpha; i < n; ++i) {
      node = nodes[i];
      node.vx += (x - node.x) * ka;
      node.vy += (y - node.y) * ka;
    }
  }

  force.nodes = function(_) {
    return custom(_, x, y, k);
  };

  force.position = function(_) {
    return custom(nodes, +_[0], +_[1], k);
  };

  force.strength = function(_) {
    return custom(nodes, x, y, +_);
  };

  return force;
}

export default function(nodes) {
  return custom(nodes, 0, 0, 0.2);
}
