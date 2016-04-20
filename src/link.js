import constant from "./constant";

var tau = 2 * Math.PI;

export default function(links) {
  var strength = constant(0.5),
      strengths,
      distance = constant(30),
      distances,
      nodes,
      bias;

  function force(alpha) {
    for (var i = 0, n = links.length, link, source, target, x, y, l, b; i < n; ++i) {
      link = links[i], source = link.source, target = link.target;
      x = target.x - source.x;
      y = target.y - source.y;
      if (l = x * x + y * y) l = Math.sqrt(l), l = (l - distances[i]) / l;
      else l = Math.random() * tau, x = Math.cos(l), y = Math.sin(l), l = distances[i];
      l *= alpha * strengths[i], x *= l, y *= l;
      target.vx -= x * (b = bias[i]);
      target.vy -= y * b;
      source.vx += x * (b = 1 - b);
      source.vy += y * b;
    }
  }

  function initialize() {
    if (!nodes || !links) return;

    var i,
        n = nodes.length,
        m = links.length,
        count = new Array(n), l;

    for (i = 0; i < n; ++i) {
      count[i] = 0;
    }

    for (i = 0, bias = new Array(m); i < m; ++i) {
      l = links[i];
      if (typeof l.source === "number") l.source = nodes[l.source];
      if (typeof l.target === "number") l.target = nodes[l.target];
      ++count[l.source.index];
      ++count[l.target.index];
    }

    for (i = 0; i < m; ++i) {
      l = links[i];
      bias[i] = count[l.source.index] / (count[l.source.index] + count[l.target.index]);
    }

    if (!strengths) for (i = 0, strengths = new Array(m); i < m; ++i) {
      strengths[i] = +strength(links[i]);
    }

    if (!distances) for (i = 0, distances = new Array(m); i < m; ++i) {
      distances[i] = +distance(links[i]);
    }
  }

  force.nodes = function(_) {
    return arguments.length ? (nodes = _, initialize(), force) : nodes;
  };

  force.links = function(_) {
    return arguments.length ? (links = _, initialize(), force) : links;
  };

  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), strengths = null, initialize(), force) : strength;
  };

  force.distance = function(_) {
    return arguments.length ? (distance = typeof _ === "function" ? _ : constant(+_), distances = null, initialize(), force) : distance;
  };

  return force;
}
