import constant from "./constant.js";
import {radians} from "./math.js";

function value(x) {
  if (typeof x === "function") return x;
  if (x === null || x === undefined || isNaN(x = +x)) return;
  return constant(x);
}

export default function(radius, x, y, angle) {
  var nodes,
      strength = constant(0.1),
      strengths,
      radii,
      xs,
      ys,
      angles;

  radius = value(radius);
  x = value(x) || constant(0);
  y = value(y) || constant(0);
  angle = value(angle);

  function force(alpha) {
    for (var i = 0, n = nodes.length; i < n; ++i) {
      var node = nodes[i],
          dx = node.x - xs[i] || 1e-6,
          dy = node.y - ys[i] || 1e-6,
          r = Math.sqrt(dx * dx + dy * dy);

      if (radius) {
        var k = ((radii[i] - r) * strengths[i] * alpha) / r;
        node.vx += dx * k;
        node.vy += dy * k;
      }

      if (angle) {
        var a = Math.atan2(dy, dx),
          diff = angles[i] - a,
          q = r * Math.sin(diff) * (strengths[i] * alpha);

        // the factor below augments the "unease" for points that are opposite
        // the correct direction: in that case, though sin(diff) is small,
        // tan(diff/2) is very high
        q *= Math.hypot(1, Math.tan(diff / 2));

        node.vx += -q * Math.sin(a);
        node.vy += q * Math.cos(a);
      }
    }
  }

  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length;
    strengths = new Array(n);
    radii = new Array(n);
    xs = new Array(n);
    ys = new Array(n);
    angles = new Array(n);
    for (i = 0; i < n; ++i) {
      if (radius) radii[i] = +radius(nodes[i], i, nodes);
      xs[i] = +x(nodes[i], i, nodes);
      ys[i] = +y(nodes[i], i, nodes);
      if (angle) angles[i] = +angle(nodes[i], i, nodes) * radians;
      strengths[i] = isNaN(radii[i]) ? 0 : +strength(nodes[i], i, nodes);
    }
  }

  force.initialize = function(_) {
    nodes = _, initialize();
  };

  force.strength = function(_) {
    return arguments.length ? (strength = value(_) || constant(1), initialize(), force) : strength;
  };

  force.radius = function(_) {
    return arguments.length ? (radius = value(_), initialize(), force) : radius;
  };

  force.x = function(_) {
    return arguments.length ? (x = value(_) || constant(0), initialize(), force) : x;
  };

  force.y = function(_) {
    return arguments.length ? (y = value(_) || constant(0), initialize(), force) : y;
  };

force.angle = function(_) {
    return arguments.length ? (angle = value(_), initialize(), force) : y;
  };

  return force;
}
