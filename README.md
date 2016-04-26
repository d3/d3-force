# d3-force

…

## Installing

If you use NPM, `npm install d3-force`. Otherwise, download the [latest release](https://github.com/d3/d3-force/releases/latest). You can also load directly from [d3js.org](https://d3js.org), either as a [standalone library](https://d3js.org/d3-force.v0.2.min.js) or as part of [D3 4.0 alpha](https://github.com/mbostock/d3/tree/4). AMD, CommonJS, and vanilla environments are supported. In vanilla, a `d3_force` global is exported:

```html
<script src="https://d3js.org/d3-collection.v0.1.min.js"></script>
<script src="https://d3js.org/d3-dispatch.v0.4.min.js"></script>
<script src="https://d3js.org/d3-quadtree.v0.7.min.js"></script>
<script src="https://d3js.org/d3-timer.v0.4.min.js"></script>
<script src="https://d3js.org/d3-force.v0.2.min.js"></script>
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

…

<a name="simulation_start" href="#simulation_start">#</a> <i>simulation</i>.<b>start</b>()

…

<a name="simulation_stop" href="#simulation_stop">#</a> <i>simulation</i>.<b>stop</b>()

…

<a name="simulation_tick" href="#simulation_tick">#</a> <i>simulation</i>.<b>tick</b>()

…

<a name="simulation_nodes" href="#simulation_nodes">#</a> <i>simulation</i>.<b>nodes</b>([<i>nodes</i>])

…

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

…

<a name="_force" href="#_force">#</a> <i>force</i>(<i>alpha</i>)

…

<a name="force_initialize" href="#force_initialize">#</a> <i>force</i>.<b>initialize</b>(<i>nodes</i>)

…

#### Centering

…

<a name="forceCenter" href="#forceCenter">#</a> d3.<b>forceCenter</b>([<i>x</i>, <i>y</i>])

…

<a name="center_x" href="#center_x">#</a> <i>center</i>.<b>x</b>([<i>x</i>])

…

<a name="center_y" href="#center_y">#</a> <i>center</i>.<b>y</b>([<i>y</i>])

…

#### Circle Collision

…

<a name="forceCollide" href="#forceCollide">#</a> d3.<b>forceCollide</b>([<i>radius</i>])

…

<a name="collide_radius" href="#collide_radius">#</a> <i>collide</i>.<b>radius</b>([<i>radius</i>])

…

<a name="collide_strength" href="#collide_strength">#</a> <i>collide</i>.<b>strength</b>([<i>strength</i>])

…

#### Containment

…

<a name="forceContain" href="#forceContain">#</a> d3.<b>forceContain</b>([<i>radius</i>[, <i>x</i>, <i>y</i>]])

…

<a name="contain_radius" href="#contain_radius">#</a> <i>contain</i>.<b>radius</b>([<i>radius</i>])

…

<a name="contain_x" href="#contain_x">#</a> <i>contain</i>.<b>x</b>([<i>x</i>])

…

<a name="contain_y" href="#contain_y">#</a> <i>contain</i>.<b>y</b>([<i>y</i>])

…

#### Links

…

<a name="forceLink" href="#forceLink">#</a> d3.<b>forceLink</b>([<i>links</i>])

…

<a name="link_links" href="#link_links">#</a> <i>link</i>.<b>links</b>([<i>links</i>])

…

<a name="link_id" href="#link_id">#</a> <i>link</i>.<b>id</b>([<i>id</i>])

…

<a name="link_strength" href="#link_strength">#</a> <i>link</i>.<b>strength</b>([<i>strength</i>])

…

<a name="link_distance" href="#link_distance">#</a> <i>link</i>.<b>distance</b>([<i>distance</i>])

…

#### Many-Body

…

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

…

<a name="forcePosition" href="#forcePosition">#</a> d3.<b>forcePosition</b>([<i>x</i>, <i>y</i>])

…

<a name="position_strength" href="#position_strength">#</a> <i>position</i>.<b>strength</b>([<i>strength</i>])

…

<a name="position_x" href="#position_x">#</a> <i>position</i>.<b>x</b>([<i>x</i>])

…

<a name="position_y" href="#position_y">#</a> <i>position</i>.<b>y</b>([<i>y</i>])

…
