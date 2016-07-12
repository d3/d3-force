import constant from "./constant";
import jiggle from "./jiggle";
import {quadtree} from "d3-quadtree";

function x(d) {
  return d.x + d.vx;
}

function y(d) {
  return d.y + d.vy;
}

export default function(bbox) {
  var nodes,
      boundingBoxes,
      strength = 1,
      iterations = 1;

  if (typeof bbox !== "function") bbox = constant(bbox == null ? [[0,0][1,1]] : bbox);

  function force() {
    var i,
        n = nodes.length,
        tree,
        node,
        xi,
        yi,
        bbi,
        nx1,
        ny1,
        nx2,
        ny2

    for (var k = 0; k < iterations; ++k) {
      tree = quadtree(nodes, x, y).visitAfter(prepare);

      for (i = 0; i < n; ++i) {
        node = nodes[i];
        bbi = boundingBoxes[i],
        xi = node.x + node.vx;
        yi = node.y + node.vy;
        nx1 = xi + bbi[0][0]
        ny1 = yi + bbi[0][1]
        nx2 = xi + bbi[1][0]
        ny2 = yi + bbi[1][1]
        tree.visit(apply);
      }
    }

    function apply(quad, x0, y0, x1, y1) {
        var data = quad.data,
          bWidth = bbLength(bbi, 0),
          bHeight = bbLength(bbi, 1);

        if (data) {
          if (data.index > i) {
            var bbj = boundingBoxes[data.index],
              dnx1 = data.x + data.vx + bbj[0][0],
              dny1 = data.y + data.vy + bbj[0][1],
              dnx2 = data.x + data.vx + bbj[1][0],
              dny2 = data.y + data.vy + bbj[1][1],
              dWidth = bbLength(bbj, 0),
              dHeight = bbLength(bbj, 1),
              x = node.x - data.x,
              y = node.y - data.y,
              lx = Math.abs(x),
              ly = Math.abs(y);

            if (nx1 <= dnx2 && dnx1 <= nx2 && ny1 <= dny2 && dny1 <= ny2) {
              if (x === 0) x = jiggle(), lx += x * x;
              if (y === 0) y = jiggle(), ly += y * y;

                node.vx += lx * (1 / lx) * ((bWidth * bWidth) / (dWidth * dWidth + bWidth));
                node.vy += ly * (1 / ly) * ((bHeight * bHeight) / (dHeight * dHeight + bHeight));
                data.vx -= lx * (1 / lx) * (((bWidth * bWidth) / (dWidth * dWidth + bWidth)));
                data.vy -= ly * (1 / ly) * (((bHeight * bHeight) / (dHeight * dHeight + bHeight)));

            }

          }
          return;
        }

        return x0 > nx2 || x1 < nx1 || y0 > ny2 || y1 < ny1;
    }

  }

  function prepare(quad) {
    if (quad.data) return quad.bb = boundingBoxes[quad.data.index];
      for (var i = quad.bb = [[0,0],[0,0]]; i < 4; ++i) {
        if (quad[i] && bbArea(quad[i].bb) > bbArea(quad.bb)) {
          quad.bb = quad[i].bb;
      }
    }
  }


  function bbArea(bbox) {
    return (bbox[1][0] - bbox[0][0]) * (bbox[1][1] - bbox[0][1])
  }

  function bbLength(bbox, heightWidth) {
    return (bbox[1][heightWidth] - bbox[0][heightWidth])
  }

  force.initialize = function(_) {
    var i, n = (nodes = _).length; boundingBoxes = new Array(n);
    for (i = 0; i < n; ++i) boundingBoxes[i] = bbox(nodes[i], i, nodes);
  };

  force.iterations = function(_) {
    return arguments.length ? (iterations = +_, force) : iterations;
  };

  force.strength = function(_) {
    return arguments.length ? (strength = +_, force) : strength;
  };

  force.bbox = function(_) {
    return arguments.length ? (bbox = typeof _ === "function" ? _ : constant(+_), force) : bbox;
  };

  return force;
}
