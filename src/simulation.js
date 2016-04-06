import {timer as newTimer} from "d3-timer";
import {dispatch as newDispatch} from "d3-dispatch";

export default function(nodes) {
  var iteration = 0,
      alphaMin = 0.0001,
      alphaDecay = -0.02,
      velocityDecay = 0.5,
      timer = newTimer(tick),
      dispatch = newDispatch("start", "beforetick", "tick", "end");

  function start() {
    if (iteration < Infinity) {
      iteration = 0;
      dispatch.call("start", this);
      timer.restart(tick);
    } else {
      iteration = 0;
    }
  }

  function stop() {
    if (iteration < Infinity) {
      iteration = Infinity;
      dispatch.call("end", this);
      timer.stop();
    }
  }

  function tick() {
    var alpha = Math.exp(++iteration * alphaDecay);
    if (!(alpha > alphaMin)) return stop();
    dispatch.call("beforetick", this, alpha);

    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i];
      node.x += node.vx *= velocityDecay;
      node.y += node.vy *= velocityDecay;
    }

    dispatch.call("tick", this);
  }

  return {
    nodes: function(_) {
      return arguments.length ? (nodes = _, this) : nodes;
    },
    start: function() {
      return start(), this;
    },
    stop: function() {
      return stop(), this;
    },
    alphaMin: function(_) {
      return arguments.length ? (alphaMin = _, this) : alphaMin;
    },
    alphaDecay: function(_) {
      return arguments.length ? (alphaDecay = -_, this) : -alphaDecay;
    },
    friction: function(_) {
      return arguments.length ? (velocityDecay = 1 - _, this) : 1 - velocityDecay;
    },
    on: function(name, _) {
      return arguments.length > 1 ? (dispatch.on(name, _), this) : dispatch.on(name);
    }
  };
}
