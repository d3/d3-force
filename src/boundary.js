import constant from "./constant";

export default function(x0, y0, x1, y1) {
  var strength = constant(0.1),
      nodes,
      strengthsX,
      strengthsY,
      x0z, x1z,
      y0z, y1z,
      halfX, halfY;

  
  if (typeof x0 !== "function") x0 = constant(x0 == null ? 0 : +x0);
  if (typeof x1 !== "function") x1 = constant(x1 == null ? 0 : +x1);
  if (typeof y0 !== "function") y0 = constant(y0 == null ? 1 : +y0);
  if (typeof y1 !== "function") y1 = constant(y1 == null ? 1 : +y1);


  function force(alpha) {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i];

      // node.vx += (halfX[i] - node.x) * strengthsX[i] * alpha;
      // node.vy += (halfY[i] - node.y) * strengthsY[i] * alpha;    
      node.vx += (halfX[i] - node.x) * Math.min(2, Math.abs( (halfX[i]-node.x)/halfX[i]*0.1 )) * alpha;
      node.vy += (halfY[i] - node.y) * Math.min(2, Math.abs( (halfY[i]-node.y)/halfY[i]*0.1 )) * alpha;    

      if (node.x > x1z[i]) node.x=x1z[i];
      if (node.x < x0z[i]) node.x=x0z[i];
      if (node.y > y1z[i]) node.y=y1z[i];
      if (node.y < y0z[i]) node.y=y0z[i];

    }
  }

  function initialize() {
    if (!nodes) return;
    var i, n = nodes.length;
    strengthsX = new Array(n);
    strengthsY = new Array(n);
    x0z = new Array(n);
    y0z = new Array(n);
    x1z = new Array(n);
    y1z = new Array(n);
    halfY = new Array(n);
    halfX = new Array(n);

    for (i = 0; i < n; ++i) {      
      strengthsX[i] = (isNaN(x0z[i] = +x0(nodes[i], i, nodes)) || 
        isNaN(x1z[i] = +x1(nodes[i], i, nodes))) ? 0 : +strength(nodes[i], i, nodes);
      strengthsY[i] = (isNaN(y0z[i] = +y0(nodes[i], i, nodes)) || 
        isNaN(y1z[i] = +y1(nodes[i], i, nodes))) ? 0 : +strength(nodes[i], i, nodes);
      halfX[i] = x0z[i] + (x1z[i] - x0z[i])/2,
      halfY[i] = y0z[i] + (y1z[i] - y0z[i])/2;

    }
  }

  force.initialize = function(_) {
    nodes = _;
    initialize();
  };
  
  force.x0 = function(_) {
    return arguments.length ? (x0 = typeof _ === "function" ? _ : constant(+_), initialize(), force) : x0;
  };

  force.x1 = function(_) {
    return arguments.length ? (x1 = typeof _ === "function" ? _ : constant(+_), initialize(), force) : x1;
  };
  
  force.y0 = function(_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : constant(+_), initialize(), force) : y0;
  };
  
  force.y1 = function(_) {
    return arguments.length ? (y1 = typeof _ === "function" ? _ : constant(+_), initialize(), force) : y1;
  };
  
  force.strength = function(_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
  };

  return force;
}