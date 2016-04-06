var tau = 2 * Math.PI;

function custom(nodes, links, strength, distance) {
  var i, n, count, bias;

  for (i = 0, n = nodes.length, count = new Array(n); i < n; ++i) {
    count[nodes[i].index = i] = 0;
  }

  for (i = 0, n = links.length; i < n; ++i) {
    ++count[links[i].source.index], ++count[links[i].target.index];
  }

  for (i = 0, bias = new Array(n); i < n; ++i) {
    bias[i] = count[links[i].source.index] / (count[links[i].source.index] + count[links[i].target.index]);
  }

  function force(alpha) {
    for (var i = 0, n = links.length, link, source, target, x, y, l, b; i < n; ++i) {
      link = links[i], source = link.source, target = link.target;
      x = target.x - source.x;
      y = target.y - source.y;
      if (l = x * x + y * y) l = Math.sqrt(l), l = (l - distance) / l;
      else l = Math.random() * tau, x = Math.cos(l), y = Math.sin(l), l = distance;
      l *= alpha * strength, x *= l, y *= l;
      target.vx -= x * (b = bias[i]);
      target.vy -= y * b;
      source.vx += x * (b = 1 - b);
      source.vy += y * b;
    }
  }

  // TODO recompute link counts
  force.nodes = function(_) {
    return custom(_, links, strength, distance);
  };

  // TODO recompute link counts
  force.links = function(_) {
    return custom(nodes, _, strength, distance);
  };

  force.strength = function(_) {
    return custom(nodes, links, +_, distance);
  };

  force.distance = function(_) {
    return custom(nodes, links, strength, +_);
  };

  return force;
}

export default function(nodes, links) {
  return custom(nodes, links, 0.5, 30);
}
