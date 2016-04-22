import {dispatch} from "d3-dispatch";
import {map} from "d3-collection";
import {timer} from "d3-timer";

export function x(d) {
  return d.x;
}

export function y(d) {
  return d.y;
}

export default function(nodes) {
  var simulation,
      iteration = 0,
      alpha = 1,
      alphaMin = 0.0001,
      alphaDecay = -0.02,
      velocityDecay = 0.5,
      force = map(),
      ticker = timer(tick),
      event = dispatch("start", "tick", "end");

  function start() {
    if (iteration < Infinity) {
      iteration = 0, alpha = 1;
    } else {
      iteration = 0, alpha = 1;
      event.call("start", simulation);
      ticker.restart(tick);
    }
    return simulation;
  }

  function stop() {
    if (iteration < Infinity) {
      iteration = Infinity, alpha = 0;
      event.call("end", simulation);
      ticker.stop();
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

    event.call("tick", simulation);
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

    alphaMin: function(_) {
      return arguments.length ? (alphaMin = _, simulation) : alphaMin;
    },

    alphaDecay: function(_) {
      return arguments.length ? (alphaDecay = -_, iteration = alphaDecay ? Math.round(Math.log(alpha) / alphaDecay) : 0, simulation) : -alphaDecay;
    },

    friction: function(_) {
      return arguments.length ? (velocityDecay = 1 - _, simulation) : 1 - velocityDecay;
    },

    force: function(name, _) {
      return arguments.length > 1 ? ((_ == null ? force.remove(name) : force.set(name, initializeForce(_))), simulation) : force.get(name);
    },

    on: function(name, _) {
      return arguments.length > 1 ? (event.on(name, _), simulation) : event.on(name);
    }
  };
}
