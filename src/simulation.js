import {timer as newTimer} from "d3-timer";
import {dispatch as newDispatch} from "d3-dispatch";

export default function(nodes) {
  var frame = 0,
      frameMax = 300,
      alphaDecay = -0.03,
      velocityDecay = 0.9,
      timer = newTimer(tick),
      dispatch = newDispatch("start", "beforetick", "tick", "end");

  function start() {
    if (frame < Infinity) {
      frame = 0;
      dispatch.call("start", this);
      timer.restart(tick);
    } else {
      frame = 0;
    }
  }

  function stop() {
    if (frame < Infinity) {
      frame = Infinity;
      dispatch.call("end", this);
      timer.stop();
    }
  }

  function tick() {
    if (++frame > frameMax) return stop();

    dispatch.call("beforetick", this, Math.exp(frame * alphaDecay));

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
    frameMax: function(_) {
      return arguments.length ? (frameMax = _, this) : frameMax;
    },
    alphaDecay: function(_) {
      return arguments.length ? (alphaDecay = +_, this) : alphaDecay;
    },
    friction: function(_) {
      return arguments.length ? (velocityDecay = 1 - _, this) : 1 - velocityDecay;
    },
    on: function(name, _) {
      return arguments.length > 1 ? (dispatch.on(name, _), this) : dispatch.on(name);
    }
  };
}
