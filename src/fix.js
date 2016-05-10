export default function(node, x, y) {
  x = x == null ? 0 : +x;
  y = y == null ? 0 : +y;

  function force() {
    node.x = x, node.y = y, node.vx = node.vy = 0;
  }

  force.x = function(_) {
    return arguments.length ? (x = +_, force) : x;
  };

  force.y = function(_) {
    return arguments.length ? (y = +_, force) : y;
  };

  return force;
}
