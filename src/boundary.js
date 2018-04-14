import constant from "./constant";

export default function(x0, y0, x1, y1) {
  var strength = constant(0.1),
      hardBoundary = true,
      border = constant( Math.min((x1 - x0)/2, (y1 - y0)/2) ),
      nodes,
      strengthsX,
      strengthsY,
      x0z, x1z,
      y0z, y1z,
      borderz,
      halfX, halfY;


  if (typeof x0 !== "function") x0 = constant(x0 == null ? -100 : +x0);
  if (typeof x1 !== "function") x1 = constant(x1 == null ? 100 : +x1);
  if (typeof y0 !== "function") y0 = constant(y0 == null ? -100 : +y0);
  if (typeof y1 !== "function") y1 = constant(y1 == null ? 100 : +y1);

  function getVx(halfX, x, strengthX, border, alpha) {
    // var targetX = x > halfX ? (x0 + border) : (x1 - border);
    return (halfX - x) *  Math.min(2, Math.abs( halfX - x) / halfX) * strengthX * alpha;
  }

  function force(alpha) {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i];

      // node.vx += (halfX[i] - node.x) * strengthsX[i] * alpha;
      // node.vy += (halfY[i] - node.y) * strengthsY[i] * alpha;
      // node.vx += (halfX[i] - node.x) * Math.min(2, Math.abs( (halfX[i]-node.x)/halfX[i]*0.1 )) * alpha;
      // node.vy += (halfY[i] - node.y) * Math.min(2, Math.abs( (halfY[i]-node.y)/halfY[i]*0.1 )) * alpha;

      if ((node.x < (x0z[i] + borderz[i]) || node.x > (x1z[i] - borderz[i])) ||
          (node.y < (y0z[i] + borderz[i]) || node.y > (y1z[i] - borderz[i])) ) {
        node.vx += getVx(halfX[i], node.x, strengthsX[i], borderz[i], alpha);
        node.vy += getVx(halfY[i], node.y, strengthsY[i], borderz[i], alpha);
      } else {
        node.vx = 0;
        node.vy = 0;
      }

      if (hardBoundary) {
        if (node.x >= x1z[i]) node.vx += x1z[i] - node.x;
        if (node.x <= x0z[i]) node.vx += x0z[i] - node.x;
        if (node.y >= y1z[i]) node.vy += y1z[i] - node.y;
        if (node.y <= y0z[i]) node.vy += y0z[i] - node.y;
      }
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
    borderz = new Array(n);

    for (i = 0; i < n; ++i) {
      strengthsX[i] = (isNaN(x0z[i] = +x0(nodes[i], i, nodes)) ||
        isNaN(x1z[i] = +x1(nodes[i], i, nodes))) ? 0 : +strength(nodes[i], i, nodes);
      strengthsY[i] = (isNaN(y0z[i] = +y0(nodes[i], i, nodes)) ||
        isNaN(y1z[i] = +y1(nodes[i], i, nodes))) ? 0 : +strength(nodes[i], i, nodes);
      halfX[i] = x0z[i] + (x1z[i] - x0z[i])/2,
      halfY[i] = y0z[i] + (y1z[i] - y0z[i])/2;
      borderz[i] = +border(nodes[i], i, nodes)
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

  force.border = function(_) {
    return arguments.length ? (border = typeof _ === "function" ? _ : constant(+_), initialize(), force) : border;
  };


  force.hardBoundary = function(_) {
    return arguments.length ? (hardBoundary = _, force) : hardBoundary;
  };

  force.visualizeStrength = function(ctx, _alpha) {
    var x, y, vx, vy, step=20,
      line,
      halfX = x0() + (x1() - x0())/2,
      halfY = y0() + (y1() - y0())/2,
      alpha = _alpha !== undefined ? _alpha : 0.7;

    if (!borderz) return;

    ctx.save();
    ctx.globalAlpha= 0.3;


    for (x = x0(); x < x1() ; x += step) {
      for (y  = y0(); y <y1() ; y += step) {
        if ((x < (x0() + borderz[0]) || x > (x1() - borderz[0])) ||
          (y < (y0() + borderz[0]) || y > (y1() - borderz[0])) ) {
          vx = getVx(halfX, x, strength(), borderz[0], alpha);
          vy = getVx(halfY, y, strength(), borderz[0], alpha);
          line = new Line(x, y, x+vx, y+vy);
          line.drawWithArrowheads(ctx);

        }
      }
    }
    ctx.restore();
  }

  function Line(x1,y1,x2,y2){
      this.x1=x1;
      this.y1=y1;
      this.x2=x2;
      this.y2=y2;
  }
  Line.prototype.drawWithArrowheads=function(ctx){

      // arbitrary styling
      ctx.strokeStyle="steelblue";
      ctx.fillStyle="steelblue";
      ctx.lineWidth=1;

      // draw the line
      ctx.beginPath();
      ctx.moveTo(this.x1,this.y1);
      ctx.lineTo(this.x2,this.y2);
      ctx.stroke();

      // // draw the starting arrowhead
      // var startRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
      // startRadians+=((this.x2>this.x1)?-90:90)*Math.PI/180;
      // this.drawArrowhead(ctx,this.x1,this.y1,startRadians);
      // draw the ending arrowhead
      var endRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
      endRadians+=((this.x2 >= this.x1)?90:-90)*Math.PI/180;
      this.drawArrowhead(ctx,this.x2,this.y2,endRadians);


  }
  Line.prototype.drawArrowhead=function(ctx,x,y,radians){
      ctx.save();
      ctx.beginPath();
      ctx.translate(x,y);
      ctx.rotate(radians);
      ctx.moveTo(0,0);
      ctx.lineTo(2,5);
      ctx.lineTo(-2,5);
      ctx.closePath();
      ctx.restore();
      ctx.fill();
  }

  return force;
}