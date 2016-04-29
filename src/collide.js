import constant from "./constant";
import jiggle from "./jiggle";
import {quadtree} from "d3-quadtree";

function x(d) {
  return d.x + d.vx;
}

function y(d) {
  return d.y + d.vy;
}

export default function(radius) {
  var nodes,
      radii,
      radiusMax,
      strength = 0.7,
      iterations = 1;

  if (typeof radius !== "function") radius = constant(radius == null ? 1 : +radius);

  function force() {
    var i, n = nodes.length,
        tree = quadtree(nodes, x, y),
        node,
        nx,
        ny,
        nr,
        vx,
        vy,
        nx0,
        ny0,
        nx1,
        ny1;

    for (var k = 0; k < iterations; ++k) {
      for (i = 0; i < n; ++i) {
        node = nodes[i], nr = radii[i] + radiusMax, vx = vy = 0;
        nx = node.x + node.vx, nx0 = nx - nr, nx1 = nx + nr;
        ny = node.y + node.vy, ny0 = ny - nr, ny1 = ny + nr;
        tree.remove(node).visit(apply);
        node.vx += vx * strength, node.vy += vy * strength;
        tree.add(node);
      }
    }

    function apply(quad, x0, y0, x1, y1) {
      if (x0 > nx1 || x1 < nx0 || y0 > ny1 || y1 < ny0) return true;
      if (quad.length) return;
      var x = nx - quad.data.x - quad.data.vx || jiggle(),
          y = ny - quad.data.y - quad.data.vy || jiggle(),
          l = x * x + y * y,
          r = radii[i] + radii[quad.data.index];
      if (l < r * r) {
        l = Math.sqrt(l);
        l = (r - l) / l;
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

  force.iterations = function(_) {
    return arguments.length ? (iterations = +_, force) : iterations;
  };

  force.strength = function(_) {
    return arguments.length ? (strength = +_, force) : strength;
  };

  force.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), force) : radius;
  };

  return force;
}
