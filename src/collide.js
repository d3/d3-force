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
      strength = 0.7,
      iterations = 1,
      vx,
      vy;

  if (typeof radius !== "function") radius = constant(radius == null ? 1 : +radius);

  function force() {
    var i, n = nodes.length,
        tree,
        node,
        xi,
        yi,
        ri,
        ri2;

    for (var k = 0; k < iterations; ++k) {
      tree = quadtree(nodes, x, y).visitAfter(prepare);
      for (i = 0; i < n; ++i) {
        node = nodes[i];
        ri = radii[i], ri2 = ri * ri;
        xi = node.x + node.vx;
        yi = node.y + node.vy;
        tree.visit(apply);
      }
      for (i = 0; i < n; ++i) {
        node = nodes[i];
        node.vx += vx[i] * strength, vx[i] = 0;
        node.vy += vy[i] * strength, vy[i] = 0;
      }
    }

    function apply(quad, x0, y0, x1, y1) {
      if (x0 > xi + (r = ri + (rj = quad.r)) || x1 < xi - r || y0 > yi + r || y1 < yi - r) return true;
      if (quad.length || (j = (data = quad.data).index) <= i) return;
      var data,
          j,
          x = xi - data.x - data.vx,
          y = yi - data.y - data.vy,
          l = x * x + y * y,
          r,
          rj;
      if (l < r * r) {
        if (x === 0) x = jiggle(), l += x * x;
        if (y === 0) y = jiggle(), l += y * y;
        l = (r - (l = Math.sqrt(l))) / l;
        vx[i] += (x *= l) * (r = (rj *= rj) / (ri2 + rj));
        vy[i] += (y *= l) * r;
        vx[j] -= x * (r = 1 - r);
        vy[j] -= y * r;
      }
    }
  }

  function prepare(quad) {
    if (quad.data) return quad.r = radii[quad.data.index];
    for (var i = quad.r = 0; i < 4; ++i) {
      if (quad[i] && quad[i].r > quad.r) {
        quad.r = quad[i].r;
      }
    }
  }

  force.initialize = function(_) {
    var i, n = (nodes = _).length;
    radii = new Array(n), vx = new Array(n), vy = new Array(n);
    for (i = 0; i < n; ++i) radii[i] = +radius(nodes[i], i, nodes), vx[i] = vy[i] = 0;
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
