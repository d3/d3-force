import constant from "./constant";

export default function(x, y) {
  var strength = constant(0.1),
      nodes,
      strengths,
      xz,
      yz;

  if (typeof x !== "function") x = constant(x == null ? 0 : +x);
  if (typeof y !== "function") y = constant(y == null ? 0 : +y);

  function force(alpha) {
    for (var i = 0, n = nodes.length, node, k; i < n; ++i) {
      node = nodes[i];
      k = strengths[i] * alpha;
      node.vx += (xz[i] - node.x) * k;
      node.vy += (yz[i] - node.y) * k;
    }
  }

  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length;
    strengths = new Array(n);
    xz = new Array(n);
    yz = new Array(n);
    for (i = 0; i < n; ++i) {
      strengths[i] = +strength(nodes[i], i, nodes);
      xz[i] = +x(nodes[i], i, nodes);
      yz[i] = +y(nodes[i], i, nodes);
    }
  }

  force.initialize = function(simulation) {
    nodes = simulation.nodes();
    initialize();
  };

  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
  };

  force.x = function(_) {
    return arguments.length ? (x = typeof _ === "function" ? _ : constant(+_), initialize(), force) : x;
  };

  force.y = function(_) {
    return arguments.length ? (y = typeof _ === "function" ? _ : constant(+_), initialize(), force) : y;
  };

  return force;
}
