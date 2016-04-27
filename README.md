# d3-force

…

## Installing

If you use NPM, `npm install d3-force`. Otherwise, download the [latest release](https://github.com/d3/d3-force/releases/latest). You can also load directly from [d3js.org](https://d3js.org), either as a [standalone library](https://d3js.org/d3-force.v0.3.min.js) or as part of [D3 4.0 alpha](https://github.com/mbostock/d3/tree/4). AMD, CommonJS, and vanilla environments are supported. In vanilla, a `d3_force` global is exported:

```html
<script src="https://d3js.org/d3-collection.v0.1.min.js"></script>
<script src="https://d3js.org/d3-dispatch.v0.4.min.js"></script>
<script src="https://d3js.org/d3-quadtree.v0.7.min.js"></script>
<script src="https://d3js.org/d3-timer.v0.4.min.js"></script>
<script src="https://d3js.org/d3-force.v0.3.min.js"></script>
<script>

var simulation = d3_force.forceSimulation(nodes);

</script>
```

[Try d3-force in your browser.](https://tonicdev.com/npm/d3-force)

## API Reference

…

### Simulation

…

<a name="forceSimulation" href="#forceSimulation">#</a> d3.<b>forceSimulation</b>([<i>nodes</i>])

Creates a new velocity Verlet simulator with the specified array of [*nodes*](#simulation_nodes) and no [forces](#simulation_force). If *nodes* is not specified, it defaults to the empty array. The simulator [starts](#simulation_restart) automatically; if you wish to run the simulation manually, call [*simulation*.stop](#simulation_stop), and then call [*simulation*.tick](#simulation_tick) as desired.

<a name="simulation_restart" href="#simulation_restart">#</a> <i>simulation</i>.<b>restart</b>()

…

<a name="simulation_stop" href="#simulation_stop">#</a> <i>simulation</i>.<b>stop</b>()

…

<a name="simulation_tick" href="#simulation_tick">#</a> <i>simulation</i>.<b>tick</b>()

Invokes each registered [force](#simulation_force), passing the current *alpha*; then updates the ⟨*x*,*y*⟩ position of each [node](#simulation_nodes) according to the following formula: *position* += *velocity* × (1 - [*drag*](#simulation_drag)). Returns true if the current alpha is less than [*alphaMin*](#simulation_alphaMin), indicating that the simulation would normally stop after this tick, and false otherwise.

The current *alpha* is defined as exp(*iteration* × [*alphaDecay*](#simulation_alphaDecay)) where *iteration* is the number of times this method can be called since the simulation started. Thus, the exact number of iterations needed to terminate the simulation naturally is ⌈log([*alphaMin*](#simulation_alphaMin)) / -[*alphaDecay*](#simulation_alphaDecay)⌉. For example:

```js
for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / -simulation.alphaDecay()); i < n; ++i) {
  simulation.tick();
}
```

Manual invocation is useful for computing [static layouts](http://bl.ocks.org/mbostock/01ab2e85e8727d6529d20391c0fd9a16), such as in a background web worker or on the server.

This method does not dispatch [events](#simulation_on); events are only dispatched by the internal timer when the simulation is started automatically upon [creation](#forceSimulation) or by calling [*simulation*.restart](#simulation_restart).

<a name="simulation_nodes" href="#simulation_nodes">#</a> <i>simulation</i>.<b>nodes</b>([<i>nodes</i>])

…

* `index` - the node’s zero-based index into *nodes*
* `x` - the node’s current *x*-position
* `y` - the node’s current *y*-position
* `vx` - the node’s current *x*-velocity
* `vy` - the node’s current *y*-velocity

<a name="simulation_alphaMin" href="#simulation_alphaMin">#</a> <i>simulation</i>.<b>alphaMin</b>([<i>alpha</i>])

…

<a name="simulation_alphaDecay" href="#simulation_alphaDecay">#</a> <i>simulation</i>.<b>alphaDecay</b>([<i>decay</i>])

…

<a name="simulation_drag" href="#simulation_drag">#</a> <i>simulation</i>.<b>drag</b>([<i>drag</i>])

…

<a name="simulation_force" href="#simulation_force">#</a> <i>simulation</i>.<b>force</b>(<i>name</i>[, <i>force</i>])

…

<a name="simulation_on" href="#simulation_on">#</a> <i>simulation</i>.<b>on</b>(<i>typenames</i>, [<i>callback</i>])

…

### Forces

[Simulations](#simulation) apply arbitrary forces. This module provides several built-in forces for your enjoyment:

* [Centering](#centering)
* [Circle Collision](#circle-collision)
* [Circle Containment](#circle-containment)
* [Links](#links)
* [Many-Body](#many-body)
* [Positioning](#positioning)

You may also implement your own custom force. A force is simply a [function](#_force) that takes the simulation’s current *alpha* and modifies nodes’ positions or velocities. Forces may optionally implement [*force*.initialize](#force_initialize) to receive the simulation’s array of nodes.

<a name="_force" href="#_force">#</a> <i>force</i>(<i>alpha</i>)

…

<a name="force_initialize" href="#force_initialize">#</a> <i>force</i>.<b>initialize</b>(<i>nodes</i>)

…

#### Centering

The centering force moves nodes so that their center of mass (assuming all nodes are equal-weight) is at the given position ⟨[*x*](#center_x),[*y*](#center_y)⟩. (These parameters are only recomputed when the force is initialized, not on every application.)

<a name="forceCenter" href="#forceCenter">#</a> d3.<b>forceCenter</b>([<i>x</i>, <i>y</i>])

…

<a name="center_x" href="#center_x">#</a> <i>center</i>.<b>x</b>([<i>x</i>])

…

<a name="center_y" href="#center_y">#</a> <i>center</i>.<b>y</b>([<i>y</i>])

…

#### Circle Collision

The circle collision force prevents circular nodes with a given [radius](#collide_radius) from overlapping. More formally, two nodes *a* and *b* are separated so that the distance between *a* and *b* is at least *radius*(*a*) + *radius*(*b*). To reduce jitter, this is by default a “soft” constraint with a configurable [strength](#collide_strength). (These parameters are only recomputed when the force is initialized, not on every application.)

<a name="forceCollide" href="#forceCollide">#</a> d3.<b>forceCollide</b>([<i>radius</i>])

…

<a name="collide_radius" href="#collide_radius">#</a> <i>collide</i>.<b>radius</b>([<i>radius</i>])

…

<a name="collide_strength" href="#collide_strength">#</a> <i>collide</i>.<b>strength</b>([<i>strength</i>])

…

<a name="collide_iterations" href="#collide_iterations">#</a> <i>collide</i>.<b>iterations</b>([<i>iterations</i>])

…

#### Circle Containment

The circle containment force constrains nodes to fit within a circle of a given [*radius*](#contain_radius) and center ⟨[*x*](#contain_x),[*y*](#contain_y)⟩. The radius and center can be specified on a per-node basis. (These parameters are only recomputed when the force is initialized, not on every application.)

<a name="forceContain" href="#forceContain">#</a> d3.<b>forceContain</b>([<i>radius</i>[, <i>x</i>, <i>y</i>]])

…

<a name="contain_radius" href="#contain_radius">#</a> <i>contain</i>.<b>radius</b>([<i>radius</i>])

…

<a name="contain_x" href="#contain_x">#</a> <i>contain</i>.<b>x</b>([<i>x</i>])

…

<a name="contain_y" href="#contain_y">#</a> <i>contain</i>.<b>y</b>([<i>y</i>])

…

#### Links

The link force pushes linked nodes closer together or farther apart according to the desired [link distance](#link_distance), which may be specified on a per-node basis. (These parameters are only recomputed when the force is initialized, not on every application.)

<a name="forceLink" href="#forceLink">#</a> d3.<b>forceLink</b>([<i>links</i>])

…

<a name="link_links" href="#link_links">#</a> <i>link</i>.<b>links</b>([<i>links</i>])

…

* `index` - the zero-based index into *links*
* `source` - the link’s source node; see [*simulation*.nodes](#simulation_nodes)
* `target` - the link’s target node; see [*simulation*.nodes](#simulation_nodes)

The source and target properties may be initialized using [*link*.id](#link_id).

<a name="link_id" href="#link_id">#</a> <i>link</i>.<b>id</b>([<i>id</i>])

…

<a name="link_distance" href="#link_distance">#</a> <i>link</i>.<b>distance</b>([<i>distance</i>])

…

<a name="link_strength" href="#link_strength">#</a> <i>link</i>.<b>strength</b>([<i>strength</i>])

…

<a name="link_iterations" href="#link_iterations">#</a> <i>link</i>.<b>iterations</b>([<i>iterations</i>])

…

#### Many-Body

The many-body (or *n*-body) force applies mutally amongst all [nodes](#simulation_nodes). It can be used to simulate gravity (attraction) if the [strength](#manyBody_strength) is positive, or eletrical charge (repulsion) if the strength is negative. This implementation uses quadtrees and the [Barnes–Hut approximation](https://en.wikipedia.org/wiki/Barnes–Hut_simulation) to greatly improve performance; the accuracy can be customized using the [theta](#manyBody_theta) parameter. The strength can be specified on a per-node basis. (This parameter is only recomputed when the force is initialized, not on every application.)

<a name="forceManyBody" href="#forceManyBody">#</a> d3.<b>forceManyBody</b>()

…

<a name="manyBody_strength" href="#manyBody_strength">#</a> <i>manyBody</i>.<b>strength</b>([<i>strength</i>])

…

<a name="manyBody_theta" href="#manyBody_theta">#</a> <i>manyBody</i>.<b>theta</b>([<i>theta</i>])

…

<a name="manyBody_distanceMin" href="#manyBody_distanceMin">#</a> <i>manyBody</i>.<b>distanceMin</b>([<i>distance</i>])

…

<a name="manyBody_distanceMax" href="#manyBody_distanceMax">#</a> <i>manyBody</i>.<b>distanceMax</b>([<i>distance</i>])

…

#### Positioning

The positioning force pushes nodes towards a desired position ⟨[*x*](#position_x),[*y*](#position_y)⟩. The position and [strength](#position_strength) can be specified on a per-node basis. (These parameters are only recomputed when the force is initialized, not on every application.)

<a name="forcePosition" href="#forcePosition">#</a> d3.<b>forcePosition</b>([<i>x</i>, <i>y</i>])

…

<a name="position_strength" href="#position_strength">#</a> <i>position</i>.<b>strength</b>([<i>strength</i>])

…

<a name="position_x" href="#position_x">#</a> <i>position</i>.<b>x</b>([<i>x</i>])

…

<a name="position_y" href="#position_y">#</a> <i>position</i>.<b>y</b>([<i>y</i>])

…
