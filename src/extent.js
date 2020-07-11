export default function(extent) {
  var nodes;

  if (extent === undefined) extent = [[0, 0], [960, 500]];

  function force() {
    for (var i = 0; i < nodes.length; ++i) {
      var node = nodes[i], r = node.radius || 0;
      node.x = clamp(node.x, extent[0][0] - r, extent[1][0] + r);
      node.y = clamp(node.y, extent[0][1] - r, extent[1][1] + r);
    }
  }

  force.initialize = function(_) { nodes = _; };

  force.extent = function(_) {
      return arguments.length ? (extent = _, force) : extent;
  };

  return force;
}

function clamp(x, min, max) {
  return Math.max(min, Math.min(max, x));
}
