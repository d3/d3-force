import {map} from "d3-collection";
import constant from "./constant";

var tau = 2 * Math.PI;

function index(d, i) {
  return i;
}

export default function(links) {
  var id = index,
      strength = constant(0.5),
      strengths,
      distance = constant(30),
      distances,
      nodes,
      bias;

  if (links == null) links = [];

  function force(alpha) {
    for (var i = 0, n = links.length, link, source, target, x, y, l, b; i < n; ++i) {
      link = links[i], source = link.source, target = link.target;
      x = target.x + target.vx - source.x - source.vx;
      y = target.y + target.vy - source.y - source.vy;
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
        count = new Array(n),
        nodeById = map(nodes, id),
        link;

    for (i = 0; i < n; ++i) {
      count[i] = 0;
    }

    for (i = 0, bias = new Array(m); i < m; ++i) {
      link = links[i], link.index = i;
      if (typeof link.source !== "object") link.source = nodeById.get(link.source);
      if (typeof link.target !== "object") link.target = nodeById.get(link.target);
      ++count[link.source.index], ++count[link.target.index];
    }

    for (i = 0; i < m; ++i) {
      link = links[i], bias[i] = count[link.source.index] / (count[link.source.index] + count[link.target.index]);
    }

    if (!strengths) for (i = 0, strengths = new Array(m); i < m; ++i) {
      strengths[i] = +strength(links[i]);
    }

    if (!distances) for (i = 0, distances = new Array(m); i < m; ++i) {
      distances[i] = +distance(links[i]);
    }
  }

  force.initialize = function(_) {
    nodes = _;
    initialize();
  };

  force.links = function(_) {
    return arguments.length ? (links = _, strengths = distances = null, initialize(), force) : links;
  };

  force.id = function(_) {
    return arguments.length ? (id = _, initialize(), force) : id;
  };

  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), strengths = null, initialize(), force) : strength;
  };

  force.distance = function(_) {
    return arguments.length ? (distance = typeof _ === "function" ? _ : constant(+_), distances = null, initialize(), force) : distance;
  };

  return force;
}
