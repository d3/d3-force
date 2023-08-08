# d3-force

_Force-directed graph layout using velocity Verlet integration._

## Introduction 👀

This module implements a [velocity Verlet](https://en.wikipedia.org/wiki/Verlet_integration) numerical integrator for simulating physical forces on particles. The simulation is simplified: it assumes a constant unit time step Δ*t* = 1 for each step, and a constant unit mass *m* = 1 for all particles. As a result, a force *F* acting on a particle is equivalent to a constant acceleration *a* over the time interval Δ*t*, and can be simulated simply by adding to the particle’s velocity, which is then added to the particle’s position.

In the domain of information visualization, physical simulations are useful for studying [networks](https://observablehq.com/@d3/force-directed-graph/2) and [hierarchies](https://observablehq.com/@d3/force-directed-tree)!

[<img alt="Force-Directed Graph" src="https://raw.githubusercontent.com/d3/d3-force/master/img/graph.png" width="420" height="219">](https://observablehq.com/@d3/force-directed-graph/2)[<img alt="Force-Directed Tree" src="https://raw.githubusercontent.com/d3/d3-force/master/img/tree.png" width="420" height="219">](https://observablehq.com/@d3/force-directed-tree)

You can also simulate circles (disks) with collision, such as for [bubble charts](http://www.nytimes.com/interactive/2012/09/06/us/politics/convention-word-counts.html):

[<img alt="Collision Detection" src="https://raw.githubusercontent.com/d3/d3-force/master/img/collide.png" width="420" height="219">](https://observablehq.com/@d3/collision-detection)

You can even use it as a rudimentary physics engine, say to simulate cloth:

[<img alt="Force-Directed Lattice" src="https://raw.githubusercontent.com/d3/d3-force/master/img/lattice.png" width="480" height="250">](https://observablehq.com/@d3/force-directed-lattice)

To use this module, create a [simulation](#simulation) for an array of [nodes](#simulation_nodes), and compose the desired [forces](#simulation_force). Then [listen](#simulation_on) for tick events to render the nodes as they update in your preferred graphics system, such as Canvas or SVG.

## Documentation 📚

https://d3js.org/d3-force

## Examples 🖼️

https://observablehq.com/collection/@d3/d3-force

## Installing 🧑‍💻

The fastest way to get started (and get help) with D3 is on [Observable](https://observablehq.com/)! D3 is available by default in notebooks as part of Observable’s standard library, and bundles d3-force. See https://observablehq.com/collection/@d3/d3-force

If you use npm, `npm install d3-force`. You can also download the [latest release on GitHub](https://github.com/d3/d3-force/releases/latest). For vanilla HTML in modern browsers, import d3-force from Skypack:

```html
<script type="module">

import {forceSimulation} from "https://cdn.skypack.dev/d3-force@3";

const simulation = forceSimulation(nodes);

</script>
```

For legacy environments, you can load d3-force’s UMD bundle from an npm-based CDN such as jsDelivr; a `d3` global is exported:

```html
<script src="https://cdn.jsdelivr.net/npm/d3-dispatch@3"></script>
<script src="https://cdn.jsdelivr.net/npm/d3-quadtree@3"></script>
<script src="https://cdn.jsdelivr.net/npm/d3-timer@3"></script>
<script src="https://cdn.jsdelivr.net/npm/d3-force@3"></script>
<script>

const simulation = d3.forceSimulation(nodes);

</script>
```

## Releases 🚀

See our summary [release notes](https://github.com/d3/d3-timer/releases).

## Getting help 🏠

See our [community guide](https://d3js.org/community).

## Contributing 🙏

[Get involved](https://d3js.org/community#getting-involved).
