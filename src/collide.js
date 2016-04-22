import constant from "./constant";
import {quadtree} from "d3-quadtree";

function x(d) {
  return d.x + d.vx;
}

function y(d) {
  return d.y + d.vy;
}

export default function() {
  var nodes,
      radius = constant(1),
      radii,
      radiusMax;

  function force() {
    var i, n = nodes.length,
        tree = quadtree(nodes, x, y),
        node,
        nx0,
        ny0,
        nx1,
        ny1,
        nr,
        nx,
        ny;

    for (i = 0; i < n; ++i) {
      node = nodes[i];
      nx = node.x + node.vx; // Look into the future!
      ny = node.y + node.vy;
      nr = radii[i] + radiusMax;
      nx0 = nx - nr;
      ny0 = ny - nr;
      nx1 = nx + nr;
      ny1 = ny + nr;
      tree.remove(node).visit(apply).add(node);
    }

    function apply(quad, x0, y0, x1, y1) {
      if (x0 > nx1 || x1 < nx0 || y0 > ny1 || y1 < ny0) return true;
      if (quad.length) return;
      var x = nx - quad.data.x - quad.data.vx,
          y = ny - quad.data.y - quad.data.vy,
          l = x * x + y * y,
          r = radii[i] + radii[quad.data.index];
      if (l < r * r) {
        l = Math.sqrt(l), l = (l - r) / (l * 2);
        node.x -= (x - node.vx) * l;
        node.y -= (y - node.vy) * l;
      }
    }
  }

  force.initialize = function(_) {
    nodes = _.nodes();
    var i, n = nodes.length, r;
    radii = new Array(n), radiusMax = 0;
    for (i = 0; i < n; ++i) {
      if ((radii[i] = r = +radius(nodes[i], i, nodes)) > radiusMax) {
        radiusMax = r;
      }
    }
  };

  force.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), force) : radius;
  };

  return force;
}
