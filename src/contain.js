import constant from "./constant";

export default function(radius, x, y) {
  var nodes,
      rz,
      xz,
      yz;

  if (typeof radius !== "function") radius = constant(radius == null ? 100 : +radius);
  if (typeof x !== "function") x = constant(x == null ? 0 : +x);
  if (typeof y !== "function") y = constant(y == null ? 0 : +y);

  function force() {
    for (var i = 0, n = nodes.length, node, x, y, l, r; i < n; ++i) {
      node = nodes[i];
      x = node.x - xz[i];
      y = node.y - yz[i];
      if ((l = x * x + y * y) > (r = rz[i]) * r) {
        l = Math.sqrt(l), l = (l - r) / l;
        node.vx -= x * l;
        node.vy -= y * l;
      }
    }
  }

  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length;
    rz = new Array(n);
    xz = new Array(n);
    yz = new Array(n);
    for (i = 0; i < n; ++i) {
      rz[i] = +radius(nodes[i], i, nodes);
      xz[i] = +x(nodes[i], i, nodes);
      yz[i] = +y(nodes[i], i, nodes);
    }
  }

  force.initialize = function(_) {
    nodes = _;
    initialize();
  };

  force.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), initialize(), force) : radius;
  };

  force.x = function(_) {
    return arguments.length ? (x = typeof _ === "function" ? _ : constant(+_), initialize(), force) : x;
  };

  force.y = function(_) {
    return arguments.length ? (y = typeof _ === "function" ? _ : constant(+_), initialize(), force) : y;
  };

  return force;
}
