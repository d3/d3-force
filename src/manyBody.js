import {quadtree} from "d3-quadtree";

var nodeQuadtree = quadtree()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

function accumulate(quad, k) {
  var cx = 0, cy = 0, charge = 0;

  // quad.charge = 0;

  if (!quad.leaf) {
    for (var i = 0, child; i < 4; ++i) {
      child = quad.nodes[i];
      if (child == null) continue;
      accumulate(child, k);
      charge += child.charge;
      cx += child.charge * child.cx;
      cy += child.charge * child.cy;
    }
  }

  if (quad.data) {

    // TODO Jitter internal nodes that are coincident?
    // if (!quad.leaf) {
    //   quad.data.x += Math.random() - 0.5;
    //   quad.data.y += Math.random() - 0.5;
    // }

    charge += quad.selfCharge = k;
    cx += k * quad.data.x;
    cy += k * quad.data.y;
  }

  quad.cx = cx / charge;
  quad.cy = cy / charge;
  quad.charge = charge;
}

function custom(nodes, strength, distance2, theta2) {
  var target;

  function force(alpha) {
    var root = nodeQuadtree(nodes);
    accumulate(root, alpha * strength);
    for (var i = 0, n = nodes.length; i < n; ++i) target = nodes[i], root.visit(apply);
  }

  function apply(quad, x1, _, x2) {
    if (quad.data !== target) {
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

      if (quad.data && dn && dn < distance2) {
        k = quad.selfCharge / dn;
        target.vx += dx * k;
        target.vy += dy * k;
      }
    }

    return !quad.charge;
  }

  force.nodes = function(_) {
    return custom(_, strength, distance2, theta2);
  };

  force.strength = function(_) {
    return custom(nodes, +_, distance2, theta2);
  };

  force.distance = function(_) {
    return custom(nodes, strength, _ * _, theta2);
  };

  force.theta = function(_) {
    return custom(nodes, strength, distance2, _ * _);
  };

  return force;
}

export default function(nodes) {
  return custom(nodes, -100, Infinity, 0.64);
}
