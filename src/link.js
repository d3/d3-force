var tau = 2 * Math.PI;

function custom(links, strength, distance) {

  // TODO We need to count the number of links for each node (node.weight),
  // and then distribute the link forces equally for each node.

  function force(alpha) {
    for (var i = 0, n = links.length, link, source, target, x, y, l; i < n; ++i) {
      link = links[i], source = link.source, target = link.target;
      x = target.x - source.x;
      y = target.y - source.y;
      if (l = x * x + y * y) l = Math.sqrt(l), l = (l - distance) / (l * 2);
      else l = Math.random() * tau, x = Math.cos(l), y = Math.sin(l), l = distance / 2;
      l *= alpha * strength, x *= l, y *= l; // TODO per-link strength, distance and bias?
      target.vx -= x;
      target.vy -= y;
      source.vx += x;
      source.vy += y;
    }
  }

  force.links = function(_) {
    return custom(_, strength, distance);
  };

  force.strength = function(_) {
    return custom(links, +_, distance);
  };

  force.distance = function(_) {
    return custom(links, strength, +_);
  };

  return force;
}

export default function(links) {
  return custom(links, 0.1, 40);
}
