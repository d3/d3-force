var tape = require("tape");

tape.Test.prototype.nodeEqual = nodeEqual;

function nodeEqual(actual, expected, delta) {
  delta = delta || 1e-6;
  this._assert(nodeEqual(actual, expected, delta), {
    message: "should be similar",
    operator: "nodeEqual",
    actual: actual,
    expected: expected
  });
  
  function nodeEqual(actual, expected, delta) {
    return actual.index == expected.index
        && Math.abs(actual.x - expected.x) < delta
        && Math.abs(actual.vx - expected.vx) < delta
        && Math.abs(actual.y - expected.y) < delta
        && Math.abs(actual.vy - expected.vy) < delta
        && !(Math.abs(actual.fx - expected.fx) > delta)
        && !(Math.abs(actual.fy - expected.fy) > delta);
  }
}