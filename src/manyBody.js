import {quadtree} from "d3-quadtree";
import constant from "./constant";

var tau = 2 * Math.PI,
    epsilon = 1;

var nodeQuadtree = quadtree()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

export default function() {
  var nodes,
      charge = constant(-100),
      charges,
      distanceMin2 = 1,
      distanceMax2 = Infinity,
      theta2 = 0.64,
      target,
      targetAlpha;

  function force(alpha) {
    var root = nodeQuadtree(nodes);
    root.eachAfter(accumulate);
    targetAlpha = alpha;
    for (var i = 0, n = nodes.length; i < n; ++i) {
      target = nodes[i];
      root.eachBefore(apply);
    }
  }

  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length;
    charges = new Array(n);
    for (i = 0; i < n; ++i) charges[i] = +charge(nodes[i], i, nodes);
  }

  function accumulate(quad) {

    if (quad.point) { // TODO handle coincident nodes
      quad.cx = quad.point[0];
      quad.cy = quad.point[1];
      quad.charge = charges[quad.point.index];
      return;
    }

    var cx = 0, cy = 0, charge = 0, child, i;

    for (i = 0; i < 4; ++i) {
      if (!(child = quad[i])) continue;
      charge += child.charge;
      cx += child.charge * child.cx;
      cy += child.charge * child.cy;
    }

    quad.cx = cx / charge;
    quad.cy = cy / charge;
    quad.charge = charge;
  }

  function apply(quad, x1, _, x2) {
    if (!quad.point || quad.point.data !== target) {
      var dx = quad.cx - target.x,
          dy = quad.cy - target.y,
          dw = x2 - x1,
          l = dx * dx + dy * dy;

      if (!l) { // Randomize direction for exactly-coincident nodes.
        l = Math.random() * tau, dx = Math.cos(l), dy = Math.sin(l), l = 1;
      }

      if (l < distanceMin2) { // Limit forces for very close nodes.
        l = Math.sqrt(l / distanceMin2), dx /= l, dy /= l, l = distanceMin2;
      }

      if (dw * dw / theta2 < l) { // Barnes-Hut criterion
        if (l < distanceMax2) {
          l = quad.charge * targetAlpha / l;
          target.vx += dx * l;
          target.vy += dy * l;
        }
        return true;
      }

      if (quad.point && l < distanceMax2) { // TODO handle coincident nodes
        l = charges[quad.point.index] * targetAlpha / l;
        target.vx += dx * l;
        target.vy += dy * l;
      }
    }

    return !quad.charge;
  }

  force.nodes = function(_) {
    return arguments.length ? (nodes = _, initialize(), force) : nodes;
  };

  force.charge = function(_) {
    return arguments.length ? (charge = typeof _ === "function" ? _ : constant(+_), initialize(), force) : charge;
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
