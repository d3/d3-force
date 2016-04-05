export default (function custom(k) {

  function force(nodes) {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i];
      node.x += (node.px - node.x) * k;
      node.y += (node.py - node.y) * k;
    }
  }

  force.strength = function(_) {
    return custom(+_);
  };

  return force;
})(0.1);
