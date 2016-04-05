function custom(x, y, k) {

  function force(nodes, alpha) {
    for (var i = 0, n = nodes.length, node, ka = k * alpha; i < n; ++i) {
      node = nodes[i];
      node.x += (x - node.x) * ka;
      node.y += (y - node.y) * ka;
    }
  }

  force.position = function(_) {
    return custom(+_[0], +_[1], k);
  };

  force.strength = function(_) {
    return custom(x, y, +_);
  };

  return force;
}

export default function(x, y) {
  return custom(+x, +y, 0.1);
}
