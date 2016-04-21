import constant from "./constant";

var tau = 2 * Math.PI;

export default function() {
  var nodes,
      strength = constant(-100),
      strengths,
      distanceMin2 = 1,
      distanceMax2 = Infinity,
      theta2 = 0.81,
      target,
      targetAlpha;

  function force(alpha) {
    var tree = this.quadtree().visitAfter(accumulate), n = nodes.length, i;
    targetAlpha = alpha;
    for (i = 0; i < n; ++i) target = nodes[i], tree.visit(apply);
  }

  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length;
    strengths = new Array(n);
    for (i = 0; i < n; ++i) strengths[i] = +strength(nodes[i], i, nodes);
  }

  function accumulate(quad) {
    var strength = 0, q, c, x, y, i;

    // For internal nodes, accumulate forces from child quadrants.
    if (quad.length) {
      for (x = y = i = 0; i < 4; ++i) {
        if ((q = quad[i]) && (c = q.strength)) {
          strength += c, x += c * q.x, y += c * q.y;
        }
      }
      quad.x = x / strength;
      quad.y = y / strength;
    }

    // For leaf nodes, accumulate forces from coincident quadrants.
    else {
      q = quad;
      do strength += strengths[q.index];
      while (q = q.next);
    }

    quad.strength = strength;
  }

  function apply(quad, x1, _, x2) {
    if (!quad.strength) return true;

    var dx = quad.x - target.x,
        dy = quad.y - target.y,
        w = x2 - x1,
        l = dx * dx + dy * dy;

    // Limit forces for very close nodes.
    // Randomize direction for exactly-coincident nodes.
    if (l < distanceMin2) {
      if (!l) l = Math.random() * tau, dx = Math.cos(l), dy = Math.sin(l), l = 1;
      l = Math.sqrt(l / distanceMin2), dx /= l, dy /= l, l = distanceMin2;
    }

    // Apply the Barnes-Hut approximation if possible.
    if (w * w / theta2 < l) {
      if (l < distanceMax2) {
        l = quad.strength * targetAlpha / l;
        target.vx += dx * l;
        target.vy += dy * l;
      }
      return true;
    }

    // Otherwise, process points directly.
    else if (quad.length || l >= distanceMax2) return;

    do if (quad.index !== target.index) {
      w = strengths[quad.index] * targetAlpha / l;
      target.vx += dx * w;
      target.vy += dy * w;
    } while (quad = quad.next);
  }

  force.nodes = function(_) {
    return arguments.length ? (nodes = _, initialize(), force) : nodes;
  };

  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
  };

  force.distanceMin = function(_) {
    return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
  };

  force.distanceMax = function(_) {
    return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
  };

  force.theta = function(_) {
    return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
  };

  return force;
}
