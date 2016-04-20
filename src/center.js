export default function(cx, cy) {
  var nodes;

  function force() {
    var i,
        n = nodes.length,
        node,
        x = 0,
        y = 0;

    for (i = 0; i < n; ++i) {
      node = nodes[i], x += node.x, y += node.y;
    }

    for (x = x / n - cx, y = y / n - cy, i = 0; i < n; ++i) {
      node = nodes[i], node.vx -= x, node.vy -= y;
    }
  }

  force.nodes = function(_) {
    nodes = _;
  };

  return force;
}
