import {quadtree} from "d3-quadtree";
import {dispatch as newDispatch} from "d3-dispatch";
import {map as newMap} from "d3-collection";
import {timer as newTimer} from "d3-timer";

export default function(nodes) {
  var simulation,
      iteration = 0,
      alpha = 1,
      alphaMin = 0.0001,
      alphaDecay = -0.02,
      velocityDecay = 0.5,
      force = newMap(),
      tree,
      timer = newTimer(tick),
      dispatch = newDispatch("start", "tick", "end");

  function start() {
    if (iteration < Infinity) {
      iteration = 0, alpha = 1;
    } else {
      iteration = 0, alpha = 1;
      dispatch.call("start", simulation);
      timer.restart(tick);
    }
    return simulation;
  }

  function stop() {
    if (iteration < Infinity) {
      iteration = Infinity, alpha = 0;
      dispatch.call("end", simulation);
      timer.stop();
    }
    return simulation;
  }

  function tick() {
    alpha = Math.exp(++iteration * alphaDecay);
    if (!(alpha > alphaMin)) return stop();
    force.each(apply);

    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i];
      node.x += node.vx *= velocityDecay;
      node.y += node.vy *= velocityDecay;
    }

    tree = null;
    dispatch.call("tick", simulation);
  }

  function initializeNodes() {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i], node.index = i;
      if (isNaN(node.x)) node.x = Math.random() * 100 - 50;
      if (isNaN(node.y)) node.y = Math.random() * 100 - 50;
      if (isNaN(node.vx)) node.vx = 0;
      if (isNaN(node.vy)) node.vy = 0;
    }
  }

  function initializeForce(force) {
    if (force.initialize) force.initialize(simulation);
    return force;
  }

  function apply(force) {
    force(alpha);
  }

  initializeNodes();

  return simulation = {
    start: start,
    stop: stop,
    tick: tick,

    nodes: function(_) {
      return arguments.length ? (nodes = _, initializeNodes(), force.each(initializeForce), simulation) : nodes;
    },

    quadtree: function() {
      if (tree) return tree;

      var i,
          n = nodes.length,
          node,
          x0 = Infinity,
          y0 = Infinity,
          x1 = -Infinity,
          y1 = -Infinity;

      for (i = 0; i < n; ++i) {
        node = nodes[i];
        if (node.x < x0) x0 = node.x;
        if (node.x > x1) x1 = node.x;
        if (node.y < y0) y0 = node.y;
        if (node.y > y1) y1 = node.y;
      }

      tree = quadtree().cover(x0, y0).cover(x1, y1);

      for (i = 0; i < n; ++i) {
        node = nodes[i], tree.add(node.x, node.y).index = i;
      }

      return tree;
    },

    alphaMin: function(_) {
      return arguments.length ? (alphaMin = _, simulation) : alphaMin;
    },

    alphaDecay: function(_) {
      return arguments.length ? (alphaDecay = -_, iteration = Math.round(Math.log(alpha) / alphaDecay), simulation) : -alphaDecay;
    },

    friction: function(_) {
      return arguments.length ? (velocityDecay = 1 - _, simulation) : 1 - velocityDecay;
    },

    force: function(name, _) {
      return arguments.length > 1 ? ((_ == null ? force.remove(name) : force.set(name, initializeForce(_))), simulation) : force.get(name);
    },

    on: function(name, _) {
      return arguments.length > 1 ? (dispatch.on(name, _), simulation) : dispatch.on(name);
    }
  };
}
