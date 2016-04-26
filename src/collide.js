import constant from "./constant";
import {quadtree} from "d3-quadtree";
import {x, y} from "./simulation";

export default function(radius) {
  var nodes,
      radii,
      radiusMax,
      strength = 0.7;

  if (typeof radius !== "function") radius = constant(radius == null ? 1 : +radius);

  function force() {
    var i, n = nodes.length,
        tree = quadtree(nodes, x, y),
        node,
        nx0,
        ny0,
        nx1,
        ny1,
        vx,
        vy,
        nr;

    for (i = 0; i < n; ++i) {
      node = nodes[i], nr = radii[i] + radiusMax, vx = vy = 0;
      nx0 = node.x - nr, ny0 = node.y - nr;
      nx1 = node.x + nr, ny1 = node.y + nr;
      tree.remove(node).visit(apply);
      node.x += vx * strength, node.y += vy * strength;
      tree.add(node);
    }

    function apply(quad, x0, y0, x1, y1) {
      if (x0 > nx1 || x1 < nx0 || y0 > ny1 || y1 < ny0) return true;
      if (quad.length) return;
      var x = node.x - quad.data.x,
          y = node.y - quad.data.y,
          l = x * x + y * y,
          r = radii[i] + radii[quad.data.index];
      if (l < r * r) {
        l = (r - (l = Math.sqrt(l))) / l;
        vx += x * l, vy += y * l;
      }
    }
  }

  force.initialize = function(_) {
    var i, n = (nodes = _).length, r;
    radii = new Array(n);
    radiusMax = 0;
    for (i = 0; i < n; ++i) {
      if ((radii[i] = r = +radius(nodes[i], i, nodes)) > radiusMax) {
        radiusMax = r;
      }
    }
  };

  force.strength = function(_) {
    return arguments.length ? (strength = +_, force) : strength;
  };

  force.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), force) : radius;
  };

  return force;
}
