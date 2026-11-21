import {quadtree} from "d3-quadtree";
import constant from "./constant.js";
import jiggle from "./jiggle.js";
import {x, y} from "./simulation.js";

export default function() {
  var nodes,
      node,
      random,
      alpha,
      strength = constant(-30),
      strengths,
      distanceMin2 = 1,
      distanceMax2 = Infinity,
      theta2 = 0.81;

  function force(_) {
    var i, n = nodes.length, tree = quadtree(nodes, x, y).visitAfter(accumulate), root = tree.root();
    if (!root) return;
    var quads = [], extents = [], quad, j, k, [[x0], [x1]] = tree.extent(), qx0, qx1, xm, child, dx, dy, l, w;
    for (alpha = _, i = 0; i < n; ++i) {
      node = nodes[i], quads[0] = root, extents[0] = x0, extents[1] = x1, j = 1, k = 2;
      while (j) {
        quad = quads[--j], qx1 = extents[--k], qx0 = extents[--k];
        if (!quad.value) continue;
        dx = quad.x - node.x, dy = quad.y - node.y, w = qx1 - qx0, l = dx * dx + dy * dy;

        // Apply the Barnes-Hut approximation if possible.
        // Limit forces for very close nodes; randomize direction if coincident.
        if (w * w / theta2 < l) {
          if (l < distanceMax2) {
            if (dx === 0) dx = jiggle(random), l += dx * dx;
            if (dy === 0) dy = jiggle(random), l += dy * dy;
            if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
            node.vx += dx * quad.value * alpha / l;
            node.vy += dy * quad.value * alpha / l;
          }
        }

        // Otherwise, process points directly.
        else if (quad.length) {
          xm = (qx0 + qx1) / 2;
          if (child = quad[3]) quads[j++] = child, extents[k++] = xm, extents[k++] = qx1;
          if (child = quad[2]) quads[j++] = child, extents[k++] = qx0, extents[k++] = xm;
          if (child = quad[1]) quads[j++] = child, extents[k++] = xm, extents[k++] = qx1;
          if (child = quad[0]) quads[j++] = child, extents[k++] = qx0, extents[k++] = xm;
        } else if (l < distanceMax2) {
          apply(quad, dx, dy, l);
        }
      }
    }
  }

  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length, node;
    strengths = new Array(n);
    for (i = 0; i < n; ++i) node = nodes[i], strengths[node.index] = +strength(node, i, nodes);
  }

  function accumulate(quad) {
    var strength = 0, q, c, weight = 0, x, y, i;

    // For internal nodes, accumulate forces from child quadrants.
    if (quad.length) {
      for (x = y = i = 0; i < 4; ++i) {
        if ((q = quad[i]) && (c = Math.abs(q.value))) {
          strength += q.value, weight += c, x += c * q.x, y += c * q.y;
        }
      }
      quad.x = x / weight;
      quad.y = y / weight;
    }

    // For leaf nodes, accumulate forces from coincident quadrants.
    else {
      q = quad;
      q.x = q.data.x;
      q.y = q.data.y;
      do strength += strengths[q.data.index];
      while (q = q.next);
    }

    quad.value = strength;
  }

  function apply(quad, x, y, l) {
    var w;

    // Limit forces for very close nodes; randomize direction if coincident.
    if (quad.data !== node || quad.next) {
      if (x === 0) x = jiggle(random), l += x * x;
      if (y === 0) y = jiggle(random), l += y * y;
      if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
    }

    do if (quad.data !== node) {
      w = strengths[quad.data.index] * alpha / l;
      node.vx += x * w;
      node.vy += y * w;
    } while (quad = quad.next);
  }

  force.initialize = function(_nodes, _random) {
    nodes = _nodes;
    random = _random;
    initialize();
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
