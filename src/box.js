export default function(extent) {
  var nodes,
      x0 = +extent[0][0],
      y0 = +extent[0][1],
      x1 = +extent[1][0],
      y1 = +extent[1][1];

  function force() {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i];
      if (node.x < x0) node.x = x0;
      else if (node.x > x1) node.x = x1;
      if (node.y < y0) node.y = y0;
      else if (node.y > y1) node.y = y1;
    }
  }

  force.initialize = function(_) {
    nodes = _;
  };

  force.extent = function(_) {
    return arguments.length ? (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1], force) : [[x0, y0], [x1, y1]];
  };

  return force;
}
