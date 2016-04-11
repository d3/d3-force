import {quadtree} from "d3-quadtree";
import constant from "./constant";

var nodeQuadtree = quadtree()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

export default function() {
  var nodes,
      charge = constant(-100),
      charges,
      distance2 = Infinity,
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
          dn = dx * dx + dy * dy,
          k = targetAlpha / dn;

      if (dw * dw / theta2 < dn) { // Barnes-Hut criterion
        if (dn < distance2) {
          k *= quad.charge;
          target.vx += dx * k;
          target.vy += dy * k;
        }
        return true;
      }

      if (quad.point && dn && dn < distance2) { // TODO handle coincident nodes
        k *= charges[quad.point.index];
        target.vx += dx * k;
        target.vy += dy * k;
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

  force.distance = function(_) {
    return arguments.length ? (distance2 = _ * _, force) : Math.sqrt(distance2);
  };

  force.theta = function(_) {
    return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
  };

  return force;
}
