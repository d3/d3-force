export default function(cx, cy) {
  var nodes;

  if (cx == null) cx = 0;
  if (cy == null) cy = 0;

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
      node = nodes[i], node.x -= x, node.y -= y;
    }
  }

  force.initialize = function(simulation) {
    nodes = simulation.nodes();
  };

  return force;
}
