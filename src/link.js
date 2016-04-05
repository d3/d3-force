var tau = 2 * Math.PI;

function custom(links, strength, distance) {

  function force(nodes, alpha) { // TODO iterate links in random order
    for (var i = 0, n = links.length, link, source, target, x, y, l; i < n; ++i) {
      link = links[i], source = link.source, target = link.target;
      x = target.x - source.x;
      y = target.y - source.y;
      if (l = x * x + y * y) l = Math.sqrt(l), l = (l - distance) / (l * 2);
      else l = Math.random() * tau, x = Math.cos(l), y = Math.sin(l), l = distance / 2;
      l *= alpha * strength, x *= l, y *= l; // TODO per-link strength, distance and bias
      target.x -= x;
      target.y -= y;
      source.x += x;
      source.y += y;
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
  return custom(links, 1, 40);
}
