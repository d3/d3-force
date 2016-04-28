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

Invokes each registered [force](#simulation_force), passing the current *alpha*; then updates the positions and velocities of each [node](#simulation_nodes) according to the following formula: *velocity* \*= 1 - [*drag*](#simulation_drag), *position* += *velocity*. Returns true if the current alpha is less than [*alphaMin*](#simulation_alphaMin), indicating that the simulation would normally stop after this tick, and false otherwise.

The current *alpha* is defined as exp(*iteration* × [*alphaDecay*](#simulation_alphaDecay)) where *iteration* is the number of times this method has been called since the simulation started. Thus, the exact number of iterations needed to terminate the simulation naturally is ⌈log([*alphaMin*](#simulation_alphaMin)) / -[*alphaDecay*](#simulation_alphaDecay)⌉. For example, to run the simulation manually, as when computing a [static layout](http://bl.ocks.org/mbostock/01ab2e85e8727d6529d20391c0fd9a16) in a background web worker or on the server:

```js
for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / -simulation.alphaDecay()); i < n; ++i) {
  simulation.tick();
}
```

This method does not dispatch [events](#simulation_on); events are only dispatched by the internal timer when the simulation is started automatically upon [creation](#forceSimulation) or by calling [*simulation*.restart](#simulation_restart).

<a name="simulation_nodes" href="#simulation_nodes">#</a> <i>simulation</i>.<b>nodes</b>([<i>nodes</i>])

If *nodes* is specified, sets the simulation’s nodes to the specified array, initializing their positions and velocities if necessary, and then [re-initializes](#force_initialize) any bound [forces](#simulation_force); returns the simulation. If *nodes* is not specified, returns the simulation’s array of nodes as specified to the [constructor](#forceSimulation). Each *node* must be an object; the following properties are initialized by the simulation:

* `index` - the node’s zero-based index into *nodes*
* `x` - the node’s current *x*-position
* `y` - the node’s current *y*-position
* `vx` - the node’s current *x*-velocity
* `vy` - the node’s current *y*-velocity

The position ⟨*x*,*y*⟩ and velocity ⟨*vx*,*vy*⟩ may be subsequently modified by [forces](#forces) and by the simulation. If either *vx* or *vy* is NaN, the velocity is initialized to ⟨0,0⟩. If either *x* or *y* is NaN, the position is initialized to with radius 10 * √*index* and angle π * (3 - √5), resulting in a [phyllotaxis arrangement](http://bl.ocks.org/mbostock/11478058), so chosen because nodes are distributed deterministically with uniform density around the origin.

If the specified array of *nodes* is modified, such as when nodes are added to or removed from the simulation, this method must be called again with the new (or changed) array to notify the simulation and bound forces of the change; the simulation does not make a defensive copy of the specified array.

<a name="simulation_alphaMin" href="#simulation_alphaMin">#</a> <i>simulation</i>.<b>alphaMin</b>([<i>alpha</i>])

If *alpha* is specified, sets the minimum alpha to the specified number and returns this simulation. If *alpha* is not specified, returns the current minimum alpha value, which defaults to 0.001. The minimum alpha value determines when the simulation will stop automatically: when the current alpha is less than the minimum alpha. Assuming the default [alpha decay rate](#simulation_alphaDecay) of 0.02, this corresponds to 346 iterations.

<a name="simulation_alphaDecay" href="#simulation_alphaDecay">#</a> <i>simulation</i>.<b>alphaDecay</b>([<i>decay</i>])

If *decay* is specified, sets the [exponential decay](https://en.wikipedia.org/wiki/Exponential_decay) rate constant λ to the specified number and returns this simulation. If *decay* is not specified, returns the current alpha decay rate, which defaults to 0.02. The alpha decay rate determines how quickly the simulation stabilizes. Higher values cause the simulation to stabilize more quickly, but risk getting stuck in a local minimum; lower values cause the simulation to take longer to run, but typically converge on a better layout. To have the simulation run forever, set the *decay* rate to zero.

<a name="simulation_drag" href="#simulation_drag">#</a> <i>simulation</i>.<b>drag</b>([<i>drag</i>])

If *drag* is specified, sets the drag factor to the specified number in the range [0,1] and returns this simulation. If *drag* is not specified, returns the current drag factor, which defaults to 0.4. The drag factor affects how quickly nodes’ velocities decay; at each [tick](#simulation_tick), the velocities are updated according to the following formula: *velocity* \*= 1 - *drag*. As with lowering the [alpha decay rate](#simulation_alphaDecay), less drag may converge on a better solution, but it also risks numerical instabilities and oscillations.

<a name="simulation_force" href="#simulation_force">#</a> <i>simulation</i>.<b>force</b>(<i>name</i>[, <i>force</i>])

If *force* is specified, assigns the [force](#forces) for the specified *name* and returns this simulation. If *force* is not specified, returns the force with the specified name, or undefined if there is no such force. (By default, new simulations have no forces.) For example, to create a new simulation to layout a graph, you might say:

```js
var simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody())
    .force("link", d3.forceLink(links))
    .force("center", d3.forceCenter());
```

<a name="simulation_on" href="#simulation_on">#</a> <i>simulation</i>.<b>on</b>(<i>typenames</i>, [<i>listener</i>])

If *listener* is specified, sets the event *listener* for the specified *typenames* and returns this simulation. If an event listener was already registered for the same type and name, the existing listener is removed before the new listener is added. If *listener* is null, removes the current event listeners for the specified *typenames*, if any. If *listener* is not specified, returns the first currently-assigned listener matching the specified *typenames*, if any. When a specified event is dispatched, each *listener* will be invoked with the `this` context as the simulation.

The *typenames* is a string containing one or more *typename* separated by whitespace. Each *typename* is a *type*, optionally followed by a period (`.`) and a *name*, such as `tick.foo` and `tick.bar`; the name allows multiple listeners to be registered for the same *type*. The *type* must be one of the following:

* `tick` - after each [tick](#simulation_tick) of the simulation.
* `end` - after the simulation ends, when *alpha* < [*alphaMin*](#simulation_alphaMin).

See [*dispatch*.on](https://github.com/d3/d3-dispatch#dispatch_on) for details.

### Forces

A *force* is simply a function that modifies nodes’ positions or velocities; in this context, a *force* can apply a classical physical force such as electrical charge or gravity, or it can resolve a geometric constraint, such as keeping nodes within a bounding box or keeping linked nodes a fixed distance apart. For example, a simple positioning force that moves nodes towards the origin ⟨0,0⟩ might be implemented as:

```js
function force(alpha) {
  for (var i = 0, n = nodes.length, node, k = alpha * 0.1; i < n; ++i) {
    node = nodes[i];
    node.vx -= node.x * k;
    node.vy -= node.y * k;
  }
}
```

Forces typically read the node’s current position ⟨*x*,*y*⟩ and then add to (or subtract from) the node’s velocity ⟨*vx*,*vy*⟩. However, forces may also “peek ahead” to the anticipated next position of the node, ⟨*x* + *vx*,*y* + *vy*⟩; this is necessary for resolving geometric constraints through [iterative relaxation](https://en.wikipedia.org/wiki/Relaxation_\(iterative_method\)). Forces may also modify the position directly, which is sometimes useful to avoid adding energy to the simulation, such as when recentering the simulation in the viewport.

Simulations typically compose multiple forces as desired. This module provides several for your enjoyment:

* [Centering](#centering)
* [Circle Collision](#circle-collision)
* [Circle Containment](#circle-containment)
* [Links](#links)
* [Many-Body](#many-body)
* [Positioning](#positioning)

Forces may optionally implement [*force*.initialize](#force_initialize) to receive the simulation’s array of nodes.

<a name="_force" href="#_force">#</a> <i>force</i>(<i>alpha</i>)

Applies this force, optionally observing the specified *alpha*. Typically, the force is applied to the array of nodes previously passed to [*force*.initialize](#force_initialize), however, some forces may apply to a subset of nodes, or behave differently. For example, [d3.forceLink](#links) applies to the source and target of each link.

<a name="force_initialize" href="#force_initialize">#</a> <i>force</i>.<b>initialize</b>(<i>nodes</i>)

Assigns the array of *nodes* to this force. This method is called when a force is bound to a simulation via [*simulation*.force](#simulation_force) and when the simulation’s nodes change via [*simulation*.nodes](#simulation_nodes). A force may perform necessary work during initialization, such as evaluating per-node parameters, to avoid repeatedly performing work during each application of the force.

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

If *links* is specified, sets the layout's associated links to the specified array. If *links* is not specified, returns the current array, which defaults to the empty array. Each link has the following attributes:

* source - the source node (an element in *nodes*).
* target - the target node (an element in *nodes*).

Note: the values of the source and target attributes may be initially specified as indexes into the *nodes* array; these will be replaced by references after the call to [start](#start). Link objects may have additional fields that you specify; this data can be used to compute link [strength](Force-Layout#linkStrength) and [distance](Force-Layout#linkDistance) on a per-link basis using an accessor function.

<a name="link_links" href="#link_links">#</a> <i>link</i>.<b>links</b>([<i>links</i>])

…

* `index` - the zero-based index into *links*
* `source` - the link’s source node; see [*simulation*.nodes](#simulation_nodes)
* `target` - the link’s target node; see [*simulation*.nodes](#simulation_nodes)

The source and target properties may be initialized using [*link*.id](#link_id).

<a name="link_id" href="#link_id">#</a> <i>link</i>.<b>id</b>([<i>id</i>])

If *id* is specified, sets the string identifier of linking to the specified value.

<a name="link_distance" href="#link_distance">#</a> <i>link</i>.<b>distance</b>([<i>distance</i>])

…

<a name="link_strength" href="#link_strength">#</a> <i>link</i>.<b>strength</b>([<i>strength</i>])

If *strength* is specified, sets the strength (rigidity) of links to the specified value in the range [0,1]. If *strength* is not specified, returns the layout's current link strength, which defaults to 1. If *strength* is a constant, then all links have the same strength. Otherwise, if *strength* is a function, then the function is evaluated for each link (in order), being passed the link and its index, with the `this` context as the force layout; the function's return value is then used to set each link's strength. The function is evaluated whenever the layout [starts](Force-Layout#start).

<a name="link_iterations" href="#link_iterations">#</a> <i>link</i>.<b>iterations</b>([<i>iterations</i>])

If *distance* is specified, sets the target distance between linked nodes to the specified value. If *distance* is not specified, returns the layout's current link distance, which defaults to 20. If *distance* is a constant, then all links are the same distance. Otherwise, if *distance* is a function, then the function is evaluated for each link (in order), being passed the link and its index, with the `this` context as the force layout; the function's return value is then used to set each link's distance. The function is evaluated whenever the layout [starts](Force-Layout#start).

Links are not implemented as "spring forces", as is common in other force-directed layouts, but as weak geometric constraints. For each tick of the layout, the distance between each pair of linked nodes is computed and compared to the target distance; the links are then moved towards each other, or away from each other, so as to converge on the desired distance. This method of constraints relaxation on top of position Verlet integration is vastly more stable than previous methods using spring forces, and also allows for the flexible implementation of [other constraints](http://www.csse.monash.edu.au/~tdwyer/Dwyer2009FastConstraints.pdf) in the tick event listener, such as hierarchical layering.


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
