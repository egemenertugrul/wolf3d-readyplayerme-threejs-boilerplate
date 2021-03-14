wolf3d-readyplayerme-three.js-boilerplate
===================

![screenshot](/screenshot.png)

<sup>Grand Canyon by <a href="https://unsplash.com/@jasonlthompson?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jason Thompson</a> on <a href="/s/photos/great-canyon?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  </sup>

## About
This starter kit lets you deploy your Wolf3D/ReadyPlayer.Me avatars on your personal webpage using three.js.

This repository is based on: [superguigui/threejs-starter-kit](https://github.com/superguigui/threejs-starter-kit)

## Demo
See: https://egemenertugrul.github.io/about/

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
1) In `index.js`, edit: 
    - `ASSET_SETTINGS`
    - `AVATAR_SETTINGS`
    - `DOM_SETTINGS`
2) In `index.js`, construct `Avatar` instance with parameters: 
   - `isTrackCursor` (default: true)
   - `isAutoAnimated` (default: true)
   - `isAutoMorphAnimated` (default: true)
   - `morphTargets`
   - `defaultAnimation`
3) In `objects/Avatar.js`, the `morphTargetAnimator.addRange(..)` function takes in the morph target parameters: 
     -  `key` (string)
     -  `targetValue` [0-1]
     -  `transition` (ms)
     -  `duration` (ms)
4) When building and deploying through `npm run build`, have a `div` with id `DOM_SETTINGS.avatarDivID` (index.js). E.g.
   ```html
   <div id="3d_avatar"></div>
   ```

To see available morph targets and animations, view your avatar on: https://gltf-viewer.donmccurdy.com/


## File Structure and coding style
- "Objects" classes in `src/objects` extend `THREE.Object3D`.
- `THREE` global keyword is avoided.
- Necessary components are imported from `three`: 
```js
import { Object3D, Mesh, MeshBasicMaterial } from 'three'
```

See [superguigui/threejs-starter-kit](https://github.com/superguigui/threejs-starter-kit) for more information.

- Similar to MonoBehaviour class in Unity development, scene objects can implement `update` function to execute at each frame.

Avatar.js:
```js
 update(scene, camera, renderer, delta) {
    this.rotateHead(delta);
    this.mixer.update(delta);
  }
```
index.js, render():
```js
..
scene.traverse(function(element) {
    if (element.update != null) {
        element.update(scene, camera, renderer, mixerUpdateDelta);
    }
  })
..
```

