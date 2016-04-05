import {timer as newTimer} from "d3-timer";
import {dispatch as newDispatch} from "d3-dispatch";
import {map as newMap} from "d3-collection";

export default function(nodes) {
  var alphaMax = 0.1,
      alphaMin = 0.001,
      alphaDecay = 0.99,
      alpha = alphaMax,
      timer = newTimer(tick),
      force = newMap(),
      dispatch = newDispatch("start", "tick", "end");

  function set(x) {
    if (!((x = +x) > 0)) {
      if (alpha > 0) {
        alpha = 0;
        dispatch.call("end", this);
        timer.stop();
      }
    } else {
      if (!(alpha > 0)) {
        alpha = x;
        dispatch.call("start", this);
        timer.restart(tick);
      } else {
        alpha = x;
      }
    }
  }

  function tick() {
    if ((alpha *= alphaDecay) <= alphaMin) return set(0);

    force.each(apply);

    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i];
      node.x -= node.px - (node.px = node.x);
      node.y -= node.py - (node.py = node.y);
    }

    dispatch.call("tick", this);
  }

  function apply(force) {
    force(nodes, alpha);
  }

  return {
    nodes: function(_) {
      return arguments.length ? (nodes = _, this) : nodes;
    },
    start: function() {
      return set(alphaMax), this;
    },
    stop: function() {
      return set(0), this;
    },
    alpha: function(_) {
      return arguments.length ? (set(+_), this) : alpha;
    },
    alphaRange: function(_) {
      return arguments.length ? (alphaMax = +_[0], alphaMin = +_[1], this) : [alphaMax, alphaMin];
    },
    alphaDecay: function(_) {
      return arguments.length ? (alphaDecay = +_, this) : alphaDecay;
    },
    force: function(name, _) {
      return arguments.length > 1 ? (force.set(name, _), this) : force.get(name);
    },
    on: function(name, _) {
      return arguments.length > 1 ? (dispatch.on(name, _), this) : dispatch.on(name);
    }
  };
}
