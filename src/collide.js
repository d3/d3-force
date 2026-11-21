import {quadtree} from "d3-quadtree";
import constant from "./constant.js";
import jiggle from "./jiggle.js";

function x(d) {
  return d.x + d.vx;
}

function y(d) {
  return d.y + d.vy;
}

export default function(radius) {
  var nodes,
      radii,
      random,
      strength = 1,
      iterations = 1;

  if (typeof radius !== "function") radius = constant(radius == null ? 1 : +radius);

  function force() {
    var i, n = nodes.length,
        tree,
        node,
        xi,
        yi,
        ri,
        ri2,
        root, x0, y0, x1, y1,
        quads = [], extents = [], quad, child, j, e,
        qx0, qy0, qx1, qy1, xm, ym;

    for (var k = 0; k < iterations; ++k) {
      tree = quadtree(nodes, x, y).visitAfter(prepare);
      if (!(root = tree.root())) return;
      [[x0, y0], [x1, y1]] = tree.extent();
      for (i = 0; i < n; ++i) {
        node = nodes[i];
        ri = radii[node.index], ri2 = ri * ri;
        xi = node.x + node.vx;
        yi = node.y + node.vy;
        quads[0] = root, extents[0] = x0, extents[1] = y0, extents[2] = x1, extents[3] = y1, j = 1, e = 4;
        while (j) {
          quad = quads[--j], qy1 = extents[--e], qx1 = extents[--e], qy0 = extents[--e], qx0 = extents[--e];
          if (!apply(quad, qx0, qy0, qx1, qy1) && quad.length) {
            xm = (qx0 + qx1) / 2, ym = (qy0 + qy1) / 2;
            if (child = quad[3]) quads[j++] = child, extents[e++] = xm, extents[e++] = ym, extents[e++] = qx1, extents[e++] = qy1;
            if (child = quad[2]) quads[j++] = child, extents[e++] = qx0, extents[e++] = ym, extents[e++] = xm, extents[e++] = qy1;
            if (child = quad[1]) quads[j++] = child, extents[e++] = xm, extents[e++] = qy0, extents[e++] = qx1, extents[e++] = ym;
            if (child = quad[0]) quads[j++] = child, extents[e++] = qx0, extents[e++] = qy0, extents[e++] = xm, extents[e++] = ym;
          }
        }
      }
    }

    function apply(quad, x0, y0, x1, y1) {
      var data = quad.data, rj = quad.r, r = ri + rj;
      if (data) {
        if (data.index > node.index) {
          var x = xi - data.x - data.vx,
              y = yi - data.y - data.vy,
              l = x * x + y * y;
          if (l < r * r) {
            if (x === 0) x = jiggle(random), l += x * x;
            if (y === 0) y = jiggle(random), l += y * y;
            l = (r - (l = Math.sqrt(l))) / l * strength;
            node.vx += (x *= l) * (r = (rj *= rj) / (ri2 + rj));
            node.vy += (y *= l) * r;
            data.vx -= x * (r = 1 - r);
            data.vy -= y * r;
          }
        }
        return;
      }
      return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
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

  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length, node;
    radii = new Array(n);
    for (i = 0; i < n; ++i) node = nodes[i], radii[node.index] = +radius(node, i, nodes);
  }

  force.initialize = function(_nodes, _random) {
    nodes = _nodes;
    random = _random;
    initialize();
  };

  force.iterations = function(_) {
    return arguments.length ? (iterations = +_, force) : iterations;
  };

  force.strength = function(_) {
    return arguments.length ? (strength = +_, force) : strength;
  };

  force.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), initialize(), force) : radius;
  };

  return force;
}
