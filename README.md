# Phelem.js

> Awesome web experience powered by physics

> Version 0.0.1

## What is Phelem.js?
**Phelem.js** (short for **ph**ysical **elem**ents) is a simple JavaScript library that transforms DOM elements into (simulated) physical objects which are then affected by browser events such as scrolling, dragging, typing and mouse movements; the effect looks and *feels* awesome!

Take a look at the examples [here](http://haris2201.github.io/phelem-js/).

## Getting Started
### Download
First of all you have to download `phelem.min.js`. You can get the latest build from [here](https://raw.githubusercontent.com/Haris2201/phelem-js/master/build/phelem.min.js).

### Include the script
After downloading the latest version you need to include `phelem.min.js` by adding this line to your document's header.

```html
<script type="text/javascript" src="phelem.min.js"></script>
```
### Transform elements into physical objects
By adding `data-phelem` to a DOM element, Phelem.js transforms it into a (simulated) physical element; that won't do anything (yet) since there is no force applied to the element yet. You can add `data-phelem-events="scroll"` to the element so that it acts like it's affected by the 'scrolling force' which is applied to the element every time the user scrolls up or down (or even left or right).

Here is an example for that:
```html
<img ... data-phelem="true" data-phelem-events="scroll"/>
```

## Phelem.js attributes
### Transform elements
```html
data-phelem="true"
```
Transforming elements into physical elements is done by simply adding `data-phelem` as an attribute to the element's HTML tag.
Phelem.js filters the elements from the DOM once the document is loaded and transforms all elements with this attribute set to `true`.

### Events
```html
data-phelem-events="..."
```
There are currently 4 events available to choose from:
* **drag**: the user applies force by dragging the element
* **key**: the user applies force by pressing keys on the keyboard (best used for text inputs)
* **mouse**: the user applies force by moving the mouse over the element
* **scroll**: the user applies force by scrolling around the page; the force is applied to all elements listening to the *scroll* event at once

You can make an element listen to multiple events by separating event names with a comma.
```html
data-phelem-events="drag,key,mouse,scroll"
```

### Mass
```html
data-phelem-mass="5"
```
You can change an elements mass by adding the `data-phelem-mass` attribute to its tag; the default value for mass is `1`, an element with a highger mass will appear heavier, an element with a lower mass lighter.

### Friction
```html
data-phelem-friction=".85"
```
Changing the friction of an element will change its behaviour; you can think of it like you would change the elements material, a friction higher than .95 acts like ice and a friction lower than .75 acts like rubber. The default value is `.9`.

The higher the number, the lower the friction and vise versa. Do not set the friction higher than `1` or lower than `0`.

## Development
### Build
Phelem.js uses grunt as its default task runner; simply run `grunt` to create a new build and make grunt watch and rebuild Phelem.js whenever you change something.
```shell
grunt [concat|uglify|watch]
```
The concatenated version is located at `builds/phelem.js` and the minified version is located at `builds/phelem.min.js`.

### Contributing
You found a bug or you want more features added to the project? You can report all kinds of issues (and requests) [here](https://github.com/Haris2201/phelem-js/issues).

Also feel free to contact me via Twitter ([@hariscolt](https://twitter.com/hariscolt)) if you have any questions.

## License
This project is licensed under the MIT License (MIT).

See [LICENSE](LICENSE).
