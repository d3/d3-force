import constant from "./constant";
import {quadtree} from "d3-quadtree";
import {x, y} from "./simulation";

export default function() {
  var nodes,
      radius = constant(1),
      radii,
      radiusMax;

  function force() {
    var i, n = nodes.length,
        tree = quadtree(nodes, x, y),
        node,
        r,
        nx1,
        nx2,
        ny1,
        ny2;

    for (i = 0; i < n; ++i) {
      node = nodes[i], r = radii[i] + radiusMax;
      nx1 = node.x - r, nx2 = node.x + r;
      ny1 = node.y - r, ny2 = node.y + r;
      tree.remove(node).visit(apply).add(node);
    }

    function apply(quad, x1, y1, x2, y2) {
      if (!quad.length) {
        var x = node.x + node.vx - quad.data.x,
            y = node.y + node.vy - quad.data.y,
            l = x * x + y * y,
            r = radii[i] + radii[quad.data.index];
        if (l < r * r) {
          l = Math.sqrt(l), l = (l - r) / (l * 2);
          x -= node.vx;
          y -= node.vy;
          node.x -= x * l;
          node.y -= y * l;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
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
