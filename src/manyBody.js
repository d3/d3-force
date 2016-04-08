import {quadtree} from "d3-quadtree";
import constant from "./constant";

var nodeQuadtree = quadtree()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

function accumulate(quad, k) {
  var cx = 0, cy = 0, charge = 0;

  if (quad.point) { // TODO handle coincident nodes
    charge += quad.selfCharge = k;
    cx += k * quad.point[0];
    cy += k * quad.point[1];
  }

  else for (var i = 0, child; i < 4; ++i) {
    child = quad[i];
    if (child == null) continue;
    accumulate(child, k);
    charge += child.charge;
    cx += child.charge * child.cx;
    cy += child.charge * child.cy;
  }

  quad.cx = cx / charge;
  quad.cy = cy / charge;
  quad.charge = charge;
}

export default function() {
  var nodes,
      strength = constant(-100),
      distance2 = Infinity,
      theta2 = 0.64,
      target;

  function force(alpha) {
    var root = nodeQuadtree(nodes);
    accumulate(root, alpha * strength()); // TODO
    for (var i = 0, n = nodes.length; i < n; ++i) {
      target = nodes[i];
      root.each(apply);
    }
  }

  function apply(quad, x1, _, x2) {
    if (!quad.point || quad.point.data !== target) {
      var dx = quad.cx - target.x,
          dy = quad.cy - target.y,
          dw = x2 - x1,
          dn = dx * dx + dy * dy,
          k;

      if (dw * dw / theta2 < dn) { // Barnes-Hut criterion
        if (dn < distance2) {
          k = quad.charge / dn;
          target.vx += dx * k;
          target.vy += dy * k;
        }
        return true;
      }

      if (quad.point && dn && dn < distance2) { // TODO handle coincident nodes
        k = quad.selfCharge / dn;
        target.vx += dx * k;
        target.vy += dy * k;
      }
    }

    return !quad.charge;
  }

  force.nodes = function(_) {
    return arguments.length ? (nodes = _, force) : nodes;
  };

  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), force) : strength;
  };

  force.distance = function(_) {
    return arguments.length ? (distance2 = _ * _, force) : Math.sqrt(distance2);
  };

  force.theta = function(_) {
    return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
  };

  return force;
}
