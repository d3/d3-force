import jiggle from "./jiggle.js";

function group(d) {
  return d.group;
}

export default function (groups) {
  var id = group,
      strength = 0.5,
      radius = 10,
      nodes;

  if (groups == null) groups = [];

  function force(alpha) {
    groups.forEach((c) => {
      const avg = c.nodes.reduce((o, n) => ({
        x: o.x + (n.x || 0),
        y: o.y + (n.y || 0)
      }), {x: 0, y: 0});

      c.x = c.fx ? c.fx : avg.x / c.nodes.length;
      c.y = c.fy ? c.fy : avg.y / c.nodes.length;

      c.nodes.forEach((n) => {
        let x = (n.x - c.x) || jiggle(),
            y = (n.y - c.y) || jiggle(),
            l = Math.hypot(x, y);
        l = strength * alpha * (l - radius) / l;
        n.vx -= x * l;
        n.vy -= y * l;
      });
    });
  }

  function init() {
    if (!nodes) return;
    groups.forEach((c) => {
      c.nodes = nodes.filter((n) => id(n) === c.id)
    })
  }

  force.initialize = function(_) {
    nodes = _;
    init();
  };

  force.id = function(_) {
    return arguments.length ? (id = _, force) : id;
  };

  force.groups = function(_) {
    return arguments.length ? (groups = _, init(), force) : groups;
  };

  force.strength = function(_) {
    return arguments.length ? (strength = +_, force) : strength;
  };

  force.radius = function(_) {
    return arguments.length ? (radius = +_, force) : radius;
  };

  return force;
}