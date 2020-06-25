// https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
const a = 1664525,
      c = 1013904223,
      m = 4294967296;
let s = 1;
export default function(seed) {
  return (s = seed || (a * s + c) % m) / m * 1e-6;
}
