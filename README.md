wolf3d-readyplayerme-three.js-boilerplate
===================

## Important Update

Please use <a href="https://demo.readyplayer.me/">https://demo.readyplayer.me/</a> to create half-body avatars which are compatible with this project.

<hr/>

![screenshot](/screenshot.png)

<sup>Grand Canyon by <a href="https://unsplash.com/@jasonlthompson?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jason Thompson</a> on <a href="/s/photos/great-canyon?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  </sup>

## About
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/egemenertugrul/wolf3d-readyplayerme-threejs-boilerplate/Node.js%20CI) ![GitHub issues](https://img.shields.io/github/issues/egemenertugrul/wolf3d-readyplayerme-threejs-boilerplate) ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/egemenertugrul/wolf3d-readyplayerme-threejs-boilerplate/three) ![GitHub](https://img.shields.io/github/license/egemenertugrul/wolf3d-readyplayerme-threejs-boilerplate)

This starter kit lets you deploy your [Wolf3D/ReadyPlayer.Me](https://readyplayer.me/) avatars on your personal webpage using three.js.

This repository is based on: [superguigui/threejs-starter-kit](https://github.com/superguigui/threejs-starter-kit)

> Special thanks to [Zakir Baytar (@zakirbaytar) ](https://github.com/zakirbaytar) for helping me refactor the code to make it more *human-readable* and maintainable.

## Demo
[[Demo 1](https://egemenertugrul.github.io/wolf3d-readyplayerme-threejs-boilerplate/)]
[[Demo 2](https://egemenertugrul.github.io/about/)]

[![demo](/demo.gif)](https://egemenertugrul.github.io/about/)

## Features
- Deploy [Wolf3D/ReadyPlayer.Me](https://readyplayer.me/) avatars using [three.js](https://threejs.org/)
- ES6 with [Babel](http://babeljs.io) and [Webpack](https://webpack.org).
- Animations and morph targets.
- Cursor tracking.

## Requirements
- node.js & npm

## Usage
After cloning install all node dependencies
```bash
npm i
```

Then launch the main task to open the livereload server  
```bash
npm start
```

You are good to go!

## Deployment
```bash
npm run build
```
Then put the content of the `dist` folder on your server.

Debug tools can be included in development mode. This can be done by using the `DEVELOPMENT` environment variable that is set by webpack.
```js
if (DEVELOPMENT) {
  const gui = require('package-name') // will not be included in production
}
```

## Configuration
1) Create your avatar and place the .glb file in `assets/models`.
2) In `config.js`, edit: 
    - `defaultAvatar.url`
    - `AvatarSettings`
    - `DOMSettings`
3) In `AvatarSettings.morphTargets`, each element has the properties: 
     -  `key` (string)
     -  `targetValue` [0-1]
     -  `transition` (ms)
     -  `duration` (ms)
4) When building and deploying through `npm run build`, have a `div` with id `DOMSettings.avatarDivID` (config.js). E.g.
   ```html
   <div id="3d_avatar"></div>
   ```

>To see available morph targets and animations, view your avatar on: https://gltf-viewer.donmccurdy.com/


## File Structure and Coding Style
- Classes in `src/objects` extend `THREE.Object3D`.
- Factory pattern is used to create `container`, `renderer`, `scene`, and `camera`.
- Builder pattern is used to add components to `Scene` and `Avatar`.
- `THREE` global keyword is avoided.
- Necessary components are imported from `three`: 
```js
import { Object3D, Mesh, MeshBasicMaterial } from 'three'
```

See [superguigui/threejs-starter-kit](https://github.com/superguigui/threejs-starter-kit) for more information.

- Similar to MonoBehaviour class in Unity development, scene objects can implement `update` function to execute at each frame.

``Avatar.js:``
```js
  update(delta) {
    this.rotateHead();
    this.mixer.update(delta);
  }
```

``index.js, render():``
```js
..
scene.main.traverse((element) => element?.update?.(delta));
..
```

